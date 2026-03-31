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
import { useUser } from "@clerk/nextjs";
import { buildApiUrl, API_CONFIG } from "@/config/api";
import { createAssignmentRequest } from "@/services/staffAssignmentService";
import { createHoursRequest } from "@/services/hoursRequestService";


// =================== TIPOS ===================
type RowData = {
  id: string;
  consultor: string;
  departamento: string;
  tipoEmpleado: string;
  esquema: string;
  tiempo: string;
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
  const { isLoaded, isSignedIn, user } = useUser();
  
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
  const [releaseDates, setReleaseDates] = useState<Record<number, string>>({});
  const [assignedWorkerIds, setAssignedWorkerIds] = useState<Set<number>>(new Set());

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

  // ------------------- CARGAR TRABAJADORES ASIGNADOS Y FECHAS DE LIBERACIÓN -----------------
  useEffect(() => {
    const loadWorkerAssignmentsAndDates = async () => {
      if (!selectedProject || projects.length === 0) {
        setAssignedWorkerIds(new Set());
        setReleaseDates({});
        return;
      }

      try {
        const projectObj = projects.find(p => p.project_name === selectedProject);
        if (!projectObj) {
          setAssignedWorkerIds(new Set());
          setReleaseDates({});
          return;
        }

        const allHours = await getAssignedHours();
        const projectHours = allHours.filter(h => h.projectId === projectObj.project_id);
        const assignedIds = new Set(projectHours.map(h => h.assignedTo));
        setAssignedWorkerIds(assignedIds);

        const dates: Record<number, string> = {};

        for (const worker of workers) {
          const workerId = worker.id;
          const workerHours = allHours.filter(h => h.assignedTo === workerId);
          
          if (workerHours.length === 0) {
            dates[workerId] = '—';
            continue;
          }

          let latestDate: Date | null = null;
          for (const rec of workerHours) {
            const hd = rec.hoursData ?? {};
            const weekStr = hd.week;
            if (!weekStr) continue;

            let weekDate: Date | null = null;
            if (/^\d{4}-\d{2}-\d{2}$/.test(weekStr)) {
              weekDate = new Date(weekStr);
            } else if (/^\d{4}-W\d{2}$/.test(weekStr)) {
              const m = weekStr.match(/^(\d{4})-W(\d{2})$/);
              if (m) {
                const year = parseInt(m[1], 10);
                const wk = parseInt(m[2], 10);
                const simple = new Date(Date.UTC(year, 0, 1 + (wk - 1) * 7));
                const dow = simple.getUTCDay() || 7;
                if (dow !== 1) {
                  simple.setUTCDate(simple.getUTCDate() - (dow - 1));
                }
                weekDate = new Date(
                  Date.UTC(
                    simple.getUTCFullYear(),
                    simple.getUTCMonth(),
                    simple.getUTCDate()
                  )
                );
              }
            }

            if (weekDate && !isNaN(weekDate.getTime())) {
              const hasHours = Object.entries(hd).some(
                ([k, v]: [string, any]) =>
                  !['week', 'total'].includes(k) &&
                  typeof v === 'number' &&
                  v > 0
              );
              if (hasHours) {
                const fridayDate = new Date(weekDate);
                fridayDate.setDate(fridayDate.getDate() + 4);
                if (!latestDate || fridayDate > latestDate) {
                  latestDate = fridayDate;
                }
              }
            }
          }

          if (latestDate) {
            const y = latestDate.getFullYear();
            const m = (latestDate.getMonth() + 1).toString().padStart(2, '0');
            const d = latestDate.getDate().toString().padStart(2, '0');
            dates[workerId] = `${d}/${m}/${y.toString().slice(-2)}`;
          } else {
            dates[workerId] = '—';
          }
        }

        setReleaseDates(dates);
      } catch (err) {
        console.error('Error cargando fechas de liberación:', err);
        setReleaseDates({});
      }
    };

    loadWorkerAssignmentsAndDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProject, projects.length, workers.length]);

  // Función auxiliar para calcular horas semanales basadas en el scheme (reutilizable)
  const calculateWeeklyHours = async (schemeId?: number | null): Promise<string> => {
    if (!schemeId) return 'N/A';
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORK_SCHEDULE) + `/${schemeId}`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const schedule = await res.json();
      
      if (!schedule.hours || !schedule.working_days) {
        return 'N/A';
      }

      // Parsear horas: ej "08:00-18:00" en formato 24h
      const hoursMatch = String(schedule.hours).trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
      if (!hoursMatch) return 'N/A';
      
      const startHour = parseInt(hoursMatch[1], 10);
      const startMin = parseInt(hoursMatch[2], 10);
      const endHour = parseInt(hoursMatch[3], 10);
      const endMin = parseInt(hoursMatch[4], 10);

      const startTotal = startHour * 60 + startMin;
      const endTotal = endHour * 60 + endMin;
      // Diferencia cronométrica en minutos en círculo de 24h
      let diff = Math.abs(endTotal - startTotal);
      // Usar el arco mínimo (maneja cruces de medianoche y evita negativos)
      diff = Math.min(diff, 24 * 60 - diff);
      const dailyHours = diff / 60;

      // Contar días de trabajo (split por comas y trim)
      const workingDays = schedule.working_days
        .split(',')
        .map((d: string) => d.trim())
        .filter((d: string) => d.length > 0);
      const daysCount = workingDays.length;

      // Calcular: horas_diarias * cantidad_de_días
      const weeklyHours = dailyHours * daysCount;
      // Formatear a máximo 2 decimales para evitar flotantes largos
      const formatted = Number.isInteger(weeklyHours) ? String(weeklyHours) : weeklyHours.toFixed(2);
      return formatted;
    } catch (err) {
      console.error(`Error calculando horas para scheme ${schemeId}:`, err);
      return 'N/A';
    }
  };

  // ------------------- CARGAR HORAS ASIGNADAS POR PROYECTO SELECCIONADO -----------------
  useEffect(() => {
    const loadProjectData = async () => {
      if (!selectedProject) {
        setTableDataFromApi([]);
        return;
      }

      try {
        // Encontrar el proyecto seleccionado para obtener su ID
        const projectObj = projects.find(p => p.project_name === selectedProject);
        if (!projectObj) {
          console.error('Proyecto no encontrado');
          return;
        }

        // Obtener todas las horas asignadas
        const allHours = await getAssignedHours();
        
        // Filtrar por proyecto ID
        const projectHours = allHours.filter(h => h.projectId === projectObj.project_id);
        console.log(`📊 Horas asignadas para proyecto ${projectObj.project_name}:`, projectHours);

        // Obtener información completa de los trabajadores desde el hook useWorkers
        // que tiene todos los datos enriquecidos (con nombres de roles, esquemas, niveles)
        console.log('👥 Workers disponibles:', workers);
        
        // Obtener workers únicos asignados al proyecto
        const uniqueWorkerIds = new Set(projectHours.map(h => h.assignedTo));
        console.log('👥 Workers únicos en el proyecto:', Array.from(uniqueWorkerIds));
        
        // Transformar datos para la tabla haciendo match con workers completos
        // Una fila por worker único
        const tableData: RowData[] = await Promise.all(
          Array.from(uniqueWorkerIds).map(async (workerId) => {
          // Buscar el worker completo por ID
          const worker = workers.find(w => w.id === workerId);
          
          // Obtener el primer registro de horas para este worker (para obtener nombres)
          const firstHour = projectHours.find(h => h.assignedTo === workerId);
          
            // Calcular horas semanales según el scheme del worker
            const weeklyHours = await calculateWeeklyHours(worker?.scheme_id);
          
          console.log(`Mapping worker ${workerId}:`, {
            found: !!worker,
              schemeId: worker?.scheme_id,
              weeklyHours,
            workerData: worker ? {
              name: worker.name,
              role: worker.roleName,
              scheme: worker.schemeName,
              level: worker.levelName,
              location: worker.location
            } : 'Not found'
          });
          
          return {
            id: String(workerId),
            consultor: worker?.name || firstHour?.nameAssignedTo || 'Unknown',
            departamento: worker?.departmentName || 'N/A',
            tipoEmpleado: worker?.roleName || 'N/A',
            esquema: worker?.schemeName || 'N/A',
              tiempo: weeklyHours,
            nivel: worker?.levelName || 'N/A',
            ubicacion: worker?.location || 'N/A',
            proyecto: firstHour?.projectName || '',
          };
          })
        );

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
    return Array.from(new Set(projects.map(project => project.project_name || project.project_name).filter(Boolean)));
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
      `¿Estás seguro de eliminar ${ids.length} consultor(es)? Se eliminarán TODAS sus horas asignadas en TODOS los proyectos. Esta acción no se puede deshacer.`
    );

    if (!confirmed) return;

    try {
      if (!selectedProject) return;
      
      const projectObj = projects.find(p => p.project_name === selectedProject);
      if (!projectObj) return;
      
      // Los IDs ahora son workerIds
      const workerIds = ids.map(id => parseInt(id));
      
      // Obtener TODOS los registros de assigned-hours (no solo del proyecto actual)
      const allHours = await getAssignedHours();
      
      // Encontrar TODOS los registros de horas de los workers seleccionados (en cualquier proyecto)
      const hoursToDelete = allHours.filter(h => workerIds.includes(h.assignedTo));
      
      console.log(`🗑️ Eliminando ${hoursToDelete.length} registros de horas asignadas de ${workerIds.length} worker(s) en TODOS los proyectos`);
      
      // Eliminar cada hora asignada
      const deletePromises = hoursToDelete.map(hour => deleteAssignedHour(hour.id));
      const results = await Promise.all(deletePromises);

      // Verificar si todas las eliminaciones fueron exitosas
      const allSuccess = results.every(result => result === true);

      if (allSuccess) {
        alert(`✅ ${hoursToDelete.length} registros eliminados exitosamente de ${workerIds.length} worker(s)`);
        
        // Recargar datos del proyecto actual
        const updatedHours = await getAssignedHours();
        const updatedProjectHours = updatedHours.filter(h => h.projectId === projectObj.project_id);
        
        // Obtener workers únicos
        const uniqueWorkerIds = new Set(updatedProjectHours.map(h => h.assignedTo));
        
        const tableData: RowData[] = await Promise.all(
          Array.from(uniqueWorkerIds).map(async (workerId) => {
          const worker = workers.find(w => w.id === workerId);
          const firstHour = updatedProjectHours.find(h => h.assignedTo === workerId);
            const weeklyHours = await calculateWeeklyHours(worker?.scheme_id);
          
          return {
            id: String(workerId),
            consultor: worker?.name || firstHour?.nameAssignedTo || 'Unknown',
            departamento: worker?.departmentName || 'N/A',
            tipoEmpleado: worker?.roleName || 'N/A',
            esquema: worker?.schemeName || 'N/A',
              tiempo: weeklyHours,
            nivel: worker?.levelName || 'N/A',
            ubicacion: worker?.location || 'N/A',
            proyecto: firstHour?.projectName || '',
          };
          })
        );

        setTableDataFromApi(tableData);
        
        // Limpiar selección
        setRowSelection({});
      } else {
        alert('⚠️ Algunos registros no pudieron ser eliminados. Por favor, revisa la consola.');
      }
    } catch (error) {
      console.error('❌ Error eliminando registros:', error);
      alert('Error al eliminar los registros');
    }
  };
  
  // ------------------- LOGICA DE MODAL ------------------
  const handleSelectModalRow = (idx: number) => {
    setSelectedModalRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Función para generar XLSX con información del worker
  const generateWorkerXLSX = (selectedWorkers: typeof filteredModalRows) => {
    try {
      const XLSX = require('xlsx');
      const data = selectedWorkers.map(w => ({
        'Nombre': w.name || 'N/A',
        'Email': w.email || 'N/A',
        'Departamento': w.departmentName || 'N/A',
        'Rol': w.roleName || 'N/A',
        'Nivel': w.levelName || 'N/A',
        'Ubicación': w.location || 'N/A',
        'Fecha de Contratación': w.hire_date || 'N/A',
        'Código de Empleado': w.employee_code || 'N/A',
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Trabajadores');
      
      // Generar el archivo XLSX como buffer
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      return new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    } catch (error) {
      console.error('Error generando XLSX:', error);
      return null;
    }
  };

  // Función para encontrar el líder del departamento del worker (async)
  const findDepartmentHead = async (workerDepartmentId: number | null | undefined): Promise<{ id: number; email?: string; name?: string } | null> => {
    if (!workerDepartmentId) {
      console.log('❌ No department ID provided');
      return null;
    }
    
    console.log(`🔎 Buscando líder para departamento ID: ${workerDepartmentId}`);
    
    try {
      // Consultar department-heads desde el backend
      const response = await fetch(buildApiUrl('/department-heads'));
      if (!response.ok) {
        console.error(`❌ Error obteniendo department-heads: ${response.status}`);
        return null;
      }
      
      const departmentHeads = await response.json();
      console.log('📋 Department heads obtenidos:', departmentHeads);
      
      // Buscar el department head activo para este departamento
      const activeDeptHead = departmentHeads.find((dh: any) => 
        dh.id_department === workerDepartmentId && dh.active === true
      );
      
      if (!activeDeptHead) {
        console.log(`❌ No se encontró líder activo para departamento ${workerDepartmentId}`);
        return null;
      }
      
      console.log(`✅ Líder encontrado en department-heads:`, activeDeptHead);
      
      // Buscar el worker correspondiente al id_worker del líder
      const headWorker = workers.find(w => w.id === activeDeptHead.id_worker);
      
      if (!headWorker || !headWorker.email) {
        console.log(`❌ No se encontró worker o email para id_worker: ${activeDeptHead.id_worker}`);
        return null;
      }
      
      console.log(`✅ Líder del departamento: ${headWorker.name} (${headWorker.email})`);
      return {
        id: headWorker.id,
        email: headWorker.email,
        name: headWorker.name
      };
    } catch (error) {
      console.error('❌ Error buscando líder del departamento:', error);
      return null;
    }
  };

  // Función para agregar workers seleccionados con lógica de departamentos
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
    const project = projects.find(p => p.project_name === selectedProject);
    if (!project) {
      alert('Proyecto no encontrado');
      return;
    }

    try {
      // Resolver assigned_by desde la sesión de Clerk (email -> worker.id)
      const currentEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
      if (!isLoaded || !isSignedIn || !currentEmail) {
        alert('No se pudo obtener la sesión de usuario (Clerk). Inicia sesión e intenta de nuevo.');
        return;
      }

      const creator = workers.find(w => (w.email ?? '').toLowerCase() === currentEmail.toLowerCase());
      if (!creator) {
        alert('No se encontró un trabajador con tu email en el sistema. Verifica que tu usuario tenga un worker con ese email.');
        return;
      }

      // ==================== VERIFICACIÓN DE AUTORIZACIÓN ====================
      // Solo el responsable/líder del proyecto puede agregar workers
      if (creator.id !== project.employee_id) {
        alert(`⛔ No tienes permiso para agregar personal a este proyecto. Solo el responsable (${project.employee_id}) puede hacerlo.`);
        return;
      }

      const assignedById = creator.id;
      const creatorDepartmentId = creator.department_id;
      
      // ==================== SEPARAR WORKERS POR DEPARTAMENTO ====================
      const sameDeptWorkers = selectedWorkers.filter(w => w.department_id === creatorDepartmentId);
      const diffDeptWorkers = selectedWorkers.filter(w => w.department_id !== creatorDepartmentId);

      // Crear el payload SOLO para workers del mismo departamento
      const sameDeptPayload = sameDeptWorkers.map(worker => ({
        project_id: project.project_id,
        assigned_to: worker.id,
        assigned_by: assignedById,
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

      // Asignar directamente los workers del mismo departamento
      let sameDeptSuccess = true;
      if (sameDeptPayload.length > 0) {
        console.log('✅ Creando asignaciones del mismo departamento:', sameDeptPayload);
        sameDeptSuccess = await createAssignedHours(sameDeptPayload);
      }

      if (!sameDeptSuccess) {
        alert('❌ Error creando asignaciones del mismo departamento');
        return;
      }

      // ==================== CREAR SOLICITUDES PENDIENTES PARA OTROS DEPARTAMENTOS ====================
      const assignmentRequests: Promise<any>[] = [];

      for (const worker of diffDeptWorkers) {
        const departmentHead = await findDepartmentHead(worker.department_id);
        console.log(`🔍 Worker ${worker.name}, Líder encontrado:`, departmentHead);
        
        if (departmentHead && departmentHead.email) {
          // Crear AMBAS solicitudes: de asignación de consultor y de horas
          const assignmentRequestPromise = (async () => {
            try {
              // 1. Crear solicitud de asignación del consultor
              const requestResult = await createAssignmentRequest({
                project_id: String(project.project_id),
                project_name: project.project_name,
                project_code: String(project.project_code || ''),
                worker_id: String(worker.id),
                worker_name: worker.name,
                worker_email: worker.email || '',
                worker_department_id: String(worker.department_id),
                worker_department_name: worker.departmentName || '',
                department_head_id: String(departmentHead.id),
                department_head_name: departmentHead.name || 'Líder',
                department_head_email: departmentHead.email || '',
                requested_by_id: String(creator.id),
                requested_by_name: creator.name || 'Manager',
                requested_by_email: creator.email || '',
                assignment_data: {
                  assigned_by: String(assignedById),
                  hours_data: {
                    monday: 0,
                    tuesday: 0,
                    wednesday: 0,
                    thursday: 0,
                    friday: 0,
                    saturday: 0,
                    sunday: 0,
                    total: 0,
                    week: ""
                  }
                }
              });

              console.log(`✅ Solicitud de asignación creada para ${worker.name}:`, requestResult);

              // 2. Crear solicitud de horas
              const hoursRequestResult = await createHoursRequest({
                project_id: String(project.project_id),
                project_name: project.project_name,
                project_code: String(project.project_code || ''),
                worker_id: String(worker.id),
                worker_name: worker.name,
                worker_email: worker.email || '',
                worker_department_id: String(worker.department_id),
                worker_department_name: worker.departmentName || '',
                department_head_id: String(departmentHead.id),
                department_head_name: departmentHead.name || 'Líder',
                department_head_email: departmentHead.email || '',
                requested_by_id: String(creator.id),
                requested_by_name: creator.name || 'Manager',
                requested_by_email: creator.email || '',
                requested_hours: 0,
                reason: `Asignación al proyecto ${project.project_name}`,
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date().toISOString().split('T')[0],
                assignment_data: {
                  assigned_by: String(assignedById),
                  hours_data: {
                    monday: 0,
                    tuesday: 0,
                    wednesday: 0,
                    thursday: 0,
                    friday: 0,
                    saturday: 0,
                    sunday: 0,
                    total: 0,
                    week: ""
                  }
                }
              });

              console.log(`✅ Solicitud de horas creada para ${worker.name}:`, hoursRequestResult);

              // Enviar email de notificación al líder del departamento
              const xlsxBlob = generateWorkerXLSX([worker]);
              if (xlsxBlob) {
                const xlsxFile = new File(
                  [xlsxBlob],
                  `worker_${worker.id}_${Date.now()}.xlsx`,
                  { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
                );

                const formData = new FormData();
                formData.append('name', departmentHead.name || 'Líder de Departamento');
                formData.append('email', departmentHead.email!);
                formData.append('projectName', project.project_name);
                formData.append('file', xlsxFile);

                const smtpUrl = '/api/smtp/send';
                console.log(`📧 Enviando email de solicitud a ${departmentHead.email}, projectName: ${project.project_name}`);

                const emailResponse = await fetch(smtpUrl, {
                  method: 'POST',
                  body: formData,
                });

                const responseText = await emailResponse.text();
                console.log(`📬 Respuesta del servidor (${emailResponse.status}):`, responseText);

                if (emailResponse.ok) {
                  console.log(`✅ Email enviado exitosamente a ${departmentHead.email} (${worker.name})`);
                } else {
                  console.warn(`⚠️ Email retornó estado ${emailResponse.status} para ${departmentHead.email}`);
                }
              }
            } catch (err) {
              console.error(`❌ Error creando solicitudes para ${worker.name}:`, err);
              throw err;
            }
          })();

          assignmentRequests.push(assignmentRequestPromise);
        }
      }

      // Esperar a que todas las solicitudes se creen
      try {
        if (assignmentRequests.length > 0) {
          console.log(`📊 Esperando ${assignmentRequests.length} solicitudes de asignación...`);
          await Promise.all(assignmentRequests);
          console.log(`✅ Todas las solicitudes han sido creadas`);
        }

        // Mensaje de confirmación
        let message = `✅ ${selectedWorkers.length} consultor(es) procesado(s)`;
        if (sameDeptWorkers.length > 0 && diffDeptWorkers.length > 0) {
          message += `\n✅ ${sameDeptWorkers.length} asignado(s) directamente (mismo departamento)`;
          message += `\n⏳ ${diffDeptWorkers.length} en estado PENDIENTE (esperando aprobación del líder)`;
        } else if (sameDeptWorkers.length > 0) {
          message += `\n✅ ${sameDeptWorkers.length} asignado(s) directamente`;
        } else if (diffDeptWorkers.length > 0) {
          message += `\n⏳ ${diffDeptWorkers.length} en estado PENDIENTE`;
        }
        alert(message);
        
        // Recargar datos del proyecto
        const allHours = await getAssignedHours();
        const projectHours = allHours.filter(h => h.projectId === project.project_id);
        
        // Obtener workers únicos
        const uniqueWorkerIds = new Set(projectHours.map(h => h.assignedTo));
        
        const tableData: RowData[] = await Promise.all(
          Array.from(uniqueWorkerIds).map(async (workerId) => {
          const worker = workers.find(w => w.id === workerId);
          const firstHour = projectHours.find(h => h.assignedTo === workerId);
            const weeklyHours = await calculateWeeklyHours(worker?.scheme_id);
          
          return {
            id: String(workerId),
            consultor: worker?.name || firstHour?.nameAssignedTo || 'Unknown',
            departamento: worker?.departmentName || 'N/A',
            tipoEmpleado: worker?.roleName || 'N/A',
            esquema: worker?.schemeName || 'N/A',
              tiempo: weeklyHours,
            nivel: worker?.levelName || 'N/A',
            ubicacion: worker?.location || 'N/A',
            proyecto: firstHour?.projectName || '',
          };
          })
        );
        setTableDataFromApi(tableData);
        
        // Limpiar selección del modal
        setSelectedModalRows({});
      } catch (err) {
        console.error('❌ Error en el proceso de asignación:', err);
        alert('❌ Error procesando las solicitudes. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error agregando consultores:', error);
      alert('Error al agregar consultores');
    }
  };

  // ------------------- MODAL - FILTRADO DE TRABAJADORES -------------------
  // Filtrar trabajadores según los criterios del modal y excluir los asignados
  const filteredModalRows = useMemo(() => {
    return workers.filter((worker) => {
      // Excluir trabajadores ya asignados al proyecto
      if (assignedWorkerIds.has(worker.id)) {
        return false;
      }

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
      
      return true;
    });
  }, [workers, filterName, filterSpecialty, filterLevel, assignedWorkerIds]);

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
                        Fecha liberación
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
                          {worker.departmentName || '—'}
                        </td>
                        <td style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15 }}>
                          {releaseDates[worker.id] || '—'}
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