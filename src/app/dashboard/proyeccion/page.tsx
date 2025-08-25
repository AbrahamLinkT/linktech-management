"use client";
import { useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import { Box, Button, Menu, MenuItem } from "@mui/material";
import DehazeIcon from "@mui/icons-material/Dehaze";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { ModalEdit, ModalGen, ModalRoute } from "@/components/modal/modal_master";
import { useRouter } from "next/navigation";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

type DataTableProps<T extends { id: string }> = {
  data: T[];
  columns: MRT_ColumnDef<T>[];
  ModalAdd?: React.ReactNode;
  title_add?: string;
  urlRoute?: string;
  actions?: {
    edit?: boolean;
    add?: boolean;
    archive?: boolean;
    delete?: boolean;
    export?: boolean;
  };
};

export function DataTable<T extends { id: string }>({
  data,
  columns,
  ModalAdd,
  title_add,
  urlRoute,
  actions = {
    edit: true,
    add: true,
    archive: true,
    delete: true,
    export: true,
  },
}: DataTableProps<T>) {
  const [rows, setRows] = useState<T[]>(data);
  const [editRow, setEditRow] = useState<T | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [routeModal, setRouteModal] = useState(false);
  const [id, setId] = useState<string | null>(null);

  // ==== EXPORT ====
  const handleExportRows = (rows: MRT_Row<T>[]) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(rows);
    download(csvConfig)(csv);
  };

  const router = useRouter();
  const handleConfirmRoute = () => {
    if (urlRoute && id) router.push(`${urlRoute}${id}`);
  };

  // ==== MENU STATE ====
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  const table = useMaterialReactTable({
    columns,
    data: rows,
    enableRowSelection: true,
    enableColumnDragging: true,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getRowId: (row) => row.id,
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
    renderTopToolbarCustomActions: ({ table }) => {
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
          <Typography variant="body1" sx={{ minWidth: 240 }}>
            <strong>Proyecto:</strong>{" "}
            {selectedIO ? selectedProyecto || "—" : "Selecciona una OI"}
          </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500, ml: 2 }}
                onClick={() => window.location.href = '/dashboard/proyeccion/date'}
              >
                Ver proyección
              </Button>
            </Box>
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

            {/* EXPORTACIONES */}
            {actions.export && (
              <>
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
                  Exportar Todas Filas
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
                {/* Apartado de próxima fecha libre */}
                <Box sx={{ minWidth: 180, bgcolor: '#f7f4fa', px: 2, py: 1, borderRadius: 2, ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 500, color: '#444', mr: 1 }}>
                    Próxima fecha libre:
                  </Typography>
                  <Typography sx={{ color: '#3c3842', fontWeight: 400 }}>
                    25/08/2025
                  </Typography>
                </Box>
                {/* Botón para ver proyección */}
                <Box sx={{ ml: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 500 }}
                    onClick={() => window.location.href = '/dashboard/proyeccion/date'}
                  >
                    Ver proyección
                  </Button>
                </Box>
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
}
