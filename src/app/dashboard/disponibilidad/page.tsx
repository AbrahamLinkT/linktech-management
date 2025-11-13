"use client";

import { useState } from "react";
import { Box, TextField, Typography, Autocomplete } from "@mui/material";
import proyectosData from "@/data/Projects.json";

// Tipado básico para el JSON (ajusta si tu estructura real difiere)
type Proyecto = { titulo: string };
type ProyectosJson = { proyectos: Proyecto[] };

// Mock de consultores
const consultores = [
  "Ana López",
  "Luis Pérez",
  "María Gómez",
  "Carlos Ruiz",
  "Ana Torres",
];

const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const horas = Array.from({ length: 12 }, (_, i) => {
  const h = i + 8; // 8:00 a 19:00 (12 bloques)
  return `${h.toString().padStart(2, "0")}:00`;
});

function getWeekDates(startDate: Date) {
  const dates: string[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    dates.push(
      d.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      })
    );
  }
  return dates;
}

// Generar disponibilidad con nombre de proyecto en slot ocupado
function generarDisponibilidad() {
  const proyectos = (proyectosData as ProyectosJson).proyectos ?? [];
  return dias.map(() =>
    horas.map(() => {
      if (Math.random() > 0.7) {
        const proyecto = proyectos[Math.floor(Math.random() * proyectos.length)];
        return proyecto ? proyecto.titulo : "Ocupado";
      }
      return "Libre";
    })
  );
}

const mockDisponibilidad = consultores.map((consultor) => ({
  consultor,
  disponibilidad: generarDisponibilidad(),
}));

// Apila los slots ocupados arriba y los libres abajo para cada día
function getStackedRows(
  disponibilidad: string[][],
  horasRef: string[],
  diasRef: string[]
) {
  const columnas = diasRef.map((_, j) => {
    const ocupados: string[] = [];
    const libres: string[] = [];
    for (let i = 0; i < horasRef.length; i++) {
      const valor = disponibilidad[j]?.[i] || "Libre";
      if (valor !== "Libre") ocupados.push(valor);
      else libres.push(valor);
    }
    return [...ocupados, ...libres];
  });

  return horasRef.map((_, filaIdx) => (
    <tr key={`fila-${filaIdx}`}>
      {columnas.map((col, colIdx) => {
        const v = col[filaIdx];
        const ocupado = v !== "Libre";
        return (
          <td
            key={`cell-${filaIdx}-${colIdx}`}
            style={{
              background: ocupado ? "#ffeaea" : "#eafaf7",
              color: ocupado ? "#d32f2f" : "#388e3c",
              textAlign: "center",
              fontSize: 14,
              fontWeight: ocupado ? 600 : 400,
              border: "1px solid #e0e0e0",
              padding: 8,
            }}
          >
            {ocupado ? v : "Libre"}
          </td>
        );
      })}
    </tr>
  ));
}

export default function DisponibilidadPage() {
  const [search, setSearch] = useState("");
  const [weekOffset, setWeekOffset] = useState(0); // paginación semanal

  const filteredConsultores = consultores.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );
  const selectedConsultor = filteredConsultores[0] || consultores[0];
  const consultorData = mockDisponibilidad.find(
    (c) => c.consultor === selectedConsultor
  );

  // Calcular fechas de la semana
  const today = new Date();
  const startOfWeek = new Date(today);
  // lunes de la semana (getDay(): 0=Dom, 1=Lun, ...)
  startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7);
  const weekDates = getWeekDates(startOfWeek);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Disponibilidad de Consultores
      </Typography>

      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <Autocomplete
          freeSolo
          options={consultores}
          inputValue={search}
          onInputChange={(_, v) => setSearch(v)}
          renderInput={(params) => (
            <TextField {...params} label="Buscar consultor" variant="outlined" />
          )}
        />
      </Box>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
        {selectedConsultor}
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
          {weekDates[0]} - {weekDates[weekDates.length - 1]}
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
                    {weekDates[idx]}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getStackedRows(consultorData?.disponibilidad || [], horas, dias)}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
