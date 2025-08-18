"use client";

import React, { useState } from "react";
import {
  MaterialReactTable
} from "material-react-table";
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
// import horasAsignadasData from '../../data/HorasAsignadas.json';

// 1. Define la interfaz para los datos
type ProyeccionRow = {
  id: number;
  consultor: string;
  departamento: string;
  tipoEmpleado: string;
  esquema: string;
  tiempo: string;
  modulo: string;
  nivel: string;
  ubicacion: string;
  sinInfo: string;
  estatusContratacion: string;
  ordenInterna: string;
  proyecto: string;
  facturable: string;
  responsable: string;
  // fecha: string;
};

const initialData: ProyeccionRow[] = [
  {
    id: 1,
    consultor: "BLANCO PEREZ HECTOR ALEJANDRO",
    departamento: "",
    tipoEmpleado: "",
    esquema: "",
    tiempo: "",
    modulo: "",
    nivel: "",
    ubicacion: "",
    sinInfo: "",
    estatusContratacion: "",
    ordenInterna: "IC202502",
    proyecto: "PV - SV - Doal - Cash Flow",
    facturable: "Fact",
    responsable: "Yayoy Gómez",
    // fecha: "",
  },
  {
    id: 2,
    consultor: "GOMEZ MARTINEZ YAYOY MONSERRAT",
    departamento: "Servicios",
    tipoEmpleado: "Interno",
    esquema: "Asimilado",
    tiempo: "FT",
    modulo: "PM",
    nivel: "",
    ubicacion: "MTY",
    sinInfo: "1",
    estatusContratacion: "",
    ordenInterna: "IC202502",
    proyecto: "PV - SV - Doal - Cash Flow",
    facturable: "No Fact",
    responsable: "Yayoy Gómez",
    // fecha: "",
  },
  {
    id: 3,
    consultor: "HERNANDEZ MACIAS RAFAEL",
    departamento: "Servicios",
    tipoEmpleado: "Interno",
    esquema: "Asimilado",
    tiempo: "FT",
    modulo: "FI",
    nivel: "",
    ubicacion: "CDMX",
    sinInfo: "1",
    estatusContratacion: "",
    ordenInterna: "IC202502",
    proyecto: "PV - SV - Doal - Cash Flow",
    facturable: "Fact",
    responsable: "Yayoy Gómez",
    // fecha: "",
  },
  {
    id: 4,
    consultor: "RAMIREZ MORENO JAIME",
    departamento: "Servicios",
    tipoEmpleado: "Interno",
    esquema: "Asimilado",
    tiempo: "OD",
    modulo: "FI",
    nivel: "",
    ubicacion: "",
    sinInfo: "1",
    estatusContratacion: "Baja Proyecto",
    ordenInterna: "IC202502",
    proyecto: "PV - SV - Doal - Cash Flow",
    facturable: "No Fact",
    responsable: "Yayoy Gómez",
    // fecha: "",
  },
  {
    id: 5,
    consultor: "BLANCAS VELAZQUEZ ARMANDO",
    departamento: "Servicios",
    tipoEmpleado: "Interno",
    esquema: "Asimilado",
    tiempo: "FT",
    modulo: "FICO",
    nivel: "",
    ubicacion: "",
    sinInfo: "1",
    estatusContratacion: "Delivery",
    ordenInterna: "NN202205",
    proyecto: "SV - Galletas Dondé - Implementación S/4 HANA",
    facturable: "Fact",
    responsable: "Yayoy Gómez",
    // fecha: "4",
  },
  {
    id: 6,
    consultor: "GOMEZ MARTINEZ YAYOY MONSERRAT",
    departamento: "Servicios",
    tipoEmpleado: "Interno",
    esquema: "Asimilado",
    tiempo: "FT",
    modulo: "PM",
    nivel: "",
    ubicacion: "MTY",
    sinInfo: "1",
    estatusContratacion: "",
    ordenInterna: "NN202205",
    proyecto: "SV - Galletas Dondé - Implementación S/4 HANA",
    facturable: "Fact",
    responsable: "Yayoy Gómez",
    // fecha: "1",
  },
];

const columns = [
  { accessorKey: "consultor", header: "Consultor" },
  { accessorKey: "departamento", header: "Departamento" },
  { accessorKey: "tipoEmpleado", header: "Tipo de Empleado" },
  { accessorKey: "esquema", header: "Esquema" },
  { accessorKey: "tiempo", header: "Tiempo" },
  { accessorKey: "modulo", header: "Módulo" },
  { accessorKey: "nivel", header: "Nivel" },
  { accessorKey: "ubicacion", header: "Ubicación" },
  { accessorKey: "sinInfo", header: "sin info" },
  { accessorKey: "estatusContratacion", header: "Estatus contratación" },
  { accessorKey: "ordenInterna", header: "Orden Interna Linkplace / Ticket DC" },
  { accessorKey: "proyecto", header: "Proyecto Linkplace" },
  { accessorKey: "facturable", header: "Facturable" },
  { accessorKey: "responsable", header: "Responsable de proyecto" },
];

const ProyeccionTable: React.FC = () => {
  const [tableData] = useState<ProyeccionRow[]>(initialData);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ProyeccionRow | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);





  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Proyección
      </Typography>

      <MaterialReactTable<ProyeccionRow>
        columns={columns}
        data={tableData}
        enableColumnResizing
        enableRowNumbers
        enablePagination
        enableColumnFilterModes
        enableFacetedValues
        enableFilters
        enableHiding
        enableColumnOrdering
        enableFullScreenToggle
        enableDensityToggle
        enableColumnActions
        muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => {
            setSelectedRow(row.original);
            setOpenModal(true);
          },
          style: { cursor: "pointer" },
        })}
      />

      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Agenda mensual de horas asignadas</DialogTitle>
        <DialogContent sx={{ minHeight: 500 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              value={selectedDate}
              onChange={setSelectedDate}
            />
          </LocalizationProvider>
          {selectedRow && (
            <Box mt={2}>
              <Typography variant="body2" color="text.secondary">
                <strong>Consultor:</strong> {selectedRow.consultor}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Proyecto:</strong> {selectedRow.proyecto}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProyeccionTable;
