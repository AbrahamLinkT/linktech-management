"use client";

import { ContentBody } from "@/components/containers/containers";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/tables/table_master";
import { MRT_ColumnDef } from "material-react-table";
import { useMemo, useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, IconButton, TextField, Typography, Autocomplete } from "@mui/material";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { useAssignedHours } from "@/hooks/useAssignedHours";
import { useWorkers } from "@/hooks/useWorkers";


// =================== TIPOS ===================
type RowData = {
  id: string;
  consultor: string;
  departamento: string;
  tipoEmpleado: string;
  esquema: string;
  tiempo: string;
  modulo: string;
  nivel: string;
  ubicacion: string;
  proyecto: string;
};

// =================== MOCK DATA ===================
// Datos mock removidos - ahora se cargan desde la API

// =================== COMPONENTE ===================
export default function ProyeccionPage() {
  // ------------------- HOOKS API ------------------
  const { projects, getProjects, isLoading: projectsLoading, error: projectsError } = useProjects();
  const { 
    getAssignedHours,
    getWorkersForAssignedHours,
    deleteAssignedHour,
    createAssignedHours
  } = useAssignedHours();
  const { data: workers } = useWorkers();
  
  // ------------------- STATE ------------------
  const [selectedModalRows, setSelectedModalRows] = useState<Record<number, boolean>>({});
  const [modalDesde, setModalDesde] = useState<string>("");
  const [modalHasta, setModalHasta] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectSearch, setProjectSearch] = useState("");
  const [tableDataFromApi, setTableDataFromApi] = useState<RowData[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  
  // Estados para filtros del modal
  const [filterName, setFilterName] = useState<string>("");
  const [filterSpecialty, setFilterSpecialty] = useState<string>("");
  const [filterLevel, setFilterLevel] = useState<string>("");

  // ------------------- ROUTE -----------------
  const router = useRouter();

  // ------------------- CARGAR SOLO NOMBRES DE PROYECTOS -----------------
  useEffect(() => {
    const loadProjectNames = async () => {
      try {
        await getProjects();
        console.log('✅ Nombres de proyectos cargados');
      } catch (error) {
        console.error('❌ Error cargando nombres de proyectos:', error);
      }
    };
    
    loadProjectNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------- CARGAR HORAS ASIGNADAS POR PROYECTO SELECCIONADO -----------------
  useEffect(() => {
    const loadProjectData = async () => {
      if (!selectedProject) {
        setTableDataFromApi([]);
        return;
      }

      try {
        // Encontrar el proyecto seleccionado para obtener su ID
        const projectObj = projects.find(p => p.name === selectedProject);
        if (!projectObj) {
          console.error('Proyecto no encontrado');
          return;
        }

        // Obtener todas las horas asignadas
        const allHours = await getAssignedHours();
        
        // Filtrar por proyecto ID
        const projectHours = allHours.filter(h => h.projectId === projectObj.id);
        console.log(`📊 Horas asignadas para proyecto ${projectObj.name}:`, projectHours);

        // Obtener información de los trabajadores
        const workers = await getWorkersForAssignedHours(projectHours);
        console.log('👥 Trabajadores cargados:', workers);

        // Transformar datos para la tabla
        const tableData: RowData[] = projectHours.map(hour => {
          const worker = workers.find(w => w.id === hour.assignedTo);
          
          return {
            id: String(hour.id),
            consultor: hour.nameAssignedTo,
            departamento: worker?.roleName || 'N/A',
            tipoEmpleado: worker?.schemeName || 'N/A',
            esquema: worker?.levelName || 'N/A',
            tiempo: String(hour.hoursData.total),
            modulo: 'N/A',
            nivel: worker?.levelName || 'N/A',
            ubicacion: worker?.location || 'N/A',
            proyecto: hour.projectName,
          };
        });

        setTableDataFromApi(tableData);
        console.log('✅ Datos transformados para tabla:', tableData);
      } catch (error) {
        console.error('❌ Error cargando datos del proyecto:', error);
        setTableDataFromApi([]);
      }
    };

    loadProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, projects]);

  // Crear lista de nombres de proyectos únicos para el autocomplete
  const projectNames = useMemo(() => {
    if (!projects || !Array.isArray(projects)) {
      return [];
    }
    return Array.from(new Set(projects.map(project => project.name || project.name).filter(Boolean)));
  }, [projects]);

  // -------------------  Toolbar: OI/Proyecto y botones -----------------
  // const uniqueIOs = OI_OPTIONS;
  // const selectedProyecto = selectedIO ? PROYECTO_BY_OI[selectedIO] ?? "" : "";

  // ------------------- TABLE -----------------
  // Usar datos del API cuando hay proyecto seleccionado
  const filteredData = useMemo(() => {
    // Usar datos del API si están disponibles, sino tabla vacía
    return tableDataFromApi.length > 0 ? tableDataFromApi : [];
  }, [tableDataFromApi]);
  // importacion de tablas de la cabecera
  const columns = useMemo<MRT_ColumnDef<RowData>[]>(
    () => [
      { accessorKey: "consultor", header: "Consultor" },
      { accessorKey: "departamento", header: "Departamento" },
      { accessorKey: "tipoEmpleado", header: "Tipo Empleado" },
      { accessorKey: "esquema", header: "Esquema" },
      { accessorKey: "tiempo", header: "Horas/Sem" },
      { accessorKey: "modulo", header: "Módulo" },
      { accessorKey: "nivel", header: "Nivel" },
      { accessorKey: "ubicacion", header: "Ubicación" },
    ],
    []
  );

  const actions = { add: true, export: true, delete: true }
  
  // ------------------- FUNCIÓN DE ELIMINAR ------------------
  const handleDelete = async (ids: string[]) => {
    if (ids.length === 0) return;

    const confirmed = window.confirm(
      `¿Estás seguro de eliminar ${ids.length} registro(s)? Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      // Eliminar cada hora asignada
      const deletePromises = ids.map(id => deleteAssignedHour(parseInt(id)));
      const results = await Promise.all(deletePromises);

      // Verificar si todas las eliminaciones fueron exitosas
      const allSuccess = results.every(result => result === true);

      if (allSuccess) {
        alert('Registros eliminados exitosamente');
        
        // Recargar datos del proyecto actual
        if (selectedProject) {
          const projectObj = projects.find(p => p.name === selectedProject);
          if (projectObj) {
            const allHours = await getAssignedHours();
            const projectHours = allHours.filter(h => h.projectId === projectObj.id);
            const workers = await getWorkersForAssignedHours(projectHours);

            const tableData: RowData[] = projectHours.map(hour => {
              const worker = workers.find(w => w.id === hour.assignedTo);
              
              return {
                id: String(hour.id),
                consultor: hour.nameAssignedTo,
                departamento: worker?.roleName || 'N/A',
                tipoEmpleado: worker?.schemeName || 'N/A',
                esquema: worker?.levelName || 'N/A',
                tiempo: String(hour.hoursData.total),
                modulo: 'N/A',
                nivel: worker?.levelName || 'N/A',
                ubicacion: worker?.location || 'N/A',
                proyecto: hour.projectName,
              };
            });

            setTableDataFromApi(tableData);
          }
        }
        
        // Limpiar selección
        setRowSelection({});
      } else {
        alert('Algunos registros no pudieron ser eliminados. Por favor, revisa la consola.');
      }
    } catch (error) {
      console.error('Error eliminando registros:', error);
      alert('Error al eliminar los registros');
    }
  };
  
  // ------------------- LOGICA DE MODAL ------------------
  const handleSelectModalRow = (idx: number) => {
    setSelectedModalRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Función para agregar workers seleccionados
  const handleAgregarSeleccionados = async () => {
    // Obtener los workers seleccionados
    const selectedWorkers = Object.entries(selectedModalRows)
      .filter(([, isSelected]) => isSelected)
      .map(([idx]) => filteredModalRows[Number(idx)]);

    if (selectedWorkers.length === 0) {
      alert('Por favor selecciona al menos un consultor');
      return;
    }

    if (!selectedProject) {
      alert('Por favor selecciona un proyecto primero');
      return;
    }

    // Obtener el ID del proyecto seleccionado
    const project = projects.find(p => p.name === selectedProject);
    if (!project) {
      alert('Proyecto no encontrado');
      return;
    }

    try {
      // Crear el payload para el POST
      const payload = selectedWorkers.map(worker => ({
        project_id: project.id,
        assigned_to: worker.id,
        assigned_by: 6, // ID fijo según especificación
        hours_data: {
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
          total: 0,
          week: "" // Semana vacía por defecto
        }
      }));

      console.log('Creando asignaciones:', payload);
      const success = await createAssignedHours(payload);

      if (success) {
        alert(`✅ ${selectedWorkers.length} consultor(es) agregado(s) exitosamente`);
        
        // Recargar datos del proyecto
        const allHours = await getAssignedHours();
        const projectHours = allHours.filter(h => h.projectId === project.id);
        const workers = await getWorkersForAssignedHours(projectHours);
        
        const tableData: RowData[] = projectHours.map(hour => {
          const worker = workers.find(w => w.id === hour.assignedTo);
          return {
            id: String(hour.id),
            consultor: hour.nameAssignedTo,
            departamento: worker?.roleName || 'N/A',
            tipoEmpleado: worker?.schemeName || 'N/A',
            esquema: worker?.levelName || 'N/A',
            tiempo: String(hour.hoursData.total),
            modulo: 'N/A',
            nivel: worker?.levelName || 'N/A',
            ubicacion: worker?.location || 'N/A',
            proyecto: hour.projectName,
          };
        });
        setTableDataFromApi(tableData);
        
        // Limpiar selección del modal
        setSelectedModalRows({});
      } else {
        alert('Error al agregar consultores. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error agregando consultores:', error);
      alert('Error al agregar consultores');
    }
  };

  // ------------------- MODAL - FILTRADO DE TRABAJADORES -------------------
  // Filtrar trabajadores según los criterios del modal
  const filteredModalRows = useMemo(() => {
    return workers.filter((worker) => {
      // Filtro por nombre
      if (filterName && !worker.name.toLowerCase().includes(filterName.toLowerCase())) {
        return false;
      }
      
      // Filtro por especialidad (roleName)
      if (filterSpecialty && !worker.roleName?.toLowerCase().includes(filterSpecialty.toLowerCase())) {
        return false;
      }
      
      // Filtro por nivel
      if (filterLevel && !worker.levelName?.toLowerCase().includes(filterLevel.toLowerCase())) {
        return false;
      }
      
      // TODO: Filtro por fechas (modalDesde, modalHasta)
      // Por ahora, los trabajadores no tienen fecha de liberación en la API
      
      return true;
    });
  }, [workers, filterName, filterSpecialty, filterLevel]);

  // Mostrar loading inicial si los proyectos están cargando y no hay datos
  if (projectsLoading && projects.length === 0) {
    return (
      <ContentBody title="Proyección">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <Typography>Cargando proyectos...</Typography>
        </Box>
      </ContentBody>
    );
  }

  return (
    <ProtectedRoute requiredPermission="proyeccion">
      <ContentBody
        title="Proyección"
        ContentBtn={
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Autocomplete
              freeSolo
              options={projectNames}
              value={projectSearch}
              onInputChange={(_, newValue) => setProjectSearch(newValue || "")}
              onChange={(_, value) => setSelectedProject(value || null)}
              loading={projectsLoading}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Buscar proyecto" 
                  variant="outlined" 
                  size="small" 
                  sx={{ minWidth: 300 }}
                  helperText={projectsError ? `Error: ${projectsError}` : `${projectNames.length} proyectos disponibles`}
                  error={!!projectsError}
                />
              )}
            />
            <Typography sx={{ ml: 3, fontWeight: 600, color: '#222', fontSize: 20 }}>
              {projectSearch && projectNames.includes(projectSearch)
                ? `Proyecto: ${projectSearch}`
                : projectSearch && !projectsLoading 
                ? `Buscando: "${projectSearch}" (no encontrado)`
                : ""}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
                onClick={() => router.push("/dashboard/solicitud_horas")}
              >
                Solicitud de Horas (2)
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
                onClick={() => {
                  if (selectedProject) {
                    router.push(`/dashboard/proyeccion/date?project=${encodeURIComponent(selectedProject)}`);
                  } else {
                    alert('Por favor selecciona un proyecto primero');
                  }
                }}
                disabled={!selectedProject}
              >
                Ver proyección
              </Button>
            </Box>
          </Box>
        }
      >
        {/* Ya no se muestra el nombre de proyecto arriba, ahora va a la derecha del buscador */}
        <DataTable
          columns={columns}
          data={filteredData}
          menu={true}
          actions={actions}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onDelete={handleDelete}

          ModalAdd={
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, py: 2 }}>
              {/* Filtros de búsqueda */}
              {/* Búsqueda por nombre, especialidad y nivel */}
              {[
                { label: "Nombre", placeholder: "Buscar por nombre", value: filterName, onChange: setFilterName },
                { label: "Especialidad", placeholder: "Buscar por especialidad", value: filterSpecialty, onChange: setFilterSpecialty },
                { label: "Nivel", placeholder: "Buscar por nivel", value: filterLevel, onChange: setFilterLevel },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Box
                    sx={{
                      minWidth: 120,
                      bgcolor: "#f7f4fa",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textAlign: "right",
                    }}
                  >
                    <Typography sx={{ fontWeight: 500, color: "#444" }}>
                      {item.label}:
                    </Typography>
                  </Box>
                  <TextField
                    placeholder={item.placeholder}
                                        value={item.value}
                                        onChange={(e) => item.onChange(e.target.value)}
                    variant="outlined"
                    size="medium"
                    fullWidth
                    sx={{
                      bgcolor: "#ede9f6",
                      borderRadius: 2,
                      ".MuiOutlinedInput-root": {
                        borderRadius: 2,
                        height: 48,
                        fontSize: 16,
                        color: "#3c3842",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <Box sx={{ pr: 1 }}>
                          <IconButton edge="end" sx={{ color: "#3c3842" }}>
                            <SearchIcon />
                          </IconButton>
                        </Box>
                      ),
                    }}
                  />
                </Box>
              ))}

              {/* Filtros de fecha: Desde y Hasta */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Desde"
                  type="date"
                  value={modalDesde}
                  onChange={e => setModalDesde(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 180 }}
                />
                <TextField
                  label="Hasta"
                  type="date"
                  value={modalHasta}
                  onChange={e => setModalHasta(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 180 }}
                />
              </Box>

              {/* Resultados de ejemplo */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SearchIcon />}
                >
                  BUSCAR
                </Button>
              </Box>

              <Box sx={{ mt: 2 }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: "0 8px",
                    background: "#fff",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15, background: '#f7f4fa' }}>
                        Nombre
                      </th>
                      <th style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15, background: '#f7f4fa' }}>
                        Especialidad
                      </th>
                      <th style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15, background: '#f7f4fa' }}>
                        Nivel
                      </th>
                      <th style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15, background: '#f7f4fa' }}>
                        Departamento
                      </th>
                      <th style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15, background: '#f7f4fa' }}>
                        Fecha tentativa de liberación
                      </th>
                      <th
                        style={{
                          border: "1px solid #aaa",
                          padding: '10px 8px',
                          textAlign: "center",
                          fontSize: 15,
                          background: '#f7f4fa'
                        }}
                      >
                        Seleccionar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredModalRows.map((worker, idx) => (
                      <tr key={worker.id}>
                        <td style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15 }}>
                          {worker.name}
                        </td>
                        <td style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15 }}>
                          {worker.roleName || '—'}
                        </td>
                        <td style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15 }}>
                          {worker.levelName || '—'}
                        </td>
                        <td style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15 }}>
                          {worker.description || '—'}
                        </td>
                        <td style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15 }}>
                          {'—'}
                        </td>
                        <td
                          style={{
                            border: "1px solid #aaa",
                            padding: '10px 8px',
                            textAlign: "center",
                            fontSize: 15
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={!!selectedModalRows[idx]}
                            onChange={() => handleSelectModalRow(idx)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAgregarSeleccionados}
                  >
                    Agregar
                  </Button>
                </Box>
              </Box>
            </Box>
          }
          title_add="Agregar consultor"
        />
      </ContentBody>
    </ProtectedRoute>
  )
}