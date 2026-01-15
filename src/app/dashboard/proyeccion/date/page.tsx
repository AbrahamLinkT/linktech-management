"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from "material-react-table";
import { Box, Typography, Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter, useSearchParams } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useProjects } from "@/hooks/useProjects";
import { useAssignedHours } from "@/hooks/useAssignedHours";
import { buildApiUrl, API_CONFIG } from '@/config/api';

// ---- Tipos ----
type ProyeccionRow = {
  consultor: string;
  departamento: string;
  tipoEmpleado: string;
  esquema: string;
  horasContrato: string; // Nuevo campo para horas contractuales
  tiempo: string;
  nivel: string;
  horas: string[]; // índice 0..14 (3 semanas * 5 días)
  fechaLibre: string;
};

interface SchemeItem {
  id: number;
  name: string;
  description?: string;
  hours?: string;
}

// ---- Datos de cabeceras por semana ----
const semanas = [
  { nombre: "Semana 1", dias: ["Lunes 1", "Martes 2", "Miércoles 3", "Jueves 4", "Viernes 5"] },
  { nombre: "Semana 2", dias: ["Lunes 8", "Martes 9", "Miércoles 10", "Jueves 11", "Viernes 12"] },
  { nombre: "Semana 3", dias: ["Lunes 15", "Martes 16", "Miércoles 17", "Jueves 18", "Viernes 19"] },
];

// Encabezado minimalista: SOLO título arriba (sin opciones abajo)
function TitleOnlyHeader({ title }: { title: string }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", p: 0.5 }}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, textAlign: "center", lineHeight: 1.1 }}
        title={title}
      >
        {title}
      </Typography>
    </Box>
  );
}

function ProyeccionTablePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectName = searchParams.get('project');
  
  const [vistaError, setVistaError] = useState('');
  // Estado para modal de cambiar vista
  const [openVistaModal, setOpenVistaModal] = useState(false);
  const [vistaTipo, setVistaTipo] = useState<'fechas' | 'semanas'>('semanas');
  const [vistaRango, setVistaRango] = useState({ desde: '', hasta: '' });
  const [vistaSemanas, setVistaSemanas] = useState(3); // cantidad de semanas a mostrar
  
  // Hooks para API
  const { projects, getProjects } = useProjects();
  const { getAssignedHours, getWorkersForAssignedHours, createAssignedHours } = useAssignedHours();
  const [isLoading, setIsLoading] = useState(true);
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);

  // Cargar esquemas (schemes) al inicio
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        console.log('📋 Cargando esquemas desde:', buildApiUrl(API_CONFIG.ENDPOINTS.WORK_SCHEDULE));
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORK_SCHEDULE));
        if (!res.ok) throw new Error(`Error fetching schemes: ${res.status}`);
        const json = await res.json();
        const schemesData = Array.isArray(json) ? json : json.content || [];
        console.log('✅ Esquemas cargados:', schemesData);
        setSchemes(schemesData);
      } catch (err) {
        console.error('❌ Error fetching schemes', err);
      }
    };
    fetchSchemes();
  }, []);

  // Cargar proyectos al inicio
  useEffect(() => {
    if (projects.length === 0) {
      console.log('🔄 Cargando proyectos iniciales...');
      getProjects();
    }
    // Solo ejecutar cuando cambie getProjects, no cuando cambie projects.length
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para cambiar la cantidad de semanas
  const handleGuardarVista = () => {
    setVistaError('');
    if (vistaTipo === 'semanas') {
      const num = parseInt(vistaRango.desde);
      if (!isNaN(num) && num > 0 && num <= 10) {
        setVistaSemanas(num);
        setOpenVistaModal(false);
      }
    } else {
      // Calcular semanas completas entre las fechas
      if (vistaRango.desde && vistaRango.hasta) {
        const desde = new Date(vistaRango.desde);
        const hasta = new Date(vistaRango.hasta);
        if (!isNaN(desde.getTime()) && !isNaN(hasta.getTime()) && hasta > desde) {
          const diffMs = hasta.getTime() - desde.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const semanas = Math.max(1, Math.floor(diffDays / 7));
          if (diffDays < 7) {
            setVistaError('El rango de fechas debe ser al menos de una semana.');
            return;
          }
          setVistaSemanas(semanas);
          setOpenVistaModal(false);
        } else {
          setVistaError('Fechas inválidas.');
        }
      } else {
        setVistaError('Debes seleccionar ambas fechas.');
      }
    }
  };
  // ---- Datos de ejemplo ----
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  // Estado para modal de cambiar horas
  const [openModal, setOpenModal] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);
  const [rangoHoras, setRangoHoras] = useState({ desde: '', hasta: '', cantidad: '' });
  const [registroSeleccionado, setRegistroSeleccionado] = useState<ProyeccionRow | null>(null);

  const [tableData, setTableData] = useState<ProyeccionRow[]>([]);
  const [calculatedDates, setCalculatedDates] = useState<Array<{ inicial: string; fecha: string; fullDate: string }>>([]);
  
  // Función para obtener el department head del proyecto
  const getDepartmentHead = async (projectId: number): Promise<number | null> => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENT_HEADS));
      const departmentHeads = await response.json();
      console.log('Department heads:', departmentHeads);
      
      // Por ahora retornamos el ID fijo 6, pero podrías hacer match con el proyecto
      // const head = departmentHeads.find(h => h.id_department === project.departmentId);
      return 6; // ID fijo según especificación
    } catch (error) {
      console.error('Error fetching department heads:', error);
      return 6; // Fallback
    }
  };
  
  // Función para agrupar fechas por semanas
  const groupDatesByWeeks = (dates: Array<{ inicial: string; fecha: string; fullDate: string }>) => {
    const weeks: Array<{ weekStart: string; days: typeof dates }> = [];
    let currentWeek: typeof dates = [];
    
    dates.forEach((date, index) => {
      currentWeek.push(date);
      
      // Si es viernes o el último día, cerrar la semana
      if (date.inicial === 'Vie' || index === dates.length - 1) {
        // La semana se identifica por la fecha del primer día (lunes o inicio)
        const weekStart = currentWeek[0].fullDate;
        weeks.push({ weekStart, days: [...currentWeek] });
        currentWeek = [];
      }
    });
    
    return weeks;
  };
  
  // Función para calcular fechas basadas en la fecha de inicio y fin del proyecto
  const calculateDatesFromStart = (startDate: string, endDate: string | null = null, numWeeks: number = 3) => {
    const dates: Array<{ inicial: string; fecha: string; fullDate: string }> = [];
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    // Mapeo de días de la semana
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    
    let currentDate = new Date(start);
    const startDayOfWeek = currentDate.getDay();
    
    // Si el proyecto empieza en fin de semana, avanzar al lunes siguiente
    if (startDayOfWeek === 0) { // Domingo
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (startDayOfWeek === 6) { // Sábado
      currentDate.setDate(currentDate.getDate() + 2);
    }
    
    // Agregar días desde el inicio hasta completar las semanas o llegar a la fecha de fin
    let weeksCompleted = 0;
    
    while (weeksCompleted < numWeeks) {
      const dayOfWeek = currentDate.getDay();
      
      // Verificar si hemos pasado la fecha de fin
      if (end && currentDate > end) {
        console.log(`🛑 Alcanzada fecha de fin del proyecto: ${end.toISOString().split('T')[0]}`);
        break;
      }
      
      // Solo agregar días laborables (1=Lun a 5=Vie)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const shortYear = year.toString().slice(-2);
        
        dates.push({
          inicial: dayNames[dayOfWeek],
          fecha: `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${shortYear}`,
          fullDate: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
        });
      }
      
      // Si llegamos al viernes, incrementar semanas completadas
      if (dayOfWeek === 5) {
        weeksCompleted++;
        // Saltar el fin de semana (avanzar al lunes siguiente)
        currentDate.setDate(currentDate.getDate() + 3);
      } else {
        // Avanzar al siguiente día
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    console.log(`📅 Fechas generadas: ${dates.length} días (${weeksCompleted} semanas completas)`);
    return dates;
  };
  
  // Cargar datos del proyecto desde el API
  useEffect(() => {
    const loadProjectData = async () => {
      console.log('=== INICIO DE CARGA ===');
      console.log('Project name from URL:', projectName);
      console.log('Projects available:', projects.length);
      console.log('Schemes available:', schemes.length);
      
      if (!projectName) {
        console.log('❌ No hay nombre de proyecto en la URL');
        setIsLoading(false);
        return;
      }

      if (projects.length === 0) {
        console.log('⏳ Esperando a que se carguen los proyectos...');
        return; // El otro useEffect se encargará de cargarlos
      }

      if (schemes.length === 0) {
        console.log('⏳ Esperando a que se carguen los esquemas...');
        return; // Esperar a que se carguen los schemes
      }
      
      try {
        setIsLoading(true);
        
        console.log('Total de proyectos:', projects.length);
        console.log('Proyectos:', projects.map(p => ({ id: p.project_id, name: p.project_name })));
        console.log('Total de esquemas:', schemes.length);
        console.log('Esquemas:', schemes.map(s => ({ id: s.id, name: s.name, hours: s.hours })));
        
        // Encontrar el proyecto por nombre
        const project = projects.find(p => p.project_name === projectName);
        if (!project) {
          console.error('❌ Proyecto no encontrado:', projectName);
          console.log('Nombres de proyectos disponibles:', projects.map(p => p.project_name));
          setIsLoading(false);
          return;
        }
        
        console.log('📊 Cargando datos para proyecto:', project.project_name, 'ID:', project.project_id);
        console.log('📅 Fecha de inicio del proyecto:', project.start_date);
        console.log('📅 Fecha de fin del proyecto:', project.end_date);
        
        // Calcular fechas basadas en la fecha de inicio y fin del proyecto
        let calculatedDatesLocal: Array<{ inicial: string; fecha: string; fullDate: string }> = [];
        if (project.start_date) {
          calculatedDatesLocal = calculateDatesFromStart(
            project.start_date, 
            project.end_date, 
            vistaSemanas
          );
          setCalculatedDates(calculatedDatesLocal);
          console.log('📅 Fechas calculadas:', calculatedDatesLocal);
        } else {
          console.warn('⚠️ El proyecto no tiene fecha de inicio');
          setIsLoading(false);
          return;
        }
        
        // Agrupar fechas por semanas
        const weeksData = groupDatesByWeeks(calculatedDatesLocal);
        console.log('📅 Semanas agrupadas:', weeksData);
        
        // Obtener el department head para el proyecto
        const assignedBy = await getDepartmentHead(project.project_id);
        
        // Obtener horas asignadas del proyecto
        console.log('🔍 Obteniendo todas las horas asignadas...');
        const allHours = await getAssignedHours();
        console.log('📊 Total de horas asignadas:', allHours.length);
        
        const projectHours = allHours.filter(h => h.projectId === project.project_id);
        console.log(`🔍 Horas asignadas filtradas para proyecto ${project.project_id}:`, projectHours.length);
        
        // Obtener workers únicos asignados al proyecto
        const uniqueWorkerIds = new Set(projectHours.map(h => h.assignedTo));
        console.log('👥 Workers únicos en el proyecto:', Array.from(uniqueWorkerIds));
        
        if (uniqueWorkerIds.size === 0) {
          console.warn('⚠️ No hay workers asignados para este proyecto');
          setTableData([]);
          setIsLoading(false);
          return;
        }
        
        // Obtener información de los workers
        console.log('👥 Obteniendo información de workers...');
        const workers = await getWorkersForAssignedHours(projectHours);
        console.log('👥 Workers cargados:', workers.length);
        
        // Para cada worker, verificar que tenga horas asignadas para cada semana
        const hoursToCreate: any[] = [];
        
        for (const workerId of Array.from(uniqueWorkerIds)) {
          for (const week of weeksData) {
            // Buscar si ya existe un registro para este worker en esta semana
            const existingHour = projectHours.find(
              h => h.assignedTo === workerId && h.hoursData.week === week.weekStart
            );
            
            if (!existingHour) {
              console.log(`📝 Creando registro para worker ${workerId} en semana ${week.weekStart}`);
              hoursToCreate.push({
                project_id: project.project_id,
                assigned_to: workerId,
                assigned_by: assignedBy,
                hours_data: {
                  monday: 0,
                  tuesday: 0,
                  wednesday: 0,
                  thursday: 0,
                  friday: 0,
                  saturday: 0,
                  sunday: 0,
                  total: 0,
                  week: week.weekStart
                }
              });
            }
          }
        }
        
        // Crear los registros faltantes
        let finalProjectHours = projectHours;
        if (hoursToCreate.length > 0) {
          console.log(`📝 Creando ${hoursToCreate.length} registros de horas...`);
          await createAssignedHours(hoursToCreate);
          
          // Recargar las horas asignadas
          const updatedHours = await getAssignedHours();
          finalProjectHours = updatedHours.filter(h => h.projectId === project.project_id);
          console.log('✅ Horas actualizadas:', finalProjectHours.length);
        }
        
        // Agrupar horas por worker
        const hoursByWorker = new Map<number, any[]>();
        for (const hour of finalProjectHours) {
          if (!hoursByWorker.has(hour.assignedTo)) {
            hoursByWorker.set(hour.assignedTo, []);
          }
          hoursByWorker.get(hour.assignedTo)!.push(hour);
        }
        
        console.log('📊 Horas agrupadas por worker:', Array.from(hoursByWorker.entries()).map(([id, hours]) => ({
          workerId: id,
          hoursCount: hours.length
        })));
        
        // Transformar datos para la tabla
        const tableData: ProyeccionRow[] = [];
        
        for (const [workerId, workerHours] of hoursByWorker.entries()) {
          const worker = workers.find(w => w.id === workerId);
          if (!worker) {
            console.warn(`⚠️ Worker ${workerId} no encontrado`);
            continue;
          }
          
          console.log(`🔧 Procesando worker ${workerId}: ${worker.name}`);
          
          // Intentar obtener el scheme_id del worker
          const workerSchemeId = worker?.schemeId || (worker as any)?.scheme_id;
          const scheme = schemes.find(s => s.id === workerSchemeId);
          const horasContrato = scheme?.hours || 'N/A';
          
          // Ordenar las horas por semana
          const sortedHours = workerHours.sort((a, b) => 
            a.hoursData.week.localeCompare(b.hoursData.week)
          );
          
          // Construir array de horas basado en las fechas calculadas
          const horasArray: string[] = [];
          const dayMapping = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
          
          for (const date of calculatedDatesLocal) {
            // Encontrar la semana que corresponde a esta fecha
            const weekRecord = sortedHours.find(h => {
              const weekStart = new Date(h.hoursData.week);
              const currentDate = new Date(date.fullDate);
              // La fecha debe estar en la misma semana
              const diffDays = Math.floor((currentDate.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24));
              return diffDays >= 0 && diffDays < 7;
            });
            
            if (weekRecord) {
              // Obtener el día de la semana (0=Dom, 1=Lun, ..., 5=Vie)
              const dateObj = new Date(date.fullDate);
              const dayOfWeek = dateObj.getDay();
              
              // Mapear al campo correcto (1=Lun -> monday, 2=Mar -> tuesday, etc.)
              if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                const dayField = dayMapping[dayOfWeek - 1] as keyof typeof weekRecord.hoursData;
                const value = weekRecord.hoursData[dayField];
                horasArray.push(value !== null ? String(value) : '0');
              } else {
                horasArray.push('0');
              }
            } else {
              horasArray.push('0');
            }
          }
          
          // Calcular el total de horas por semana
          const totalHours = sortedHours.reduce((sum, h) => sum + (h.hoursData.total || 0), 0);
          
          tableData.push({
            consultor: worker.name,
            departamento: worker.roleName || 'N/A',
            tipoEmpleado: worker.schemeName || 'N/A',
            esquema: worker.levelName || 'N/A',
            horasContrato: horasContrato,
            tiempo: `${totalHours}/total`,
            nivel: worker.levelName || 'N/A',
            horas: horasArray,
            fechaLibre: 'N/A',
          });
        }
        
        console.log('✅ Datos transformados:', tableData);
        setTableData(tableData);
        console.log('✅ Datos cargados exitosamente:', tableData.length, 'registros');
      } catch (error) {
        console.error('❌ Error cargando datos del proyecto:', error);
      } finally {
        setIsLoading(false);
        console.log('=== FIN DE CARGA ===');
      }
    };
    
    loadProjectData();
    // Solo recargar cuando cambie el nombre del proyecto o los proyectos disponibles
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName, projects.length, schemes.length]);

  // Función para abrir el modal y seleccionar el día
  const handleAbrirModal = (diaIdx: number) => {
    setDiaSeleccionado(diaIdx);
    setOpenModal(true);
  };

  // Función para abrir el modal desde el botón (con selección de registro)
  const handleAbrirModalDesdeBoton = () => {
    // Buscar el primer registro seleccionado
    const selectedIndex = Object.keys(rowSelection)[0];
    if (selectedIndex !== undefined) {
      setRegistroSeleccionado(tableData[parseInt(selectedIndex)]);
      setOpenModal(true);
    }
  };

  // Función para guardar el rango de horas
  // Usar fechas calculadas o fallback a fechas por defecto
  const diasInfo = calculatedDates.length > 0 ? calculatedDates : [
    { inicial: "Lun", fecha: "01/08/25", fullDate: "2025-08-01" },
    { inicial: "Mar", fecha: "02/08/25", fullDate: "2025-08-02" },
    { inicial: "Mie", fecha: "03/08/25", fullDate: "2025-08-03" },
    { inicial: "Jue", fecha: "04/08/25", fullDate: "2025-08-04" },
    { inicial: "Vie", fecha: "05/08/25", fullDate: "2025-08-05" },
    { inicial: "Lun", fecha: "08/08/25", fullDate: "2025-08-08" },
    { inicial: "Mar", fecha: "09/08/25", fullDate: "2025-08-09" },
    { inicial: "Mie", fecha: "10/08/25", fullDate: "2025-08-10" },
    { inicial: "Jue", fecha: "11/08/25", fullDate: "2025-08-11" },
    { inicial: "Vie", fecha: "12/08/25", fullDate: "2025-08-12" },
    { inicial: "Lun", fecha: "15/08/25", fullDate: "2025-08-15" },
    { inicial: "Mar", fecha: "16/08/25", fullDate: "2025-08-16" },
    { inicial: "Mie", fecha: "17/08/25", fullDate: "2025-08-17" },
    { inicial: "Jue", fecha: "18/08/25", fullDate: "2025-08-18" },
    { inicial: "Vie", fecha: "19/08/25", fullDate: "2025-08-19" },
  ];

  const parseFecha = (f: string) => {
    // Espera formato dd/mm/yy o yyyy-mm-dd
    if (!f) return null;
    if (f.includes("-")) {
      // yyyy-mm-dd
      return new Date(f);
    }
    const [d, m, y] = f.split("/");
    const fullYear = y.length === 2 ? `20${y}` : y;
    return new Date(`${fullYear}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
  };

  const handleGuardarHoras = () => {
    if (registroSeleccionado) {
      setTableData((prev) =>
        prev.map((row) => {
          if (row === registroSeleccionado) {
            const nuevasHoras = [...row.horas];
            // Mapear fechas de columnas a índices
            const desdeDate = parseFecha(rangoHoras.desde);
            const hastaDate = parseFecha(rangoHoras.hasta);
            for (let i = 0; i < diasInfo.length; i++) {
              const colDate = parseFecha(diasInfo[i].fullDate || diasInfo[i].fecha);
              if (
                desdeDate && hastaDate &&
                colDate &&
                colDate >= desdeDate &&
                colDate <= hastaDate
              ) {
                nuevasHoras[i] = `${rangoHoras.cantidad}*`;
              }
            }
            return { ...row, horas: nuevasHoras };
          }
          return row;
        })
      );
      setRegistroSeleccionado(null);
    } else if (diaSeleccionado !== null) {
      setTableData((prev) =>
        prev.map((row) => {
          const nuevasHoras = [...row.horas];
          nuevasHoras[diaSeleccionado] = `${rangoHoras.cantidad}*`;
          return { ...row, horas: nuevasHoras };
        })
      );
    }
    setOpenModal(false);
    setRangoHoras({ desde: '', hasta: '', cantidad: '' });
    setDiaSeleccionado(null);
  };

  // ---- Columnas (con grupos por semana) ----
  const columns = useMemo<MRT_ColumnDef<ProyeccionRow>[]>(() => {
    const baseCols: MRT_ColumnDef<ProyeccionRow>[] = [
      {
        accessorKey: "consultor",
        header: "Consultor",
        size: 120,
        Header: () => <TitleOnlyHeader title="Consultor" />,
      },
      {
        accessorKey: "departamento",
        header: "Departamento",
        size: 120,
        Header: () => <TitleOnlyHeader title="Departamento" />,
      },
      {
        accessorKey: "tipoEmpleado",
        header: "Tipo de empleado",
        size: 140,
        Header: () => <TitleOnlyHeader title="Tipo de empleado" />,
      },
      {
        accessorKey: "esquema",
        header: "Esquema",
        size: 120,
        Header: () => <TitleOnlyHeader title="Esquema" />,
      },
      {
        accessorKey: "horasContrato",
        header: "Horas Contrato",
        size: 120,
        Header: () => <TitleOnlyHeader title="Horas Contrato" />,
      },
      {
        accessorKey: "tiempo",
        header: "Tiempo",
        size: 120,
        Header: () => <TitleOnlyHeader title="Tiempo" />,
      },
      {
        accessorKey: "nivel",
        header: "Nivel",
        size: 120,
        Header: () => <TitleOnlyHeader title="Nivel" />,
      },
    ];

    // Construir grupos de semanas dinámicamente basados en diasInfo
    const semanaGroups: MRT_ColumnDef<ProyeccionRow>[] = [];
    let weekIndex = 0;
    let dayIndex = 0;
    
    while (dayIndex < diasInfo.length) {
      const weekDays: MRT_ColumnDef<ProyeccionRow>[] = [];
      const weekStart = dayIndex;
      
      // Agregar días hasta completar la semana o hasta que no haya más días
      while (dayIndex < diasInfo.length && weekDays.length < 5) {
        const info = diasInfo[dayIndex];
        const currentIdx = dayIndex;
        
        // Si encontramos un Lunes y ya tenemos días, terminar la semana anterior
        if (info.inicial === 'Lun' && weekDays.length > 0) {
          break;
        }
        
        weekDays.push({
          id: `horas_${currentIdx}`,
          header: info.inicial,
          size: 80,
          accessorFn: (row) => row.horas?.[currentIdx] ?? "",
          muiTableHeadCellProps: {
            sx: {
              bgcolor: "#b6c6f7",
              color: "#222",
              fontWeight: 600,
              textAlign: "center",
            },
          },
          Header: () => (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1 }}>{info.inicial}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 400, lineHeight: 1 }}>{info.fecha}</Typography>
            </Box>
          ),
          enableColumnActions: false,
          enableColumnOrdering: false,
          Cell: ({ cell, column }) => {
            const value = cell.getValue<string>();
            const idx = parseInt(column.id?.replace('horas_', '') ?? '0');
            return (
              <Box
                sx={{
                  bgcolor: value ? "#e3e8fd" : "#fff",
                  color: "#222",
                  fontWeight: 500,
                  textAlign: "center",
                  borderRadius: 2,
                  py: 2,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 40,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  '&:hover': { bgcolor: '#d1e0fa' },
                }}
                onClick={() => handleAbrirModal(idx)}
                title="Cambiar horas"
              >
                {value}
              </Box>
            );
          },
        } as MRT_ColumnDef<ProyeccionRow>);
        
        dayIndex++;
        
        // Si llegamos al viernes, terminar la semana
        if (info.inicial === 'Vie') {
          break;
        }
      }
      
      if (weekDays.length > 0) {
        semanaGroups.push({
          header: `Semana ${weekIndex + 1}`,
          columns: weekDays,
        });
        weekIndex++;
      }
    }

    const tailCol: MRT_ColumnDef<ProyeccionRow> = {
      accessorKey: "fechaLibre",
      header: "Próxima fecha libre",
      size: 160,
      muiTableHeadCellProps: {
        sx: {
          bgcolor: "#4afc7c",
          color: "#222",
          fontWeight: 700,
          textAlign: "center",
        },
      },
      Header: () => <TitleOnlyHeader title="Próxima fecha libre" />,
      Cell: ({ cell }) => (
        <Box
          sx={{
            bgcolor: "#4afc7c",
            color: "#222",
            fontWeight: 700,
            textAlign: "center",
            borderRadius: 1,
            py: 0.5,
          }}
        >
          {cell.getValue<string>()}
        </Box>
      ),
    };

    return [...baseCols, ...semanaGroups, tailCol];
  }, [calculatedDates, vistaSemanas]);

  return (
    <Box sx={{ p: 4, bgcolor: "#f7f8fa", minHeight: "100vh" }}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5">
            Proyección
          </Typography>
          {projectName && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Proyecto: <strong>{projectName}</strong>
            </Typography>
          )}
        </Box>
        <Button variant="outlined" color="primary" onClick={() => router.back()} startIcon={<ArrowBackIcon />}>
          Regresar
        </Button>
      </Box>

      <MaterialReactTable
        columns={columns.slice(0, 7).concat(columns.slice(7, 7 + vistaSemanas))}
        data={tableData}
        enableFilters={true}
        enableColumnActions={true}
        enableHiding={true}
        enableSorting={false}
        enableRowSelection
        enableColumnResizing
        enableColumnOrdering
        enablePagination
        enableDensityToggle
        enableFullScreenToggle
        muiTableContainerProps={{
          sx: { borderRadius: 3, boxShadow: "none", background: "#fff" },
        }}
        muiTableHeadCellProps={{
          sx: {
            textAlign: "center",
            fontWeight: 500,
            fontSize: 14,
            py: 0.5,
          },
        }}
        muiTableBodyCellProps={{ sx: { textAlign: "center", fontSize: 15 } }}
        onRowSelectionChange={setRowSelection}
        state={{ 
          rowSelection,
          isLoading: isLoading,
          showProgressBars: isLoading,
        }}
        initialState={{
          columnVisibility: {
            consultor: true,
            departamento: true,
            horasContrato: true,
            tiempo: true,
            tipoEmpleado: false,
            esquema: false,
            nivel: false,
            fechaLibre: false,
          },
          columnPinning: {
            left: ["consultor", "departamento", "horasContrato", "tiempo"],
          },
        }}
        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
              onClick={() => setOpenVistaModal(true)}
            >
              Cambiar vista
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
              onClick={handleAbrirModalDesdeBoton}
              disabled={Object.keys(rowSelection).length === 0}
            >
              Cambiar horas
            </Button>
          </Box>
        )}
      />

      {/* Modal para cambiar vista */}
      {openVistaModal && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.25)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 3,
              p: 4,
              minWidth: 320,
              boxShadow: 6,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Cambiar cantidad de semanas o rango de fechas
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant={vistaTipo === 'semanas' ? 'contained' : 'outlined'}
                onClick={() => setVistaTipo('semanas')}
              >Por semanas</Button>
              <Button
                variant={vistaTipo === 'fechas' ? 'contained' : 'outlined'}
                onClick={() => setVistaTipo('fechas')}
              >Por fechas</Button>
            </Box>
            {vistaTipo === 'semanas' ? (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography>Cantidad de semanas:</Typography>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={vistaRango.desde}
                  onChange={e => setVistaRango(r => ({ ...r, desde: e.target.value }))}
                  style={{ width: 80, padding: 4 }}
                />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography>Desde:</Typography>
                <input
                  type="date"
                  value={vistaRango.desde}
                  onChange={e => setVistaRango(r => ({ ...r, desde: e.target.value }))}
                  style={{ width: 140, padding: 4 }}
                />
                <Typography>Hasta:</Typography>
                <input
                  type="date"
                  value={vistaRango.hasta}
                  onChange={e => setVistaRango(r => ({ ...r, hasta: e.target.value }))}
                  style={{ width: 140, padding: 4 }}
                />
              </Box>
            )}
            {vistaError && (
              <Typography color="error" sx={{ mt: 1 }}>{vistaError}</Typography>
            )}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleGuardarVista}>
                Guardar
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => { setOpenVistaModal(false); setVistaError(''); }}>
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Modal para cambiar horas */}
      {openModal && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.25)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 3,
              p: 4,
              minWidth: 320,
              boxShadow: 6,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Cambiar horas
            </Typography>
            {registroSeleccionado && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2"><b>Consultor:</b> {registroSeleccionado.consultor}</Typography>
                <Typography variant="body2"><b>Departamento:</b> {registroSeleccionado.departamento}</Typography>
                <Typography variant="body2"><b>Tipo Empleado:</b> {registroSeleccionado.tipoEmpleado}</Typography>
                <Typography variant="body2"><b>Esquema:</b> {registroSeleccionado.esquema}</Typography>
                <Typography variant="body2"><b>Nivel:</b> {registroSeleccionado.nivel}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', m: 2 }}>
              <Typography variant="body2">Desde:</Typography>
              <input
                type="date"
                value={rangoHoras.desde}
                onChange={e => setRangoHoras(r => ({ ...r, desde: e.target.value }))}
                style={{
                  width: 140,
                  padding: 8,
                  border: '1px solid rgba(0, 0, 0, 0.35)',
                  borderRadius: 5
                }}
              />
              <Typography variant="body2">Hasta:</Typography>
              <input
                type="date"
                value={rangoHoras.hasta}
                onChange={e => setRangoHoras(r => ({ ...r, hasta: e.target.value }))}
                style={{
                  width: 140,
                  padding: 8,
                  border: '1px solid rgba(0, 0, 0, 0.35)',
                  borderRadius: 5
                }}
              />
              <Typography variant="body2">Cantidad de horas:</Typography>
              <input
                type="number"
                min={0}
                max={24}
                value={rangoHoras.cantidad}
                onChange={e => setRangoHoras(r => ({ ...r, cantidad: e.target.value }))}
                style={{
                  width: 80,
                  padding: 8,
                  border: '1px solid rgba(0, 0, 0, 0.35)',
                  borderRadius: 5
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleGuardarHoras}>
                Guardar
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => { setOpenModal(false); setRegistroSeleccionado(null); }}>
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ProyeccionTablePage;
