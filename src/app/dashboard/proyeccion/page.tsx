"use client";
import { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

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
};

const initialData: ProyeccionRow[] = [];

const columns: MRT_ColumnDef<ProyeccionRow>[] = [
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
  // Función para seleccionar/deseleccionar checkboxes en el modal
  const handleSelectModalRow = (idx: number) => {
    setSelectedModalRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };
  // Función para agregar los seleccionados del modal a la tabla principal
  const handleAgregarSeleccionados = () => {
    const nuevos = modalRows.filter((_, idx) => selectedModalRows[idx]);
    if (nuevos.length) {
      setTableData((prev) => [
        ...prev,
        ...nuevos.map((row) => ({
          consultor: row.nombre,
          departamento: row.departamento,
          tipoEmpleado: '',
          esquema: '',
          tiempo: '',
          modulo: '',
          nivel: row.nivel,
          ubicacion: '',
          sinInfo: '',
          estatusContratacion: '',
          ordenInterna: '',
          proyecto: '',
          facturable: '',
          responsable: '',
          id: Math.random()
        }))
      ]);
      setOpenAddModal(false);
      setSelectedModalRows({});
    }
  };
  // Estado para los checkboxes seleccionados en el modal
  const [selectedModalRows, setSelectedModalRows] = useState<Record<number, boolean>>({});
  // Filas de ejemplo para el modal de selección
  const [modalRows] = useState([
    { nombre: 'Rigo', especialidad: 'FI', nivel: 'Sr', departamento: 'Servicios' },
    { nombre: 'Rafael', especialidad: 'FI', nivel: 'Sr', departamento: 'Servicios' }
  ]);
  // Estados para el rango de fechas en el modal
  const [fechaDesde, setFechaDesde] = useState<Dayjs | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Dayjs | null>(null);

  // Estado para el modal de agregar consultor
  const [openAddModal, setOpenAddModal] = useState(false);
  const [tableData, setTableData] = useState<ProyeccionRow[]>(initialData);

  // (Estos dos estados existen pero aún no se usan en un modal de detalle)
  // const [openModal, setOpenModal] = useState(false);
  // const [selectedRow, setSelectedRow] = useState<ProyeccionRow | null>(null);

  // --- NUEVO: estado para IO seleccionada ---
  const [selectedIO, setSelectedIO] = useState<string>("");

  // IO únicas para poblar el selector
  const uniqueIOs = useMemo(
    () =>
      Array.from(
        new Set(tableData.map((r) => r.ordenInterna).filter(Boolean))
      ),
    [tableData]
  );

  // Proyecto derivado de la IO seleccionada
  const selectedProyecto = useMemo(() => {
    if (!selectedIO) return "";
    const row = tableData.find((r) => r.ordenInterna === selectedIO);
    return row?.proyecto ?? "";
  }, [selectedIO, tableData]);

  const handleAgregar = () => {
    setOpenAddModal(true);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Encabezado y controles */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ mr: "auto" }}>
          Proyección
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="oi-select-label">OI</InputLabel>
            <Select
              labelId="oi-select-label"
              label="OI"
              value={selectedIO}
              onChange={(e) => setSelectedIO(e.target.value)}
            >
              {uniqueIOs.length === 0 && (
                <MenuItem value="" disabled>
                  Sin OI registradas
                </MenuItem>
              )}
              {uniqueIOs.map((oi) => (
                <MenuItem key={oi} value={oi}>
                  {oi}
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
            Agregar consultor
          </Button>
        </Stack>
      </Box>

      {/* Tabla principal */}
      <MaterialReactTable
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
        // Si luego agregas modal de detalle, descomenta:
        // muiTableBodyRowProps={({ row }) => ({
        //   onClick: () => {
        //     setSelectedRow(row.original);
        //     setOpenModal(true);
        //   },
        //   style: { cursor: "pointer" },
        // })}
      />

      {/* Modal para agregar consultor */}
      <Dialog
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Agregar Consultor</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, py: 2 }}>
            {/* Búsqueda por nombre, especialidad y nivel */}
            {[
              { label: "Nombre", placeholder: "Buscar por nombre" },
              { label: "Especialidad", placeholder: "Buscar por especialidad" },
              { label: "Nivel", placeholder: "Buscar por nivel" },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Box
                  sx={{
                    minWidth: 120,
                    bgcolor: "#f7f4fa",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textAlign: "right",
                  }}
                >
                  <Typography sx={{ fontWeight: 500, color: "#444" }}>
                    {item.label}:
                  </Typography>
                </Box>
                <TextField
                  placeholder={item.placeholder}
                  variant="outlined"
                  size="medium"
                  fullWidth
                  sx={{
                    bgcolor: "#ede9f6",
                    borderRadius: 8,
                    ".MuiOutlinedInput-root": {
                      borderRadius: 8,
                      height: 56,
                      fontSize: 22,
                      color: "#3c3842",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <Box sx={{ pr: 2 }}>
                        <IconButton edge="end" sx={{ color: "#3c3842" }}>
                          <SearchIcon />
                        </IconButton>
                      </Box>
                    ),
                  }}
                />
              </Box>
            ))}

            {/* Selector de rango de fechas */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <Box
                sx={{
                  minWidth: 120,
                  bgcolor: "#f7f4fa",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  textAlign: "right",
                }}
              >
                <Typography sx={{ fontWeight: 500, color: "#444" }}>
                  Fecha:
                </Typography>
              </Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Desde"
                  value={fechaDesde}
                  onChange={(newValue) => setFechaDesde(newValue)}
                  slotProps={{
                    textField: {
                      size: "medium",
                      sx: {
                        bgcolor: "#ede9f6",
                        borderRadius: 8,
                        minWidth: 220,
                        border: "none",
                        '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Hasta"
                  value={fechaHasta}
                  onChange={(newValue) => setFechaHasta(newValue)}
                  slotProps={{
                    textField: {
                      size: "medium",
                      sx: {
                        bgcolor: "#ede9f6",
                        borderRadius: 8,
                        minWidth: 220,
                        border: "none",
                        '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Box>

            {/* Horas por día */}
            <Box sx={{ minWidth: 120 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    minWidth: 120,
                    bgcolor: "#f7f4fa",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    textAlign: "right",
                  }}
                >
                  <Typography sx={{ fontWeight: 500, color: "#444" }}>
                    Horas por día:
                  </Typography>
                </Box>
                <TextField
                  type="number"
                  defaultValue={2}
                  variant="outlined"
                  size="small"
                  sx={{
                    bgcolor: "#ede9f6",
                    borderRadius: 8,
                    width: 90,
                    ".MuiOutlinedInput-root": {
                      borderRadius: 8,
                      height: 40,
                      fontSize: 18,
                      color: "#3c3842",
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Resultados de ejemplo */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button variant="contained" color="primary" startIcon={<SearchIcon />}>
                BUSCAR
              </Button>
            </Box>
            <Box sx={{ mt: 2 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #aaa", padding: 4 }}>Nombre</th>
                    <th style={{ border: "1px solid #aaa", padding: 4 }}>Especialidad</th>
                    <th style={{ border: "1px solid #aaa", padding: 4 }}>Nivel</th>
                    <th style={{ border: "1px solid #aaa", padding: 4 }}>Departamento</th>
                    <th style={{ border: "1px solid #aaa", padding: 4, textAlign: "center" }}>Seleccionar</th>
                  </tr>
                </thead>
                <tbody>
                  {modalRows.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ border: "1px solid #aaa", padding: 4 }}>{row.nombre}</td>
                      <td style={{ border: "1px solid #aaa", padding: 4 }}>{row.especialidad}</td>
                      <td style={{ border: "1px solid #aaa", padding: 4 }}>{row.nivel}</td>
                      <td style={{ border: "1px solid #aaa", padding: 4 }}>{row.departamento}</td>
                      <td style={{ border: "1px solid #aaa", padding: 4, textAlign: "center" }}>
                        <input type="checkbox" checked={!!selectedModalRows[idx]} onChange={() => handleSelectModalRow(idx)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleAgregarSeleccionados}>
                  Agregar
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
export default ProyeccionTable;