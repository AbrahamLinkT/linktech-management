// table_master.tsx
"use client";
import { useState } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_Row,
    type MRT_Cell,
    type MRT_Column,
    type MRT_TableInstance,
} from "material-react-table";
import { Box, Button, Menu, MenuItem, TextFieldProps } from "@mui/material";
import DehazeIcon from "@mui/icons-material/Dehaze";
import { mkConfig, generateCsv, download } from "export-to-csv";

// Configuración CSV
const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
});

type DataTableProps<T extends { id: string }> = {
    data: T[];
    columns: MRT_ColumnDef<T>[];
    onSave?: (rows: T[]) => void;
};

export function DataTable<T extends { id: string }>({
    data,
    columns,
    onSave,
}: DataTableProps<T>) {
    const [rows, setRows] = useState<T[]>(data);
    const [editedRows, setEditedRows] = useState<Record<string, T>>({});

    // Guardar cambios
    const handleSaveRows = () => {
        const updated = rows.map((r) => editedRows[r.id] || r);
        setRows(updated);
        setEditedRows({});
        onSave?.(updated);
    };

    // Export CSV
    const handleExportRows = (rowsToExport: MRT_Row<T>[]) => {
        const rowData = rowsToExport.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };

    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(rows);
        download(csvConfig)(csv);
    };

    // Menú
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    // Columnas editables (usando solo `row`, los demás se ignoran)
    const editableColumns = columns.map((col) => ({
        ...col,
        muiEditTextFieldProps: ({
            row, // solo usamos row
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cell, column, table, // los demás parámetros no usados
        }: {
            cell: MRT_Cell<T, unknown>;
            column: MRT_Column<T, unknown>;
            row: MRT_Row<T>;
            table: MRT_TableInstance<T>;
        }): TextFieldProps => {
            const key = col.accessorKey as keyof T;
            const value = row.original[key] as string;

            return {
                defaultValue: value,
                onChange: (e) => {
                    const newVal = e.target.value;
                    setEditedRows((prev) => ({
                        ...prev,
                        [row.original.id]: { ...row.original, [key]: newVal },
                    }));
                },
            };
        },
    }));

    const table = useMaterialReactTable({
        columns: editableColumns,
        data: rows,
        editDisplayMode: "cell",
        enableEditing: true,
        enableRowSelection: true,
        getRowId: (row) => row.id,
        initialState: { columnVisibility: { id: false } },
        renderTopToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: "flex", gap: "16px", padding: "8px", flexWrap: "wrap" }}>
                <Button variant="outlined" startIcon={<DehazeIcon />} onClick={handleMenuOpen}>
                    Selecciona
                </Button>
                <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
                    <MenuItem onClick={() => { handleExportData(); handleMenuClose(); }}>Exportar Todo</MenuItem>
                    <MenuItem onClick={() => { handleExportRows(table.getPrePaginationRowModel().rows); handleMenuClose(); }}>Exportar Todas Filas</MenuItem>
                    <MenuItem onClick={() => { handleExportRows(table.getRowModel().rows); handleMenuClose(); }}>Exportar Página Actual</MenuItem>
                    <MenuItem
                        disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                        onClick={() => { handleExportRows(table.getSelectedRowModel().rows); handleMenuClose(); }}
                    >
                        Exportar Seleccionados
                    </MenuItem>
                </Menu>
            </Box>
        ),
        renderBottomToolbarCustomActions: () => (
            <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <Button
                    color="success"
                    variant="contained"
                    onClick={handleSaveRows}
                    disabled={Object.keys(editedRows).length === 0} // activo al hacer cambios
                >
                    Guardar
                </Button>
            </Box>
        ),
    });

    return <MaterialReactTable table={table} />;
}
