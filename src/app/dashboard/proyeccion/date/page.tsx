"use client";
import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Button,
} from "@mui/material";

const semanas = [
  {
    nombre: "Semana 1",
    dias: ["Lunes 1", "Martes 2", "Miércoles 3", "Jueves 4", "Viernes 5"],
  },
  {
    nombre: "Semana 2",
    dias: ["Lunes 8", "Martes 9", "Miércoles 10", "Jueves 11", "Viernes 12"],
  },
  {
    nombre: "Semana 3",
    dias: ["Lunes 15", "Martes 16", "Miércoles 17", "Jueves 18", "Viernes 19"],
  },
];

const columns = [
  "Consultor",
  "Departamento",
  "Tipo de empleado",
  "Esquema",
  "Tiempo",
  "Modulo",
  "Nivel",
];

const rows = [
  {
    id: 1,
    consultor: "",
    departamento: "",
    tipoEmpleado: "",
    esquema: "",
    tiempo: "",
    modulo: "",
    nivel: "",
    horas: ["8h", "8h", "8h", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    fechaLibre: "10-09-25",
  },
  {
    id: 2,
    consultor: "",
    departamento: "",
    tipoEmpleado: "",
    esquema: "",
    tiempo: "",
    modulo: "",
    nivel: "",
    horas: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
    fechaLibre: "20-09-25",
  },
];

export default function ProyeccionDatePage() {
  return (
    <Box sx={{ p: 4, bgcolor: '#f7f8fa', minHeight: '100vh' }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Proyección
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" sx={{ bgcolor: '#444', color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 500 }}>
          Seleccionar horas
        </Button>
        <Button variant="contained" sx={{ bgcolor: '#444', color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 500 }}>
          Seleccionar horas
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell rowSpan={2} sx={{ width: 40, bgcolor: '#f7f8fa', border: 'none' }}></TableCell>
              {columns.map((col, idx) => (
                <TableCell key={col} rowSpan={2} sx={{ bgcolor: '#f7f8fa', fontWeight: 500, border: 'none', textAlign: 'center', minWidth: 80 }}>
                  {col}
                </TableCell>
              ))}
              {semanas.map((semana, idx) => (
                <TableCell key={semana.nombre} colSpan={semana.dias.length} sx={{ bgcolor: '#dedbe7', fontWeight: 700, fontSize: 22, textAlign: 'center', border: 'none' }}>
                  {semana.nombre}
                  <Typography sx={{ fontSize: 14, fontWeight: 400 }}>Agosto</Typography>
                </TableCell>
              ))}
              <TableCell rowSpan={2} sx={{ bgcolor: '#f7f8fa', border: 'none' }}></TableCell>
            </TableRow>
            <TableRow>
              {semanas.map((semana) =>
                semana.dias.map((dia) => (
                  <TableCell key={dia} sx={{ bgcolor: '#b6c6f7', color: '#222', fontWeight: 500, textAlign: 'center', border: 'none', minWidth: 60 }}>
                    {dia}
                  </TableCell>
                ))
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ bgcolor: '#f7f8fa', border: 'none', textAlign: 'center' }}>
                  <Checkbox checked sx={{ color: '#7c5fe6' }} />
                </TableCell>
                {columns.map((col, idx) => (
                  <TableCell key={col + idx} sx={{ border: 'none', textAlign: 'center', bgcolor: '#f7f8fa' }}>
                    {/* Aquí iría el dato real */}
                  </TableCell>
                ))}
                {row.horas.map((h, idx) => (
                  <TableCell key={idx} sx={{ border: 'none', textAlign: 'center', bgcolor: h ? '#e3e8fd' : '#fff', color: '#222', fontWeight: 500 }}>
                    {h}
                  </TableCell>
                ))}
                <TableCell sx={{ border: 'none', bgcolor: '#4afc7c', color: '#222', fontWeight: 700, textAlign: 'center', minWidth: 80 }}>
                  {row.fechaLibre}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
