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
  workerId?: number; // id del worker asociado (opcional)
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
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [dateError, setDateError] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Utilidades para mapear semanas → fechas por día
  const formatYMD = (date: Date) => {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getISOWeekStart = (year: number, week: number) => {
    const simple = new Date(Date.UTC(year, 0, 1 + (week - 1) * 7));
    const dow = simple.getUTCDay() || 7; // 1..7 (Mon..Sun)
    if (dow !== 1) {
      simple.setUTCDate(simple.getUTCDate() - (dow - 1));
    }
    return simple; // Monday of the ISO week in UTC
  };

  const parseWeekStartDate = (weekStr?: string): Date | null => {
    if (!weekStr) return null;
    // Try YYYY-MM-DD (construct as local date to avoid timezone shifts)
    if (/^\d{4}-\d{2}-\d{2}$/.test(weekStr)) {
      const [y, m, d] = weekStr.split('-').map(s => parseInt(s, 10));
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        const dt = new Date(y, m - 1, d);
        return isNaN(dt.getTime()) ? null : dt;
      }
      return null;
    }
    // Try ISO week: YYYY-Www
    const m = weekStr.match(/^(\d{4})-W(\d{2})$/);
    if (m) {
      const year = parseInt(m[1], 10);
      const wk = parseInt(m[2], 10);
      const mondayUTC = getISOWeekStart(year, wk);
      // Convert to local date at same Y-M-D by reading UTC components and building local date
      const local = new Date(mondayUTC.getUTCFullYear(), mondayUTC.getUTCMonth(), mondayUTC.getUTCDate());
      return local;
    }
    return null;
  };
  
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
        // Guardar id del proyecto para uso en el modal/post
        setCurrentProjectId(project.project_id);

        console.log('📊 Info general del proyecto:', project);

        console.log('📊 Cargando datos para proyecto:', project.project_name, 'ID:', project.project_id);
        console.log('📅 Fecha de inicio del proyecto:', project.start_date);
        console.log('📅 Fecha de fin del proyecto:', project.end_date);
        
        // Calcular fechas basadas en la fecha de inicio y fin del proyecto
        let calculatedDatesLocal: Array<{ inicial: string; fecha: string; fullDate: string }> = [];
        if (project.start_date) {
          // Si tenemos end_date, calcular número de semanas completas entre las fechas
          let numWeeks = vistaSemanas; // fallback
          if (project.end_date) {
            try {
              const startD = new Date(project.start_date);
              const endD = new Date(project.end_date);
              const diffMs = endD.getTime() - startD.getTime();
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1; // inclusive
              numWeeks = Math.max(1, Math.ceil(diffDays / 7));
              console.log(`🔢 Calculado semanas entre ${project.start_date} y ${project.end_date}:`, numWeeks);
            } catch (err) {
              console.warn('No se pudo calcular semanas desde fechas del proyecto, usando vistaSemanas por defecto', err);
            }
          }

          calculatedDatesLocal = calculateDatesFromStart(
            project.start_date,
            project.end_date,
            numWeeks
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

    // Ajustar la cantidad de semanas (filas/columnas) que mostrará la tabla según las fechas calculadas
        try {
          const weeksCount = weeksData.length || 1;
          setVistaSemanas(weeksCount);
          console.log('🔧 Ajustando vistaSemanas a:', weeksCount);
        } catch (err) {
          console.warn('No se pudo ajustar vistaSemanas automáticamente', err);
        }
        
        // Obtener el department head para el proyecto
        // (Se mantiene la llamada original por compatibilidad, aunque no la usamos para poblar la fila principal)
        const assignedBy = await getDepartmentHead(project.project_id);

        // --- NUEVA LÓGICA: Poblar la tabla usando assigned-hours para el proyecto ---
        try {
          console.log('🔎 Obteniendo assigned-hours para proyecto:', project.project_id);
          const assignedRes = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ASSIGNED_HOURS) + `/${project.project_id}`);
          if (!assignedRes.ok) throw new Error(`Error fetching assigned-hours: ${assignedRes.status}`);
          const assignedList = await assignedRes.json();

          if (!Array.isArray(assignedList) || assignedList.length === 0) {
            console.warn('⚠️ No hay registros en assigned-hours para el proyecto:', project.project_id);
            setTableData([]);
            // no return; permitimos que la tabla quede vacía
          }

          // Agrupar por assignedTo (worker id) y mantener el nombre del assignedTo del payload
          const byWorker = new Map<number, any[]>();
          for (const rec of (assignedList || [])) {
            const id = Number(rec.assignedTo);
            if (!byWorker.has(id)) byWorker.set(id, []);
            byWorker.get(id)!.push(rec);
          }

          // Obtener lista completa de workers (para datos adicionales como name, department_id, scheme_id)
          const workersRes = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS));
          if (!workersRes.ok) throw new Error(`Error fetching workers: ${workersRes.status}`);
          const workersList = await workersRes.json();

          // Obtener lista de departamentos una sola vez
          const deptsRes = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENTS));
          const deptsList = deptsRes.ok ? await deptsRes.json() : [];

          const rows: ProyeccionRow[] = [];

          // Para cada worker único crear una fila
          for (const workerId of Array.from(byWorker.keys())) {
            // Intentar obtener el worker desde la lista de workers
            const worker = Array.isArray(workersList) ? workersList.find((w: any) => Number(w.id) === Number(workerId)) : null;

            // Si no existe el worker en /worker, intentamos usar el nombre que viene en assigned-hours
            const nameFromAssigned = byWorker.get(workerId)?.[0]?.nameAssignedTo || '';
            const consultorName = worker?.name || nameFromAssigned || `ID ${workerId}`;

            // Resolver departamento
            const deptId = worker?.department_id;
            const departmentObj = Array.isArray(deptsList) ? deptsList.find((d: any) => Number(d.id) === Number(deptId)) : null;
            const departmentName = departmentObj?.name || 'N/A';

            // Resolver esquema/horas (usar listado schemes cargado primero)
            let schedule: any = null;
            const schemeId = worker?.scheme_id;
            if (schemeId) {
              schedule = schemes.find(s => Number(s.id) === Number(schemeId));
              if (!schedule) {
                // Si no está en el listado, intentar obtener detalle por id
                try {
                  const schedRes = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORK_SCHEDULE) + `/${schemeId}`);
                  if (schedRes.ok) schedule = await schedRes.json();
                } catch (err) {
                  console.warn('No se pudo obtener workSchedule detalle para', schemeId, err);
                }
              }
            }

            const horasContrato = schedule?.hours || 'N/A';
            const tiempoName = schedule?.name || 'N/A';

            // Construir arreglo de horas y poblar desde assigned-hours
            const horasArray = Array(calculatedDatesLocal.length).fill('');

            const workerRecs = byWorker.get(workerId) || [];
            const dayKeysWeekday = ['monday','tuesday','wednesday','thursday','friday'];

            for (const rec of workerRecs) {
              const hd = rec.hoursData ?? rec.hours_data ?? {};
              // Preferir startDate (formato YYYY-MM-DD) que viene en el payload, si no usar hoursData.week
              const weekRaw = (rec.startDate ?? rec.start_date) || hd.week || hd.weekStart || null;
              const weekStart = parseWeekStartDate(weekRaw);
              if (!weekStart) continue;

              // Sólo mapear lunes..viernes
              for (let offset = 0; offset < 5; offset++) {
                const dayKey = dayKeysWeekday[offset];
                const valRaw = hd?.[dayKey];

                // Considerar ausencia de dato cuando es null/undefined/''
                if (valRaw === null || valRaw === undefined || String(valRaw).trim() === '') {
                  // no escribir aquí; dejaremos '-' por defecto después
                  continue;
                }

                const valNum = typeof valRaw === 'number' ? valRaw : parseFloat(String(valRaw));
                if (isNaN(valNum)) continue;

                const d = new Date(weekStart);
                d.setDate(d.getDate() + offset);
                const ymd = formatYMD(d);
                const idx = calculatedDatesLocal.findIndex(fd => fd.fullDate === ymd);
                if (idx >= 0) {
                  horasArray[idx] = String(valNum);
                }
              }
            }

            // Rellenar con '-' las celdas de días laborables que quedaron sin dato
            for (let i = 0; i < horasArray.length; i++) {
              if (horasArray[i] === '') {
                horasArray[i] = '-';
              }
            }

            rows.push({
              consultor: consultorName,
              departamento: departmentName,
              tipoEmpleado: worker?.description || '',
              esquema: schedule?.name || (schemeId ? String(schemeId) : 'N/A'),
              horasContrato: horasContrato,
              tiempo: tiempoName,
              nivel: worker?.level_id ? String(worker.level_id) : 'N/A',
              horas: horasArray,
              workerId: Number(workerId),
              fechaLibre: 'N/A',
            });
          }

          console.log('✅ Filas construidas desde assigned-hours:', rows);
          setTableData(rows);
        } catch (err) {
          console.error('❌ Error poblando tabla desde assigned-hours:', err);
          setTableData([]);
        }
        
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
      // yyyy-mm-dd -> construir como fecha local para evitar desplazamientos de zona
      const parts = f.split('-');
      if (parts.length >= 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        const d = parseInt(parts[2], 10);
        if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
          return new Date(y, m - 1, d);
        }
        return null;
      }
      return null;
    }
    const [d, m, y] = f.split("/");
    const fullYear = y.length === 2 ? `20${y}` : y;
    // Construir como fecha local
    const yi = parseInt(fullYear, 10);
    const mi = parseInt(m, 10);
    const di = parseInt(d, 10);
    if (isNaN(yi) || isNaN(mi) || isNaN(di)) return null;
    return new Date(yi, mi - 1, di);
  };

  // Normaliza la fecha a entero AAAAMMDD para evitar problemas de zona horaria
  const toIntDate = (date: Date | null) => {
    if (!date || isNaN(date.getTime())) return NaN;
    return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  };

  // Validadores para inputs de fecha: Desde debe ser Lunes (1), Hasta debe ser Viernes (5)
  const handleDesdeChange = (val: string) => {
    setDateError('');
    const d = parseFecha(val);
    if (!d) { setDateError('Fecha inválida'); return; }
    if (d.getDay() !== 1) { setDateError('La fecha Desde debe ser Lunes'); return; }
    setRangoHoras(r => ({ ...r, desde: val }));
  };

  const handleHastaChange = (val: string) => {
    setDateError('');
    const d = parseFecha(val);
    if (!d) { setDateError('Fecha inválida'); return; }
    if (d.getDay() !== 5) { setDateError('La fecha Hasta debe ser Viernes'); return; }
    setRangoHoras(r => ({ ...r, hasta: val }));
  };

  // Helper para postear assigned-hours por cada semana entre dos fechas (desde lunes hasta viernes)
  const postAssignedHoursForWeeks = async (assignedTo: number, desdeStr: string, hastaStr: string, cantidad: number) => {
    if (!currentProjectId) throw new Error('No project id available');
    const desde = parseFecha(desdeStr);
    const hasta = parseFecha(hastaStr);
    if (!desde || !hasta) throw new Error('Fechas inválidas');
    // asegurar que desde es lunes y hasta es viernes
    if (desde.getDay() !== 1) throw new Error('Desde debe ser lunes');
    if (hasta.getDay() !== 5) throw new Error('Hasta debe ser viernes');

    const weeks: Array<{ start: Date; end: Date }> = [];
    let cur = new Date(desde);
    while (cur <= hasta) {
      const start = new Date(cur);
      const end = new Date(cur);
      end.setDate(start.getDate() + 4); // viernes
      // push copy
      weeks.push({ start: new Date(start), end: new Date(end) });
      // next week
      cur.setDate(cur.getDate() + 7);
    }

    setIsPosting(true);
    try {
      for (const w of weeks) {
        console.log(w)
        const bodyObj: any = {
          project_id: currentProjectId,
          assigned_to: assignedTo,
          assigned_by: 18,
          hours_data: {
            monday: cantidad,
            tuesday: cantidad,
            wednesday: cantidad,
            thursday: cantidad,
            friday: cantidad,
            saturday: 0,
            sunday: 0,
          },
          start_date: formatYMD(w.start),
          end_date: formatYMD(w.end),
        };

        console.log('📤 POST assigned-hours payload:', bodyObj);

        try {
          const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ASSIGNED_HOURS), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([bodyObj]),
          });
          if (!res.ok) {
            const text = await res.text();
            console.error('❌ Error posting assigned-hours:', res.status, text);
          } else {
            console.log('✅ assigned-hours created for week', bodyObj.start_date);
          }
        } catch (postErr) {
          console.error('❌ Exception posting assigned-hours:', postErr);
        }
      }
    } finally {
      setIsPosting(false);
    }
  };

  // Función para guardar el rango de horas
  const handleGuardarHoras = async () => {
    // Helper to clear modal state
    const clearAndClose = () => {
      setOpenModal(false);
      setRangoHoras({ desde: '', hasta: '', cantidad: '' });
      setDiaSeleccionado(null);
      setRegistroSeleccionado(null);
    };

    // If a specific row was selected in the modal, update only that row
    if (registroSeleccionado) {
      const cantidadStr = (rangoHoras.cantidad ?? '').trim();
      if (!cantidadStr) {
        clearAndClose();
        return;
      }

      // Compute updated rows based on workerId (avoid object reference checks)
      setTableData((prev) => {
        const desdeDate = parseFecha(rangoHoras.desde);
        const hastaDate = parseFecha(rangoHoras.hasta);
        const desdeInt = toIntDate(desdeDate);
        const hastaInt = toIntDate(hastaDate);

        return prev.map((row) => {
          if (Number(row.workerId) === Number(registroSeleccionado.workerId)) {
            const nuevasHoras = [...row.horas];
            for (let i = 0; i < diasInfo.length; i++) {
              const colDate = parseFecha(diasInfo[i].fullDate || diasInfo[i].fecha);
              const colInt = toIntDate(colDate);
              if (!isNaN(desdeInt) && !isNaN(hastaInt) && !isNaN(colInt)) {
                if (colInt >= desdeInt && colInt <= hastaInt) {
                  nuevasHoras[i] = `${cantidadStr}*`;
                }
              }
            }
            return { ...row, horas: nuevasHoras };
          }
          return row;
        });
      });

      // Do the POST once for the selected worker (outside of map)
      try {
        const assignedTo = registroSeleccionado.workerId;
        if (assignedTo && rangoHoras.desde && rangoHoras.hasta) {
          const cantidad = parseInt(rangoHoras.cantidad || '0', 10);
          if (!isNaN(cantidad)) {
            await postAssignedHoursForWeeks(assignedTo, rangoHoras.desde, rangoHoras.hasta, cantidad);
          }
        }
      } catch (err) {
        console.error('❌ Error creando assigned-hours desde modal:', err);
      } finally {
        clearAndClose();
      }

      return;
    }

    // If applying to a single day (diaSeleccionado) -- update all rows' cell and post per row once
    if (diaSeleccionado !== null) {
      const cantidadStr = (rangoHoras.cantidad ?? '').trim();
      if (!cantidadStr) {
        clearAndClose();
        return;
      }
      const cantidad = parseInt(cantidadStr || '0', 10);
      if (isNaN(cantidad)) {
        clearAndClose();
        return;
      }

      // Build updated rows locally so we can both set state and iterate to post
      const updatedRows = tableData.map((row) => {
        const nuevasHoras = [...row.horas];
        nuevasHoras[diaSeleccionado] = `${cantidadStr}*`;
        return { ...row, horas: nuevasHoras };
      });

      setTableData(updatedRows);

      // Compute week bounds once based on clicked column date
      const clickedDate = parseFecha(diasInfo[diaSeleccionado].fullDate || diasInfo[diaSeleccionado].fecha);
      if (clickedDate) {
        const day = clickedDate.getDay();
        const monday = new Date(clickedDate);
        monday.setDate(clickedDate.getDate() - (day === 0 ? 6 : day - 1));
        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4);

        // Post once per row (do in parallel)
        try {
          await Promise.all(
            updatedRows.map((row) => {
              const assignedTo = row.workerId;
              if (assignedTo) {
                return postAssignedHoursForWeeks(assignedTo, formatYMD(monday), formatYMD(friday), cantidad).catch((err) => {
                  console.error('❌ Error creando assigned-hours para día seleccionado (workerId=' + assignedTo + '):', err);
                });
              }
              return Promise.resolve();
            })
          );
        } catch (err) {
          console.error('❌ Error en posts paralelos:', err);
        }
      }

      clearAndClose();
    }
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
                onClick={() => {
                  // seleccionar registro actual antes de abrir modal
                  try {
                    const rowData = (cell?.row as any)?.original as ProyeccionRow | undefined;
                    if (rowData) setRegistroSeleccionado(rowData);
                  } catch (e) {
                    /* ignore */
                  }
                  handleAbrirModal(idx);
                }}
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
                  onChange={e => handleDesdeChange(e.target.value)}
                  style={{
                    width: 140,
                    padding: 8,
                    border: '1px solid rgba(0, 0, 0, 0.35)',
                    borderRadius: 5
                  }}
                />
                <Typography>Hasta:</Typography>
                <input
                  type="date"
                  value={vistaRango.hasta}
                  onChange={e => handleHastaChange(e.target.value)}
                  style={{
                    width: 140,
                    padding: 8,
                    border: '1px solid rgba(0, 0, 0, 0.35)',
                    borderRadius: 5
                  }}
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
            {diaSeleccionado !== null ? (
              <Box sx={{ display: 'flex', gap: 12, alignItems: 'center', m: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography variant="body2">Día seleccionado:</Typography>
                  <Box sx={{
                    px: 2, py: 1, borderRadius: 1,
                    bgcolor: '#f3f4f6', border: '1px solid rgba(0,0,0,0.15)'
                  }}>
                    {diasInfo[diaSeleccionado]?.fecha || diasInfo[diaSeleccionado]?.fullDate}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Typography variant="body2">Cantidad de horas:</Typography>
                  <input
                    type="number"
                    min={0}
                    max={24}
                    value={rangoHoras.cantidad}
                    onChange={e => setRangoHoras(r => ({ ...r, cantidad: e.target.value }))}
                    style={{
                      width: 100,
                      padding: 8,
                      border: '1px solid rgba(0, 0, 0, 0.35)',
                      borderRadius: 5
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', m: 2 }}>
                <Typography variant="body2">Desde:</Typography>
                <input
                  type="date"
                  value={rangoHoras.desde}
                  onChange={e => handleDesdeChange(e.target.value)}
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
                  onChange={e => handleHastaChange(e.target.value)}
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
            )}
            {dateError && <Typography color="error" sx={{ mt: 1 }}>{dateError}</Typography>}
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
