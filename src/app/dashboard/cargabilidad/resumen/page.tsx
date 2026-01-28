"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWorkers } from "@/hooks/useWorkers";
import { useAssignedHours } from "@/hooks/useAssignedHours";
import { buildApiUrl } from "@/config/api";
import * as XLSX from 'xlsx';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Box, Button, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

interface WorkerOccupancy {
  workerId: number;
  workerName: string;
  esquema: string;
  tiempo: string;
  weeklyData: number[]; // % de ocupación por día
}

export default function ResumenCargabilidad() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workersParam = searchParams.get('workers');
  
  const { data: allWorkers, loading: workersLoading, schemes } = useWorkers();
  const { getAssignedHours } = useAssignedHours();
  
  const [assignedHours, setAssignedHours] = useState<any[]>([]);
  const [workSchedules, setWorkSchedules] = useState<Map<number, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  
  // Estados para selector de fechas
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [numberOfWeeks, setNumberOfWeeks] = useState<number>(4);
  
  // IDs de workers seleccionados
  const selectedWorkerIds = useMemo(() => {
    if (!workersParam) return [];
    return workersParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
  }, [workersParam]);
  
  // Generar semanas basado en rango de fechas o número de semanas
  const generateWeeks = () => {
    const weeks = [];
    
    // Si hay rango de fechas seleccionado
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      // Ajustar al inicio de la semana (lunes)
      start.setDate(start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1));
      
      // Generar semanas entre el rango
      let currentWeekStart = new Date(start);
      let weekCounter = 1;
      
      while (currentWeekStart <= end) {
        const days = [];
        for (let i = 0; i < 5; i++) {
          const d = new Date(currentWeekStart);
          d.setDate(currentWeekStart.getDate() + i);
          days.push(d);
        }
        
        weeks.push({
          nombre: `SEMANA ${weekCounter}`,
          dias: days
        });
        
        weekCounter++;
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      }
    } else {
      // Usar número de semanas (empezando desde la semana actual)
      const today = new Date();
      
      // Ajustar al inicio de la semana actual (lunes)
      const currentWeekStart = new Date(today);
      currentWeekStart.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
      
      for (let weekOffset = 0; weekOffset < numberOfWeeks; weekOffset++) {
        const startOfWeek = new Date(currentWeekStart);
        startOfWeek.setDate(currentWeekStart.getDate() + weekOffset * 7);
        
        const days = [];
        for (let i = 0; i < 5; i++) {
          const d = new Date(startOfWeek);
          d.setDate(startOfWeek.getDate() + i);
          days.push(d);
        }
        
        weeks.push({
          nombre: `SEMANA ${weekOffset + 1}`,
          dias: days
        });
      }
    }
    
    return weeks;
  };
  
  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  };
  
  // Recalcular semanas cuando cambien las fechas o el número de semanas
  const semanasAgrupadas = useMemo(() => generateWeeks(), [startDate, endDate, numberOfWeeks]);
  const allDays = useMemo(() => semanasAgrupadas.flatMap(s => s.dias), [semanasAgrupadas]);
  
  // Cargar assigned hours
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const hours = await getAssignedHours();
        setAssignedHours(hours);
      } catch (error) {
        console.error('Error cargando assigned hours:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);
  
  // Cargar work schedules
  useEffect(() => {
    console.log('📦 Resumen - Cargando work schedules desde hook...', schemes?.length, 'schemes');
    
    if (!schemes || schemes.length === 0) {
      console.log('⚠️ Resumen - Sin schemes disponibles');
      setWorkSchedules(new Map());
      setLoadingSchedules(false);
      return;
    }
    
    console.log('🔍 Resumen - Schemes IDs:', schemes.map((s: any) => s.id));
    
    // Crear mapa de scheme_id -> schedule
    const scheduleMap = new Map<number, any>();
    schemes.forEach((scheme: any) => {
      const schemeId = Number(scheme.id);
      scheduleMap.set(schemeId, scheme);
      console.log(`✅ Resumen - Scheme ${schemeId}:`, scheme);
    });
    
    console.log('✅ Resumen - Work schedules desde hook. Mapa:', Array.from(scheduleMap.entries()));
    setWorkSchedules(scheduleMap);
    setLoadingSchedules(false);
  }, [schemes]);
  
  // Función para calcular horas diarias del esquema
  const calculateDailyHours = (schemeId?: number | null): string => {
    if (!schemeId) return 'N/A';
    
    const schedule = workSchedules.get(schemeId);
    if (!schedule) return 'N/A';
    
    const hours = schedule.hours;
    
    // Si hours es solo un número (ej: "8", "8.5", 8)
    const numHours = parseFloat(hours);
    if (!isNaN(numHours) && !String(hours).includes(':')) {
        return String(numHours);
    }
    
    // Si hours es en formato "HH:MM-HH:MM" (ej: "07:00-02:00", "08:00-18:00")
    if (typeof hours === 'string' && hours.includes(':') && hours.includes('-')) {
        const hoursMatch = String(hours).trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
        if (hoursMatch) {
            const startH = parseInt(hoursMatch[1], 10);
            const startM = parseInt(hoursMatch[2], 10);
            const endH = parseInt(hoursMatch[3], 10);
            const endM = parseInt(hoursMatch[4], 10);
            
            const startTotal = startH * 60 + startM;
            const endTotal = endH * 60 + endM;
            
            // Calcular diferencia en minutos
            let diff = endTotal - startTotal;
            
            // Si es negativo, significa que cruza medianoche (ej: 07:00 a 02:00 = 19 horas)
            if (diff < 0) {
                diff = (24 * 60) + diff; // Agregar 24 horas en minutos
            }
            
            // Convertir minutos a horas
            const totalHours = diff / 60;
            
            return Number.isInteger(totalHours) ? String(totalHours) : totalHours.toFixed(1);
        }
    }
    
    return 'N/A';
  };
  
  // Función antigua para referencia (no se usa aquí)
  const calculateWeeklyHours = (schemeId?: number | null): string => {
    if (!schemeId) return 'N/A';
    
    const schedule = workSchedules.get(schemeId);
    if (!schedule?.hours || !schedule?.working_days) return 'N/A';

    const hoursMatch = String(schedule.hours).trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
    if (!hoursMatch) return 'N/A';
    
    const startH = parseInt(hoursMatch[1], 10);
    const startM = parseInt(hoursMatch[2], 10);
    const endH = parseInt(hoursMatch[3], 10);
    const endM = parseInt(hoursMatch[4], 10);

    const startTotal = startH * 60 + startM;
    const endTotal = endH * 60 + endM;
    let diff = Math.abs(endTotal - startTotal);
    diff = Math.min(diff, 24 * 60 - diff);
    const dailyHours = diff / 60;

    const workingDays = schedule.working_days
        .split(',')
        .map((d: string) => d.trim())
        .filter((d: string) => d.length > 0);
    const daysCount = workingDays.length;

    const weeklyHours = dailyHours * daysCount;
    return Number.isInteger(weeklyHours) ? String(weeklyHours) : weeklyHours.toFixed(2);
  };
  
  // Calcular ocupación por worker y día
  const occupancyData: WorkerOccupancy[] = useMemo(() => {
    if (!allWorkers || selectedWorkerIds.length === 0 || assignedHours.length === 0) return [];
    
    const filteredWorkers = allWorkers.filter(w => selectedWorkerIds.includes(w.id));
    
    return filteredWorkers.map(worker => {
      const schedule = worker.scheme_id ? workSchedules.get(worker.scheme_id) : null;
      
      if (!schedule) {
        console.warn(`🚨 Schedule no encontrado para worker ${worker.name} (scheme_id: ${worker.scheme_id})`);
      }
      
      // Calcular horas diarias disponibles
      let dailyHours = 8;
      let workingDaysSet = new Set<string>();
      
      if (schedule?.hours) {
        const hours = schedule.hours;
        // Si hours es solo un número (ej: "8", "8.5", 8)
        const numHours = parseFloat(hours);
        if (!isNaN(numHours) && !String(hours).includes(':')) {
          dailyHours = numHours;
        } else {
          // Si hours es en formato "HH:MM-HH:MM"
          const hoursMatch = String(hours).trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
          if (hoursMatch) {
            const startH = parseInt(hoursMatch[1], 10);
            const startM = parseInt(hoursMatch[2], 10);
            const endH = parseInt(hoursMatch[3], 10);
            const endM = parseInt(hoursMatch[4], 10);
            const startTotal = startH * 60 + startM;
            const endTotal = endH * 60 + endM;
            
            // Calcular diferencia en minutos
            let diff = endTotal - startTotal;
            
            // Si es negativo, significa que cruza medianoche (ej: 07:00 a 02:00 = 19 horas)
            if (diff < 0) {
              diff = (24 * 60) + diff; // Agregar 24 horas en minutos
            }
            
            dailyHours = diff / 60;
          }
        }
      }
      
      if (schedule?.working_days) {
        const days = String(schedule.working_days)
          .split(',')
          .map((d: string) => d.trim().toUpperCase())
          .filter((d: string) => d.length > 0);
        workingDaysSet = new Set(days);
      }
      
      // Filtrar asignaciones del worker
      const workerAssignments = assignedHours.filter(ah => ah.assignedTo === worker.id);
      
      // Calcular % ocupación por cada día
      const weeklyData = allDays.map(date => {
        const dateYMD = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const dayIndex = date.getDay(); // 0=Sunday, 1=Monday, etc
        const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
        const dayName = dayNames[dayIndex];
        
        // Verificar si es día laboral
        const isWorkingDay = workingDaysSet.size === 0 || workingDaysSet.has(dayName);
        if (!isWorkingDay) return 0;
        
        const maxHoursPerDay = dailyHours;
        let totalHours = 0;
        
        for (const assignment of workerAssignments) {
          const inRange = (!assignment.startDate || dateYMD >= assignment.startDate) && 
                         (!assignment.endDate || dateYMD <= assignment.endDate);
          
          if (inRange && assignment.hoursData) {
            // Buscar la clave del día en el formato del backend (monday, tuesday, etc)
            const dayNamesLower = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            const dayNameLower = dayNamesLower[dayIndex];
            const hoursForDay = assignment.hoursData[dayNameLower] || 0;
            totalHours += hoursForDay;
          }
        }
        
        // Calcular porcentaje
        const percentage = maxHoursPerDay > 0 ? (totalHours / maxHoursPerDay) * 100 : 0;
        return Math.round(percentage);
      });
      
      return {
        workerId: worker.id,
        workerName: worker.name || 'N/A',
        esquema: worker.schemeName || 'N/A',
        tiempo: calculateDailyHours(worker.scheme_id),
        weeklyData
      };
    });
  }, [allWorkers, selectedWorkerIds, assignedHours, allDays, workSchedules, loadingSchedules]);
  
  // Función para exportar a Excel
  const handleExportExcel = () => {
    if (occupancyData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    
    // Preparar datos para Excel
    const excelData = occupancyData.map(worker => {
      const row: any = {
        'Consultor': worker.workerName,
        'Esquema': worker.esquema,
        'Tiempo': worker.tiempo
      };
      
      // Agregar cada día como columna
      allDays.forEach((dia, idx) => {
        const dateStr = dia.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' });
        row[dateStr] = `${worker.weeklyData[idx]}%`;
      });
      
      return row;
    });
    
    // Crear workbook y worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resumen Cargabilidad');
    
    // Descargar archivo
    const fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Resumen_Cargabilidad_${fecha}.xlsx`);
  };
  
  if (workersLoading || loading) {
    return (
      <div className="p-6">
        <div>Cargando...</div>
      </div>
    );
  }
  
  if (selectedWorkerIds.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Resumen de Cargabilidad</h2>
        <p>No hay consultores seleccionados. Por favor selecciona consultores desde la página anterior.</p>
        <button
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold"
          onClick={() => router.push('/dashboard/cargabilidad')}
        >
          ← Regresar
        </button>
      </div>
    );
  }

  return (
    <div className="relative p-6">
      <div className="sticky top-0 left-0 z-20 bg-gray-100 mb-6">
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-bold">Resumen de Cargabilidad ({occupancyData.length} consultores)</h2>
          <div className="absolute right-6 top-0 flex gap-2" style={{ zIndex: 30 }}>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200"
              onClick={handleExportExcel}
            >
              📥 Exportar Excel
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200"
              onClick={() => router.push('/dashboard/cargabilidad')}
            >
              ← Regresar
            </button>
          </div>
        </div>
        
        {/* Controles de filtro */}
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <Box className="flex gap-4 items-center flex-wrap bg-white p-4 rounded-lg shadow">
            <FormControl size="small" style={{ minWidth: 150 }}>
              <InputLabel>Número de Semanas</InputLabel>
              <Select
                value={numberOfWeeks}
                label="Número de Semanas"
                onChange={(e) => {
                  setNumberOfWeeks(e.target.value as number);
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                <MenuItem value={1}>1 semana</MenuItem>
                <MenuItem value={2}>2 semanas</MenuItem>
                <MenuItem value={3}>3 semanas</MenuItem>
                <MenuItem value={4}>4 semanas</MenuItem>
                <MenuItem value={6}>6 semanas</MenuItem>
                <MenuItem value={8}>8 semanas</MenuItem>
                <MenuItem value={12}>12 semanas</MenuItem>
              </Select>
            </FormControl>
            
            <div className="text-gray-500 font-semibold">O</div>
            
            <DatePicker
              label="Fecha Inicio"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ 
                textField: { 
                  size: 'small',
                  style: { minWidth: 150 }
                } 
              }}
            />
            
            <DatePicker
              label="Fecha Fin"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              minDate={startDate || undefined}
              slotProps={{ 
                textField: { 
                  size: 'small',
                  style: { minWidth: 150 }
                } 
              }}
            />
            
            {(startDate || endDate) && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setStartDate(null);
                  setEndDate(null);
                }}
              >
                Limpiar Fechas
              </Button>
            )}
          </Box>
        </LocalizationProvider>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-max w-full border border-gray-300 text-xs md:text-sm">
          <thead>
            <tr className="bg-blue-200">
              <th className="border px-2 py-1" colSpan={3}></th>
              {semanasAgrupadas.map((semana, idx) => (
                <th key={idx} className="border px-2 py-1 text-center font-bold" colSpan={semana.dias.length}>
                  {semana.nombre}
                </th>
              ))}
            </tr>
            <tr className="bg-blue-100">
              <th className="border px-2 py-1">Consultor</th>
              <th className="border px-2 py-1">Esquema</th>
              <th className="border px-2 py-1">Tiempo</th>
              {allDays.map((dia, idx) => (
                <th key={idx} className="border px-2 py-1">
                  {dia.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' })}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {occupancyData.map((worker, i) => (
              <tr key={worker.workerId} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-2 py-1 font-semibold whitespace-nowrap">{worker.workerName}</td>
                <td className="border px-2 py-1 whitespace-nowrap">{worker.esquema}</td>
                <td className="border px-2 py-1 whitespace-nowrap">{worker.tiempo}</td>
                {worker.weeklyData.map((percentage, j) => {
                  let bg = 'bg-green-100';
                  if (percentage === 0) bg = 'bg-red-100';
                  else if (percentage > 100) bg = 'bg-yellow-100';
                  return (
                    <td key={j} className={`border px-2 py-1 text-center ${bg}`}>
                      {percentage}%
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
