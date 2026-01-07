"use client";
import { useMemo, useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { ContentBody } from "@/components/containers/containers";
import { useClients } from "@/hooks/useClients";
import { useWorkers } from "@/hooks/useWorkers";
import { buildApiUrl, API_CONFIG } from '../../../config/api';

// Define el tipo del proyecto desde la API
type Project = {
  project_id: number;
  project_name: string;
  project_code: string;
  order_int: number;
  project_description: string;
  client_id: number;
  employee_id: number;
  status: string;
  project_type: string;
  estimated_hours: number;
  budget_amount: number;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
};

// Type for table display
type ProjectTableRow = {
  id: string;
  projectCode: string;
  projectName: string;
  clientName: string;
  employeeName: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  hours: number;
  budget: number;
  active: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  
  // Hooks para obtener datos
  const { data: clients } = useClients();
  const { data: workers } = useWorkers();

  // Log when selection changes
  useEffect(() => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    console.log('Selected project IDs:', selectedIds);
  }, [rowSelection]);

  // Load projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS + '/dto'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Handle both array and object responses
        let projectsArray = Array.isArray(data) ? data : data?.data || data?.projects || [];
        
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

  // Table columns
  const columns = useMemo<MRT_ColumnDef<ProjectTableRow>[]>(() => [
    { accessorKey: "projectCode", header: "Código" },
    { accessorKey: "projectName", header: "Nombre" },
    { accessorKey: "clientName", header: "Cliente" },
    { accessorKey: "employeeName", header: "Responsable" },
    { accessorKey: "type", header: "Tipo" },
    { accessorKey: "status", header: "Estado" },
    { accessorKey: "startDate", header: "Inicio" },
    { accessorKey: "endDate", header: "Fin" },
    { accessorKey: "hours", header: "Horas Est." },
    { accessorKey: "budget", header: "Presupuesto" },
    { accessorKey: "active", header: "Activo" },
  ], []);

  // Transform API data to table format
  const data: ProjectTableRow[] = useMemo(() => {
    return projects.map(project => {
      const client = clients.find(c => parseInt(c.id as any) === project.client_id);
      const employee = workers?.find(w => w.id === project.employee_id);
      
      return {
        id: project.project_id.toString(),
        projectCode: project.project_code,
        projectName: project.project_name,
        clientName: client?.clientName || 'Sin cliente',
        employeeName: employee?.name || 'Sin asignar',
        type: project.project_type === 'CLIENT' ? 'Cliente' : project.project_type === 'INTERNAL' ? 'Interno' : 'Investigación',
        status: project.status === 'PLANNED' ? 'Planeado' : project.status === 'IN_PROGRESS' ? 'En Progreso' : project.status === 'COMPLETED' ? 'Completado' : 'Cancelado',
        startDate: project.start_date ? new Date(project.start_date).toLocaleDateString() : '',
        endDate: project.end_date ? new Date(project.end_date).toLocaleDateString() : '',
        hours: project.estimated_hours,
        budget: project.budget_amount,
        active: project.active ? 'Sí' : 'No',
      };
    });
  }, [projects, clients, workers]);

  // Show loading or error
  if (isLoading) {
    return (
      <ContentBody title="Proyectos">
        <div className="flex justify-center items-center p-8">
          <div className="text-lg">Cargando proyectos...</div>
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

  return (
    <ProtectedRoute requiredPermission="projects">
      <ContentBody
        title="Proyectos"
      >
        <DataTable<ProjectTableRow>
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
    </ProtectedRoute>
  );
}
