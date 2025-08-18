"use client";

import React, { useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import AddIcon from "@mui/icons-material/Add";

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
  ordenInterna: string; // IO
  proyecto: string;
  facturable: string;
  responsable: string;
  // fecha: string;
};

const initialData: ProyeccionRow[] = [
  // Ejemplo opcional (borra si no lo necesitas)
  // {
  //   id: 1,
  //   consultor: "Ana Pérez",
  //   departamento: "SAP",
  //   tipoEmpleado: "Interno",
  //   esquema: "Tiempo completo",
  //   tiempo: "100%",
  //   modulo: "FI",
  //   nivel: "Semi Sr",
  //   ubicacion: "Monterrey",
  //   sinInfo: "",
  //   estatusContratacion: "Activo",
  //   ordenInterna: "IO-123",
  //   proyecto: "Implementación FI Norte",
  //   facturable: "Sí",
  //   responsable: "Juan López",
  // },
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

  // --- NUEVO: estado para IO seleccionada ---
  const [selectedIO, setSelectedIO] = useState<string>("");

  // IO únicas para poblar el selector
  const uniqueIOs = useMemo(
    () => Array.from(new Set(tableData.map((r) => r.ordenInterna).filter(Boolean))),
    [tableData]
  );

  // Proyecto derivado de la IO seleccionada
  const selectedProyecto = useMemo(() => {
    if (!selectedIO) return "";
    const row = tableData.find((r) => r.ordenInterna === selectedIO);
    return row?.proyecto ?? "";
  }, [selectedIO, tableData]);

  const handleAgregar = () => {
    // Aquí puedes abrir un modal de creación o navegar a un formulario.
    // Por ahora, mostramos el modal existente como placeholder:
    setSelectedRow(null);
    setOpenModal(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Encabezado con elementos a la derecha */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ mr: "auto" }}>
          Proyección
        </Typography>

        {/* Controles a la derecha */}
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="io-select-label">OI</InputLabel>
            <Select
              labelId="io-select-label"
              label="OI"
              value={selectedIO}
              onChange={(e) => setSelectedIO(e.target.value)}
            >
              {uniqueIOs.length === 0 && (
                <MenuItem value="" disabled>
                  Sin OI registradas
                </MenuItem>
              )}
              {uniqueIOs.map((io) => (
                <MenuItem key={io} value={io}>
                  {io}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="body1" sx={{ minWidth: 240 }}>
            <strong>Proyecto:</strong>{" "}
            {selectedIO ? selectedProyecto || "—" : "Selecciona una OI"}
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAgregar}
          >
            Agregar Consultor
          </Button>
        </Stack>
      </Box>

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
          <Button onClick={() => setOpenModal(false)} color="inherit">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProyeccionTable;
