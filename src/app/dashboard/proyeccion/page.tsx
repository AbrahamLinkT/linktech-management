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
        <Box sx={{ display: "flex", gap: "16px", padding: "8px", flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<DehazeIcon />}
            onClick={handleMenuOpen}
          >
            Selecciona
          </Button>
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
            {/* EDITAR */}
            {actions.edit && (
              <MenuItem
                disabled={selectedCount !== 1}
                onClick={() => {
                  if (selectedCount === 1) {
                    setEditRow(selectedRows[0].original);
                  }
                  handleMenuClose();
                }}
              >
                Editar
              </MenuItem>
            )}

            {/* AGREGAR */}
            {actions.add && (
              <MenuItem
                onClick={() => {
                  setAddModalOpen(true);
                  handleMenuClose();
                }}
              >
                Agregar
              </MenuItem>
            )}

            {/* ARCHIVAR */}
            {actions.archive && (
              <MenuItem
                onClick={() => {
                  console.log("Archivar:", selectedRows.map((r) => r.original));
                  handleMenuClose();
                }}
              >
                Archivar
              </MenuItem>
            )}

            {/* ELIMINAR */}
            {actions.delete && (
              <MenuItem
                disabled={selectedCount === 0}
                onClick={() => {
                  if (selectedCount > 0) {
                    const idsToDelete = new Set(selectedRows.map((r) => r.id));
                    setRows((prev) =>
                      prev.filter((row) => !idsToDelete.has(row.id))
                    );
                  }
                  handleMenuClose();
                }}
              >
                Eliminar
              </MenuItem>
            )}

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
                  Exportar Seleccionados
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      );
    },

    // CLICK EN FILA
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        if (urlRoute) {
          setRouteModal(true);
          setId(row.original.id);
        }
      },
      sx: { cursor: "pointer" },
    }),
  });

  return (
    <>
      <MaterialReactTable table={table} />

      {/* MODAL DE EDICIÓN */}
      <ModalEdit
        open={!!editRow}
        rowData={editRow}
        onClose={() => setEditRow(null)}
        onSave={(updated) => {
          setRows((prev) =>
            prev.map((row) => (row.id === updated.id ? updated : row))
          );
        }}
      />

      {/* MODAL DE AGREGAR */}
      <ModalGen
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={() => setAddModalOpen(false)}
        title={title_add}
      >
        {ModalAdd}
      </ModalGen>

      {/* MODAL DE REDIRECCIONAMIENTO */}
      <ModalRoute
        open={routeModal}
        onclose={() => {
          setRouteModal(!routeModal);
          setId(null);
        }}
        onRoute={() => handleConfirmRoute()}
        title="Redireccionamiento"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <h3>¿Estás seguro?</h3>
          <p className="text-sm font-bold text-gray-500">
            Estás a punto de salir de la vista
          </p>
        </div>
      </ModalRoute>
    </>
  );
}
