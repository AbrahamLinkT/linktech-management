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
import { ModalEdit, ModalGen } from "@/components/modal/modal_master";

const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
});

type DataTableProps<T extends { id: string }> = {
    data: T[];
    columns: MRT_ColumnDef<T>[];
    ModalAdd: React.ComponentType; // espera un componente, no JSX
};

export function DataTable<T extends { id: string }>({
    data,
    columns,
    ModalAdd
}: DataTableProps<T>) {
    const [rows, setRows] = useState<T[]>(data);
    const [editRow, setEditRow] = useState<T | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);


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
                <Box
                    sx={{
                        display: "flex",
                        gap: "16px",
                        padding: "8px",
                        flexWrap: "wrap",
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<DehazeIcon />}
                        onClick={handleMenuOpen}
                    >
                        Selecciona
                    </Button>
                    <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
                        {/* EDITAR */}
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

                        {/* AGREGAR */}
                        <MenuItem
                            onClick={() => {
                                setAddModalOpen(true);
                                handleMenuClose();
                            }}
                        >
                            Agregar
                        </MenuItem>

                        {/* ARCHIVAR */}
                        <MenuItem
                            onClick={() => {
                                console.log(
                                    "Archivar (pendiente):",
                                    selectedRows.map((r) => r.original)
                                );
                                handleMenuClose();
                            }}
                        >
                            Archivar
                        </MenuItem>

                        {/* ELIMINAR */}
                        <MenuItem
                            disabled={selectedCount === 0}
                            onClick={() => {
                                if (selectedCount > 0) {
                                    const idsToDelete = new Set(
                                        selectedRows.map((r) => r.id)
                                    );
                                    setRows((prev) =>
                                        prev.filter((row) => !idsToDelete.has(row.id))
                                    );
                                }
                                handleMenuClose();
                            }}
                        >
                            Eliminar
                        </MenuItem>

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
                    </Menu>
                </Box>
            );
        },

        // CLICK EN FILA
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => alert(JSON.stringify(row.original, null, 2)),
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
            {/* MODAL DE AGREGAR */}
            <ModalGen
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onSave={() => setAddModalOpen(false)} // solo cierra el modal
                title="Agregar Cliente"
            >
                < ModalAdd />
            </ModalGen>


        </>
    );
}
