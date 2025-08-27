"use client";

import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DehazeIcon from "@mui/icons-material/Dehaze";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { useRouter } from "next/navigation";

// =================== CSV CONFIG ===================
const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

// =================== TIPOS ===================
type RowData = {
  id: string;
  consultor: string;
  departamento: string;
  tipoEmpleado: string;
  esquema: string;
  tiempo: string;
  modulo: string;
  nivel: string;
  ubicacion: string;
};

// =================== MOCK DATA ===================
const initialData: RowData[] = [
  {
    id: "1",
    consultor: "Ana López",
    departamento: "SAP FI",
    tipoEmpleado: "Interno",
    esquema: "Full-time",
    tiempo: "40",
    modulo: "FI",
    nivel: "Sr",
    ubicacion: "Monterrey",
  },
  {
    id: "2",
    consultor: "Luis Pérez",
    departamento: "SAP MM",
    tipoEmpleado: "Externo",
    esquema: "Part-time",
    tiempo: "20",
    modulo: "MM",
    nivel: "Jr",
    ubicacion: "CDMX",
  },
];

// OIs y proyectos (ejemplo)
const OI_OPTIONS = ["OI-001", "OI-002", "OI-003"];
const PROYECTO_BY_OI: Record<string, string> = {
  "OI-001": "Implementación SAP FI – ACME",
  "OI-002": "Optimización MM – RetailMX",
  "OI-003": "Proyecto HCM – UANL",
};

