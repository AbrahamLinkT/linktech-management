"use client";

import { useState, useEffect, useMemo } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Box, TextField, Typography, Autocomplete } from "@mui/material";
import { useWorkers } from "@/hooks/useWorkers";
import { useAssignedHours } from "@/hooks/useAssignedHours";
import { buildApiUrl } from "@/config/api";

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const horas = Array.from({ length: 12 }, (_, i) => {
  const h = i + 8; // 8:00 a 19:00 (12 bloques)
  return `${h.toString().padStart(2, "0")}:00`;
});

function getWeekDates(startDate: Date) {
  const dates: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatDateString(date: Date) {
  return date.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function dateToYMD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function DisponibilidadPage() {
  const { data: workers, loading: workersLoading } = useWorkers();
  const { getAssignedHours } = useAssignedHours();
  
  const [search, setSearch] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [assignedHours, setAssignedHours] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [workSchedules, setWorkSchedules] = useState<Map<number, any>>(new Map());

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

  // Cargar work schedules para calcular horas por día
  useEffect(() => {
    const loadWorkSchedules = async () => {
      const scheduleMap = new Map<number, any>();
      const uniqueSchemeIds = new Set(workers.map(w => w.scheme_id).filter(Boolean));
      
      for (const schemeId of uniqueSchemeIds) {
        try {
          const res = await fetch(buildApiUrl(`/work-schedule/${schemeId}`));
          if (res.ok) {
            const schedule = await res.json();
            scheduleMap.set(Number(schemeId), schedule);
          }
        } catch (err) {
          console.error(`Error cargando schedule ${schemeId}:`, err);
        }
      }
      
      setWorkSchedules(scheduleMap);
    };
    
    if (workers.length > 0) {
      loadWorkSchedules();
    }
  }, [workers]);

  // Calcular fechas de la semana
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);
  const weekDates = getWeekDates(startOfWeek);
  const weekDatesFormatted = weekDates.map(formatDateString);

  // Filtrar consultores
  const consultores = workers.map(w => ({ id: w.id, name: w.name }));
  const filteredConsultores = consultores.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  
  const selectedConsultorId = filteredConsultores[0]?.id || consultores[0]?.id;
  const selectedConsultor = consultores.find(c => c.id === selectedConsultorId);

  // Calcular disponibilidad del consultor seleccionado
  const disponibilidad = useMemo(() => {
    if (!selectedConsultorId) return [];

    const worker = workers.find(w => w.id === selectedConsultorId);
    const schedule = worker?.scheme_id ? workSchedules.get(worker.scheme_id) : null;
    
    // Calcular horas máximas por día
    let maxHoursPerDay = 8; // default
    if (schedule?.hours) {
      const match = String(schedule.hours).match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
      if (match) {
        const startH = parseInt(match[1], 10);
        const startM = parseInt(match[2], 10);
        const endH = parseInt(match[3], 10);
        const endM = parseInt(match[4], 10);
        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;
        let diff = Math.abs(endTotal - startTotal);
        diff = Math.min(diff, 24 * 60 - diff);
        maxHoursPerDay = diff / 60;
      }
    }

    // Filtrar asignaciones del worker en el rango de la semana
    const workerAssignments = assignedHours.filter(ah => ah.assignedTo === selectedConsultorId);

    return weekDates.map((date) => {
      const dateYMD = dateToYMD(date);
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
      
      let totalHours = 0;
      const projects: string[] = [];

      for (const assignment of workerAssignments) {
        // Verificar si esta asignación aplica para esta fecha
        const inRange = (!assignment.startDate || dateYMD >= assignment.startDate) && 
                       (!assignment.endDate || dateYMD <= assignment.endDate);
        
        if (inRange && assignment.hoursData) {
          const hoursForDay = assignment.hoursData[dayName] || 0;
          if (hoursForDay > 0) {
            totalHours += hoursForDay;
            if (assignment.projectName && !projects.includes(assignment.projectName)) {
              projects.push(assignment.projectName);
            }
          }
        }
      }

      const horasLibres = Math.max(0, maxHoursPerDay - totalHours);
      
      return {
        totalHours,
        horasLibres,
        projects,
        maxHours: maxHoursPerDay
      };
    });
  }, [selectedConsultorId, assignedHours, weekDates, workers, workSchedules]);

  if (workersLoading || loading) {
    return (
      <ProtectedRoute requiredPermission="disponibilidad">
        <Box sx={{ p: 4 }}>
          <Typography>Cargando...</Typography>
        </Box>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredPermission="disponibilidad">
      <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Disponibilidad de Consultores
      </Typography>

      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <Autocomplete
          freeSolo
          options={consultores.map(c => c.name)}
          inputValue={search}
          onInputChange={(_, v) => setSearch(v)}
          renderInput={(params) => (
            <TextField {...params} label="Buscar consultor" variant="outlined" />
          )}
        />
      </Box>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
        {selectedConsultor?.name || 'Selecciona un consultor'}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          style={{
            marginRight: 16,
            padding: "4px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: "#f3f6fa",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          ← Semana anterior
        </button>

        <Typography sx={{ fontWeight: 600, fontSize: 18, color: "#2563eb" }}>
          {weekDatesFormatted[0]} - {weekDatesFormatted[weekDatesFormatted.length - 1]}
        </Typography>

        <button
          onClick={() => setWeekOffset((w) => w + 1)}
          style={{
            marginLeft: 16,
            padding: "4px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: "#f3f6fa",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Semana siguiente →
        </button>
      </Box>

      <Box sx={{ width: "100%", bgcolor: "#f7f8fa", borderRadius: 2, p: 2 }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              {dias.map((dia, idx) => (
                <th
                  key={`${dia}-${idx}`}
                  style={{
                    background: "#f3f6fa",
                    padding: 8,
                    fontWeight: 600,
                    border: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  {dia}
                  <br />
                  <span style={{ fontWeight: 400, fontSize: 13 }}>
                    {weekDatesFormatted[idx]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {disponibilidad.map((disp, idx) => {
                const ocupadas = disp.totalHours;
                const libres = disp.horasLibres;
                const porcentaje = ((ocupadas / disp.maxHours) * 100).toFixed(0);
                
                return (
                  <td
                    key={`disp-${idx}`}
                    style={{
                      background: ocupadas >= disp.maxHours ? "#ffeaea" : ocupadas > 0 ? "#fff4e6" : "#eafaf7",
                      border: "1px solid #e0e0e0",
                      padding: 16,
                      verticalAlign: "top",
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                      {ocupadas >= disp.maxHours ? "🔴 Ocupado" : ocupadas > 0 ? "🟡 Parcial" : "🟢 Libre"}
                    </div>
                    <div style={{ fontSize: 13, marginBottom: 4 }}>
                      <strong>Ocupadas:</strong> {ocupadas}h ({porcentaje}%)
                    </div>
                    <div style={{ fontSize: 13, marginBottom: 8 }}>
                      <strong>Libres:</strong> {libres.toFixed(1)}h
                    </div>
                    {disp.projects.length > 0 && (
                      <div style={{ fontSize: 12, color: "#555" }}>
                        <strong>Proyectos:</strong>
                        <ul style={{ margin: "4px 0", paddingLeft: 20 }}>
                          {disp.projects.map((p, pidx) => (
                            <li key={pidx}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </Box>
    </Box>
    </ProtectedRoute>
  );
}
