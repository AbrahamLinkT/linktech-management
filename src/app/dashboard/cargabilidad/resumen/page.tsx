"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useWorkers } from "@/hooks/useWorkers";
import { useAssignedHours } from "@/hooks/useAssignedHours";
import { buildApiUrl } from "@/config/api";
import * as XLSX from 'xlsx';

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
  
  const { data: allWorkers, loading: workersLoading } = useWorkers();
  const { getAssignedHours } = useAssignedHours();
  
  const [assignedHours, setAssignedHours] = useState<any[]>([]);
  const [workSchedules, setWorkSchedules] = useState<Map<number, any>>(new Map());
  const [loading, setLoading] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  
  // IDs de workers seleccionados
  const selectedWorkerIds = useMemo(() => {
    if (!workersParam) return [];
    return workersParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
  }, [workersParam]);
  
  // Generar semanas (últimas 3 semanas)
  const generateWeeks = () => {
    const weeks = [];
    const today = new Date();
    
    for (let weekOffset = -2; weekOffset <= 0; weekOffset++) {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);
      
      const days = [];
      for (let i = 0; i < 5; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        days.push(d);
      }
      
      const weekNumber = getWeekNumber(startOfWeek);
      weeks.push({
        nombre: `SEMANA ${weekNumber}`,
        dias: days
      });
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
  
  const semanasAgrupadas = generateWeeks();
  const allDays = semanasAgrupadas.flatMap(s => s.dias);
  
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
    const loadWorkSchedules = async () => {
      if (!allWorkers || allWorkers.length === 0) {
        console.log('📦 Sin workers, no cargando schedules en resumen');
        return;
      }
      
      console.log('📦 Resumen - Cargando work schedules...', allWorkers.length, 'workers');
      setLoadingSchedules(true);
      const scheduleMap = new Map<number, any>();
      const uniqueSchemeIds = new Set(allWorkers.map(w => w.scheme_id).filter(Boolean));
      console.log('🔍 Resumen - Scheme IDs únicos a cargar:', Array.from(uniqueSchemeIds));
      
      for (const schemeId of uniqueSchemeIds) {
        try {
          const url = buildApiUrl(`/work-schedule/${schemeId}`);
          console.log(`🌐 Resumen - Intentando cargar: ${url}`);
          const res = await fetch(url);
          if (res.ok) {
            const schedule = await res.json();
            console.log(`✅ Resumen - Schedule cargado para ${schemeId}:`, schedule);
            scheduleMap.set(Number(schemeId), schedule);
          } else {
            console.error(`❌ Resumen - Error cargando schedule ${schemeId}: ${res.status} ${res.statusText}`);
          }
        } catch (err) {
          console.error(`❌ Resumen - Exception cargando schedule ${schemeId}:`, err);
        }
      }
      
      console.log('✅ Resumen - Work schedules finalizados. Mapa:', Array.from(scheduleMap.entries()));
      setWorkSchedules(scheduleMap);
      setLoadingSchedules(false);
    };
    
    if (allWorkers && allWorkers.length > 0) {
      loadWorkSchedules();
    }
  }, [allWorkers]);
  
  // Función para calcular horas diarias del esquema
  const calculateDailyHours = (schemeId?: number | null): string => {
    if (!schemeId) return 'N/A';
    
    const schedule = workSchedules.get(schemeId);
    if (!schedule) return 'N/A';
    
    // Si hours es solo un número (ej: "8")
    if (!isNaN(parseFloat(schedule.hours)) && !schedule.hours.includes(':')) {
        return String(schedule.hours);
    }
    
    // Si hours es en formato "HH:MM-HH:MM"
    if (schedule.hours) {
        const hoursMatch = String(schedule.hours).trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
        if (hoursMatch) {
            const startH = parseInt(hoursMatch[1], 10);
            const startM = parseInt(hoursMatch[2], 10);
            const endH = parseInt(hoursMatch[3], 10);
            const endM = parseInt(hoursMatch[4], 10);
            
            const startTotal = startH * 60 + startM;
            const endTotal = endH * 60 + endM;
            let diff = Math.abs(endTotal - startTotal);
            diff = Math.min(diff, 24 * 60 - diff);
            const dailyHours = diff / 60;
            
            return Number.isInteger(dailyHours) ? String(dailyHours) : dailyHours.toFixed(1);
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
        // Si hours es solo un número (ej: "8")
        if (!isNaN(parseFloat(schedule.hours)) && !schedule.hours.includes(':')) {
          dailyHours = parseFloat(schedule.hours);
        } else {
          // Si hours es en formato "HH:MM-HH:MM"
          const hoursMatch = String(schedule.hours).trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
          if (hoursMatch) {
            const startH = parseInt(hoursMatch[1], 10);
            const startM = parseInt(hoursMatch[2], 10);
            const endH = parseInt(hoursMatch[3], 10);
            const endM = parseInt(hoursMatch[4], 10);
            const startTotal = startH * 60 + startM;
            const endTotal = endH * 60 + endM;
            let diff = Math.abs(endTotal - startTotal);
            diff = Math.min(diff, 24 * 60 - diff);
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
      <div className="sticky top-0 left-0 z-20 bg-gray-100 flex items-center mb-6" style={{ minHeight: '3.5rem' }}>
        <h2 className="text-2xl font-bold">Resumen de Cargabilidad ({occupancyData.length} consultores)</h2>
        <div className="absolute right-6 top-6 flex gap-2" style={{ zIndex: 30 }}>
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
