"use client";

import { useState, useMemo } from "react";
import { Box, TextField, Typography, Autocomplete } from "@mui/material";

// Mock de consultores
const consultores = [
  "Ana López",
  "Luis Pérez",
  "María Gómez",
  "Carlos Ruiz",
  "Ana Torres",
];

// Mock de disponibilidad: cada consultor tiene slots por día
const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const horas = Array.from({ length: 24 }, (_, i) => {
  const h = Math.floor(i / 2) + 0;
  const m = i % 2 === 0 ? "00" : "30";
  return `${h.toString().padStart(2, "0")}:${m}`;
});

const mockDisponibilidad = consultores.map((consultor) => ({
  consultor,
  disponibilidad: dias.map((dia) => horas.map(() => Math.random() > 0.7 ? "Ocupado" : "Libre")),
}));

export default function DisponibilidadPage() {
  const [search, setSearch] = useState("");
  const filteredConsultores = consultores.filter((c) => c.toLowerCase().includes(search.toLowerCase()));
  const selectedConsultor = filteredConsultores[0] || consultores[0];
  const consultorData = mockDisponibilidad.find((c) => c.consultor === selectedConsultor);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Disponibilidad de Consultores
      </Typography>
      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <Autocomplete
          freeSolo
          options={consultores}
          value={search}
          onInputChange={(_, v) => setSearch(v)}
          renderInput={(params) => (
            <TextField {...params} label="Buscar consultor" variant="outlined" />
          )}
        />
      </Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
        {selectedConsultor}
      </Typography>
      <Box sx={{ width: '100%', bgcolor: "#f7f8fa", borderRadius: 2, p: 2 }}>
        <table style={{ borderCollapse: "collapse", width: '100%' }}>
          <thead>
            <tr>
              {dias.map((dia) => (
                <th key={dia} style={{ background: "#f3f6fa", padding: 8, fontWeight: 600, border: "1px solid #e0e0e0" }}>{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {horas.map((_, i) => (
              <tr key={i}>
                {dias.map((dia, j) => (
                  <td
                    key={dia}
                    style={{
                      padding: 6,
                      border: "1px solid #e0e0e0",
                      background: consultorData?.disponibilidad[j][i] === "Ocupado" ? "#ffeaea" : "#eafaf7",
                      color: consultorData?.disponibilidad[j][i] === "Ocupado" ? "#d32f2f" : "#388e3c",
                      textAlign: "center",
                      fontSize: 14,
                    }}
                  >
                    {consultorData?.disponibilidad[j][i]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
