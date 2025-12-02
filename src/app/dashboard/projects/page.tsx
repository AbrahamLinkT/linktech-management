"use client";
import { useMemo, useEffect, useState } from "react";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { ContentBody } from "@/components/containers/containers";
import { useProjectManagers } from "@/hooks/useProjectManagers";
import { buildApiUrl, API_CONFIG } from '../../../config/api';

// Definimos el tipo de cada proyecto basado en la respuesta del API
type Project = {
  id: number;
  name: string;
  description: string;
  status: boolean;
  start_date: string;
  end_date: string;
  oi: string;
  id_project_manager: number | null;
  client_id: number | null;
  created_at?: string;
  updated_at?: string;
};

// Tipo para la tabla (adaptado para la visualización)
type ProjectTableRow = {
  id: string;
  ordenInterna: string;
  titulo: string;
  cliente: string;
  descripcion: string;
  fechaIn: string;
  fechaFn: string;
  estatus: string;
  responsable: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  
  // Hook para obtener project managers
  const { projectManagers, useAutoLoadProjectManagers } = useProjectManagers();
  
  // Cargar project managers automáticamente
  useAutoLoadProjectManagers();

  // Log cuando cambie la selección
  useEffect(() => {
    console.log('Row selection changed:', rowSelection);
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    console.log('Selected project IDs:', selectedIds);
  }, [rowSelection]);

  // Cargar proyectos al montar el componente
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching projects from:', buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS));
        
        const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw projects data received:', data);
        console.log('Data type:', typeof data);
        console.log('Is array:', Array.isArray(data));
        
        // Verificar si data es un array directamente o está anidado
        let projectsArray = data;
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          // Si no es array, buscar el array de proyectos en las propiedades
          if (data.projects) projectsArray = data.projects;
          else if (data.data) projectsArray = data.data;
          else if (data.results) projectsArray = data.results;
        }
        
        console.log('Final projects array:', projectsArray);
        
        if (Array.isArray(projectsArray)) {
          setProjects(projectsArray);
        } else {
          console.error('Data is not an array:', projectsArray);
          setProjects([]);
        }
        
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido al cargar proyectos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Columnas de la tabla
  const columns = useMemo<MRT_ColumnDef<ProjectTableRow>[]>(() => [
    { accessorKey: "ordenInterna", header: "Orden Interna" },
    { accessorKey: "titulo", header: "Nombre" },
    { accessorKey: "cliente", header: "Cliente" },
    { accessorKey: "descripcion", header: "Descripción" },
    {
      accessorKey: "fechaIn",
      header: "Fecha Inicio",
    },
    {
      accessorKey: "fechaFn",
      header: "Fecha Fin",
    },
    { accessorKey: "estatus", header: "Estatus" },
    { accessorKey: "responsable", header: "Responsable" },
  ], []);

  // Transformar los datos del API al formato que espera la tabla
  const data: ProjectTableRow[] = useMemo(() => {
    console.log('Transforming projects data:', projects);
    console.log('Available project managers:', projectManagers);
    
    const transformedData = projects.map(project => {
      // Buscar el project manager por ID
      const projectManager = projectManagers.find(pm => pm.id === project.id_project_manager);
      const responsableName = projectManager ? projectManager.name : 
                             project.id_project_manager ? `PM ${project.id_project_manager}` : 'Sin asignar';
      
      console.log(`Project ${project.name} - PM ID: ${project.id_project_manager}, Found PM: ${projectManager?.name || 'Not found'}`);
      
      return {
        id: project.id.toString(),
        ordenInterna: project.oi || '',
        titulo: project.name,
        cliente: project.client_id ? `Cliente ${project.client_id}` : 'Sin asignar',
        descripcion: project.description || '',
        fechaIn: project.start_date ? new Date(project.start_date).toLocaleDateString() : '',
        fechaFn: project.end_date ? new Date(project.end_date).toLocaleDateString() : '',
        estatus: project.status ? 'Activo' : 'Inactivo',
        responsable: responsableName,
      };
    });
    console.log('Transformed data:', transformedData);
    console.log('IDs for selection:', transformedData.map(item => item.id));
    return transformedData;
  }, [projects, projectManagers]); // Agregar projectManagers como dependencia

  // Mostrar loading o error
  if (isLoading) {
    return (
      <ContentBody title="Proyectos">
        <div className="flex justify-center items-center p-8">
          <div className="text-lg">Cargando proyectos... ({projects.length} encontrados)</div>
        </div>
      </ContentBody>
    );
  }

  if (error) {
    return (
      <ContentBody title="Proyectos">
        <div className="flex flex-col justify-center items-center p-8 space-y-4">
          <div className="text-red-600 text-lg">Error: {error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Reintentar
          </button>
        </div>
      </ContentBody>
    );
  }

  console.log('Rendering table with projects:', projects.length, 'data rows:', data.length);
  console.log('Current rowSelection state:', rowSelection);

  return (
    <ContentBody
      title="Proyectos"
    >
      <DataTable<ProjectTableRow>
        //title_add="Agregar"
        //ModalAdd={<h1>Agregar</h1>}
        urlRoute="/dashboard/projects/show?id="
        urlRouteAdd="/dashboard/projects/new"
        urlRouteEdit="/dashboard/projects/edit/"
        menu={true}
        data={data}
        columns={columns}
        actions={{ edit: true, add: true }}
        edit={true}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />
    </ContentBody>
  );
}