// =================== COMPONENTE ===================
export default function ProyeccionPage() {
  const router = useRouter();

  // -------- Estado tabla principal --------
  const [tableData, setTableData] = useState<RowData[]>(initialData);

  const columns = useMemo<MRT_ColumnDef<RowData>[]>(
    () => [
      { accessorKey: "consultor", header: "Consultor" },
      { accessorKey: "departamento", header: "Departamento" },
      { accessorKey: "tipoEmpleado", header: "Tipo Empleado" },
      { accessorKey: "esquema", header: "Esquema" },
      { accessorKey: "tiempo", header: "Horas/Sem" },
      { accessorKey: "modulo", header: "Módulo" },
      { accessorKey: "nivel", header: "Nivel" },
      { accessorKey: "ubicacion", header: "Ubicación" },
    ],
    []
  );

  // -------- Toolbar: OI/Proyecto y botones --------
  const [selectedIO, setSelectedIO] = useState<string>("");
  const uniqueIOs = OI_OPTIONS;
  const selectedProyecto = selectedIO ? PROYECTO_BY_OI[selectedIO] ?? "" : "";

  // Simulación acción "Agregar consultor"
  const handleAgregar = () => setOpenAddModal(true);

  // -------- EXPORTACIONES --------
  const handleExportRows = (rows: MRT_Row<RowData>[]) => {
    const rowData = rows.map((r) => r.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };
  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(tableData);
    download(csvConfig)(csv);
  };

  // -------- Menu acciones (ícono hamburguesa) --------
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuOpen = (e: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // -------- Modal Agregar consultor --------
  const [openAddModal, setOpenAddModal] = useState(false);

  // Resultados fake del buscador del modal
  type ModalRow = {
    nombre: string;
    especialidad: string;
    nivel: string;
    departamento: string;
  };
  const [modalRows] = useState<ModalRow[]>([
    {
      nombre: "María Gómez",
      especialidad: "SAP FI",
      nivel: "Sr",
      departamento: "Finanzas",
    },
    {
      nombre: "Carlos Ruiz",
      especialidad: "SAP MM",
      nivel: "Mid",
      departamento: "Abastecimiento",
    },
  ]);
  const [selectedModalRows, setSelectedModalRows] = useState<
    Record<number, boolean>
  >({});

  const handleSelectModalRow = (idx: number) => {
    setSelectedModalRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleAgregarSeleccionados = () => {
    const nuevos = Object.entries(selectedModalRows)
      .filter(([, v]) => v)
      .map(([idx]) => {
        const r = modalRows[Number(idx)];
        return {
          id: String(Date.now() + Math.random()),
          consultor: r.nombre,
          departamento: r.departamento,
          tipoEmpleado: "Externo",
          esquema: "Full-time",
          tiempo: "40",
          modulo: r.especialidad.includes("FI") ? "FI" : "MM",
          nivel: r.nivel,
          ubicacion: "Remoto",
        } as RowData;
      });

    setTableData((prev) => [...prev, ...nuevos]);
    setOpenAddModal(false);
    setSelectedModalRows({});
  };

  // -------- Material React Table --------
  const table = useMaterialReactTable({
    columns,
    data: tableData,
    getRowId: (row) => row.id,
    enableRowSelection: true,
    enableColumnDragging: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    enablePagination: true,
    initialState: {
      pagination: { pageIndex: 0, pageSize: 5 },
    },
    muiTablePaperProps: {
      sx: {
        border: "none",
        boxShadow: "none",
        backgroundColor: "transparent",
      },
    },
  });

  const selectedRows = table.getSelectedRowModel().rows;
  const selectedCount = selectedRows.length;

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

          <Typography variant="body1" sx={{ minWidth: 280 }}>
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

          <Button
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
            }}
            onClick={() => router.push("/dashboard/proyeccion/date")}
          >
            Ver proyección
          </Button>

          {/* Menú de acciones (export, etc.) */}
          <IconButton onClick={handleMenuOpen}>
            <DehazeIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
            {/* EXPORTACIONES */}
            <MenuItem
              onClick={() => {
                handleExportData();
                handleMenuClose();
              }}
            >
              Exportar Todo
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleExportRows(table.getPrePaginationRowModel().rows);
                handleMenuClose();
              }}
            >
              Exportar Todas las Filas
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleExportRows(table.getRowModel().rows);
                handleMenuClose();
              }}
            >
              Exportar Página Actual
            </MenuItem>
            <MenuItem
              disabled={selectedCount === 0}
              onClick={() => {
                handleExportRows(selectedRows);
                handleMenuClose();
              }}
            >
              Exportar Seleccionadas ({selectedCount})
            </MenuItem>
          </Menu>
        </Stack>
      </Box>

      {/* Tabla principal */}
      <MaterialReactTable table={table} />

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
                    borderRadius: 2,
                    ".MuiOutlinedInput-root": {
                      borderRadius: 2,
                      height: 48,
                      fontSize: 16,
                      color: "#3c3842",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <Box sx={{ pr: 1 }}>
                        <IconButton edge="end" sx={{ color: "#3c3842" }}>
                          <SearchIcon />
                        </IconButton>
                      </Box>
                    ),
                  }}
                />
              </Box>
            ))}

            {/* Resultados de ejemplo */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
              >
                BUSCAR
              </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "#fff",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ border: "1px solid #aaa", padding: 4 }}>
                      Nombre
                    </th>
                    <th style={{ border: "1px solid #aaa", padding: 4 }}>
                      Especialidad
                    </th>
                    <th style={{ border: "1px solid #aaa", padding: 4 }}>
                      Nivel
                    </th>
                    <th style={{ border: "1px solid #aaa", padding: 4 }}>
                      Departamento
                    </th>
                    <th
                      style={{
                        border: "1px solid #aaa",
                        padding: 4,
                        textAlign: "center",
                      }}
                    >
                      Seleccionar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {modalRows.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ border: "1px solid #aaa", padding: 4 }}>
                        {row.nombre}
                      </td>
                      <td style={{ border: "1px solid #aaa", padding: 4 }}>
                        {row.especialidad}
                      </td>
                      <td style={{ border: "1px solid #aaa", padding: 4 }}>
                        {row.nivel}
                      </td>
                      <td style={{ border: "1px solid #aaa", padding: 4 }}>
                        {row.departamento}
                      </td>
                      <td
                        style={{
                          border: "1px solid #aaa",
                          padding: 4,
                          textAlign: "center",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!selectedModalRows[idx]}
                          onChange={() => handleSelectModalRow(idx)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAgregarSeleccionados}
                >
                  Agregar
                </Button>
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
