"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkers } from "@/hooks/useWorkers";
import { useAssignedHours } from "@/hooks/useAssignedHours";
import { useDepartments } from "@/hooks/useDepartments";
import * as XLSX from 'xlsx';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Box, Button, MenuItem, Select, FormControl, InputLabel, TextField } from '@mui/material';
import { ContentBody } from '@/components/containers/containers';

interface WorkerOccupancy {
  workerId: number;
  workerName: string;
  esquema: string;
  tiempo: string;
  weeklyData: number[]; // % de ocupación por día
}

export default function CargaDepartamento() {
  const router = useRouter();
  const { data: allWorkers, loading: workersLoading } = useWorkers();
  const { getAssignedHours } = useAssignedHours();
  const { data: departments } = useDepartments();

  const [assignedHours, setAssignedHours] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | ''>('');
  const [filteredWorkers, setFilteredWorkers] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [numberOfWeeks, setNumberOfWeeks] = useState<number>(4);
  const [workSchedules, setWorkSchedules] = useState<Map<number, any>>(new Map());
  const [loadingSchedules, setLoadingSchedules] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const hours = await getAssignedHours();
        setAssignedHours(hours);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    // build workSchedules map from workers schemes
    const map = new Map<number, any>();
    (allWorkers || []).forEach((w: any) => {
      if (w.scheme_id && w.scheme) map.set(w.scheme_id, w.scheme);
    });
    setWorkSchedules(map);
    setLoadingSchedules(false);
  }, [allWorkers]);

  const generateWeeks = () => {
    const weeks: any[] = [];
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setDate(start.getDate() - (start.getDay() === 0 ? 6 : start.getDay() - 1));
      let current = new Date(start);
      let counter = 1;
      while (current <= end) {
        const dias: Date[] = [];
        for (let i = 0; i < 5; i++) {
          const d = new Date(current);
          d.setDate(current.getDate() + i);
          dias.push(d);
        }
        weeks.push({ nombre: `SEMANA ${counter}`, dias });
        counter++;
        current.setDate(current.getDate() + 7);
      }
    } else {
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1));
      for (let w = 0; w < numberOfWeeks; w++) {
        const startOfWeek = new Date(start);
        startOfWeek.setDate(start.getDate() + w * 7);
        const dias: Date[] = [];
        for (let i = 0; i < 5; i++) {
          const d = new Date(startOfWeek);
          d.setDate(startOfWeek.getDate() + i);
          dias.push(d);
        }
        weeks.push({ nombre: `SEMANA ${w + 1}`, dias });
      }
    }
    return weeks;
  };

  const semanasAgrupadas = useMemo(() => generateWeeks(), [startDate, endDate, numberOfWeeks]);
  const allDays = useMemo(() => semanasAgrupadas.flatMap(s => s.dias), [semanasAgrupadas]);

  const handleAccept = async () => {
    if (!selectedDepartment) return;
    // fetch workers by department from /worker via useWorkers hook or filter allWorkers
    const matched = (allWorkers || []).filter((w: any) => Number(w.department_id) === Number(selectedDepartment));
    setFilteredWorkers(matched);
  };

  const calculateDailyHours = (schemeId?: number | null): string => {
    if (!schemeId) return 'N/A';
    const schedule = workSchedules.get(schemeId);
    if (!schedule) return 'N/A';
    const hours = schedule.hours;
    const numHours = parseFloat(hours);
    if (!isNaN(numHours) && !String(hours).includes(':')) return String(numHours);
    if (typeof hours === 'string' && hours.includes(':') && hours.includes('-')) {
      const m = String(hours).trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
      if (m) {
        const sH = parseInt(m[1], 10); const sM = parseInt(m[2], 10);
        const eH = parseInt(m[3], 10); const eM = parseInt(m[4], 10);
        let diff = (eH * 60 + eM) - (sH * 60 + sM);
        if (diff < 0) diff += 24 * 60;
        const total = diff / 60;
        return Number.isInteger(total) ? String(total) : total.toFixed(1);
      }
    }
    return 'N/A';
  };

  const occupancyData: WorkerOccupancy[] = useMemo(() => {
    if (!filteredWorkers || filteredWorkers.length === 0 || assignedHours.length === 0) return [];
    return (filteredWorkers || []).map((worker: any) => {
      const schedule = worker.scheme_id ? workSchedules.get(worker.scheme_id) : null;
      let dailyHours = 8;
      let workingDaysSet = new Set<string>();
      if (schedule?.hours) {
        const hours = schedule.hours;
        const numHours = parseFloat(hours);
        if (!isNaN(numHours) && !String(hours).includes(':')) dailyHours = numHours;
        else {
          const m = String(hours).trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
          if (m) {
            const sH = parseInt(m[1], 10); const sM = parseInt(m[2], 10);
            const eH = parseInt(m[3], 10); const eM = parseInt(m[4], 10);
            let diff = (eH * 60 + eM) - (sH * 60 + sM);
            if (diff < 0) diff += 24 * 60;
            dailyHours = diff / 60;
          }
        }
      }
      if (schedule?.working_days) {
        const days = String(schedule.working_days).split(',').map((d: string) => d.trim().toUpperCase());
        workingDaysSet = new Set(days);
      }
      const workerAssignments = assignedHours.filter(ah => ah.assignedTo === worker.id);
      const weeklyData = allDays.map(date => {
        const dateYMD = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const dayIndex = date.getDay();
        const dayNames = ['DOMINGO','LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO'];
        const dayName = dayNames[dayIndex];
        const isWorkingDay = workingDaysSet.size === 0 || workingDaysSet.has(dayName);
        if (!isWorkingDay) return 0;
        const max = dailyHours;
        let totalHours = 0;
        for (const assignment of workerAssignments) {
          const inRange = (!assignment.startDate || dateYMD >= assignment.startDate) && (!assignment.endDate || dateYMD <= assignment.endDate);
          if (inRange && assignment.hoursData) {
            const dayNamesLower = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
            const dayNameLower = dayNamesLower[dayIndex];
            const hoursForDay = assignment.hoursData[dayNameLower] || 0;
            totalHours += hoursForDay;
          }
        }
        const percentage = max > 0 ? (totalHours / max) * 100 : 0;
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
  }, [filteredWorkers, assignedHours, allDays, workSchedules]);

  const columnAverages = useMemo(() => {
    if (!occupancyData || occupancyData.length === 0) return new Array(allDays.length).fill(0);
    const sums = new Array(allDays.length).fill(0);
    occupancyData.forEach((w) => {
      w.weeklyData.forEach((val, idx) => {
        sums[idx] = (sums[idx] || 0) + (typeof val === 'number' ? val : 0);
      });
    });
    return sums.map((s) => Math.round(s / occupancyData.length));
  }, [occupancyData, allDays.length]);

  const handleExportExcel = () => {
    if (occupancyData.length === 0) {
      alert('No hay datos para exportar');
      return;
    }
    const excelData = occupancyData.map(worker => {
      const row: any = { 'Consultor': worker.workerName, 'Esquema': worker.esquema, 'Tiempo': worker.tiempo };
      allDays.forEach((dia, idx) => {
        const dateStr = dia.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' });
        row[dateStr] = `${worker.weeklyData[idx]}%`;
      });
      return row;
    });
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Carga Departamento');
    const fecha = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `Carga_Departamento_${fecha}.xlsx`);
  };

  return (
    <ContentBody title="Carga Departamento">
      <div className="mb-4 flex items-center gap-4">
        <FormControl size="small" style={{ minWidth: 200 }}>
          <InputLabel>Departamento</InputLabel>
          <Select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value as number | '')} label="Departamento">
            <MenuItem value="">Seleccione</MenuItem>
            {(departments || []).map((d: any) => (
              <MenuItem key={d.id} value={d.id}>{d.departamento}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleAccept}>Aceptar</Button>
        <Button variant="outlined" onClick={() => { setSelectedDepartment(''); setFilteredWorkers([]); }}>Limpiar</Button>
        <div className="ml-auto flex gap-2">
          <Button onClick={handleExportExcel} variant="contained" color="success">📥 Exportar Excel</Button>
          <Button onClick={() => router.push('/dashboard/cargabilidad')} variant="outlined">← Regresar</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-max w-full border border-gray-300 text-xs md:text-sm">
          <thead>
            <tr className="bg-blue-200">
              <th className="border px-2 py-1" colSpan={3}></th>
              {semanasAgrupadas.map((semana, idx) => (
                <th key={idx} className="border px-2 py-1 text-center font-bold" colSpan={semana.dias.length}>{semana.nombre}</th>
              ))}
            </tr>
            <tr className="bg-blue-100">
              <th className="border px-2 py-1">Consultor</th>
              <th className="border px-2 py-1">Esquema</th>
              <th className="border px-2 py-1">Tiempo</th>
              {allDays.map((dia, idx) => (
                <th key={idx} className="border px-2 py-1">{dia.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: '2-digit' })}</th>
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
          <tfoot>
            <tr className="bg-blue-50">
              <td className="border px-2 py-1 font-semibold text-center" colSpan={3}>Promedio</td>
              {columnAverages.map((avg, idx) => {
                let bg = 'bg-green-100';
                if (avg === 0) bg = 'bg-red-100';
                else if (avg > 100) bg = 'bg-yellow-100';
                return (
                  <td key={idx} className={`border px-2 py-1 text-center ${bg}`}>
                    {avg}%
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>
    </ContentBody>
  );
}
