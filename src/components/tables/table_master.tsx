"use client";
import React, { useState } from "react";
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

type ActionsConfig = {
    edit?: boolean;
    editRow?: boolean;
    add?: boolean;
    export?: boolean;
    delete?: boolean;
    archive?: boolean;
};
const csvConfig = mkConfig({
    fieldSeparator: ",",
    decimalSeparator: ".",
    useKeysAsHeaders: true,
});

type DataTableProps<T extends { id: string }> = {
    data: T[];
    columns: MRT_ColumnDef<T>[];
    title_add?: string
    ModalAdd?: React.ReactNode;
    edit?: React.ReactNode;
    urlRouteAdd?: string
    urlRoute?: string
    urlRouteEdit?: string
    urlReturn?: string
    actions?: ActionsConfig;
    menu?: boolean
    rowSelection?: Record<string, boolean>;
    onRowSelectionChange?: (updater: any) => void;

};

export function DataTable<T extends { id: string }>({
    data,
    columns,
    title_add,
    ModalAdd,
    edit,
    urlRoute,
    urlRouteAdd,
    urlRouteEdit,
    menu,
    actions = {},
    rowSelection,
    onRowSelectionChange,

}: DataTableProps<T>) {
    // =============== ESTADOS ================
    const [rows, setRows] = useState<T[]>(data);
    const [editRow, setEditRow] = useState<T | null>(null);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [routeModal, setRouteModal] = useState(false)
    const [id, setId] = useState<string | null>(null)
    const [internalRowSelection, setInternalRowSelection] = useState<Record<string, boolean>>({});

    // ========= EXPORT =========
    const handleExportRows = (rows: MRT_Row<T>[]) => {
        const rowData = rows.map((row) => row.original);
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    };
    const handleExportData = () => {
        const csv = generateCsv(csvConfig)(rows);
        download(csvConfig)(csv);
    };
    // ========= ROUTING =========
    const router = useRouter()
    const handleConfirmRoute = () => {
        router.push(`${urlRoute}${id}`)
    }
    // ========= MENU STATE =========
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);
    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => setAnchorEl(null);
    // ========= TABLA Y MENU =========
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
        state: {
            rowSelection: rowSelection ?? internalRowSelection,
        },
        onRowSelectionChange: (updater) => {
        if (rowSelection) {
            onRowSelectionChange?.(updater); 
        } else {
            setInternalRowSelection(updater);
        }
        },
        renderTopToolbarCustomActions: ({ table }) => {
            const selectedRows = table?.getSelectedRowModel?.()?.rows ?? [];
            const selectedCount = selectedRows.length; 
            return menu && (
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
                        {actions?.edit && (
                            <MenuItem
                                disabled={selectedCount !== 1}
                                onClick={() => {
                                    if (selectedCount === 1) {
                                        const selected = selectedRows[0].original;
                                        if (urlRouteEdit) {
                                            router.push(`${urlRouteEdit}${selected.id}`);
                                        } else if (edit) {
                                            setEditRow(selected);
                                            handleMenuClose();
                                        }
                                    }
                                }}
                            >
                                Editar
                            </MenuItem>
                        )}

                        {/* AGREGAR */}
                        {actions?.add && (
                            <MenuItem
                                onClick={() => {
                                    if (urlRouteAdd) {

                                        router.push(`${urlRouteAdd}`)
                                    } else if (ModalAdd && title_add) {
                                        setAddModalOpen(true);
                                        handleMenuClose();
                                    }
                                }}
                            >
                                Agregar
                            </MenuItem>
                        )}

                        {/* ARCHIVAR */}
                        {actions?.archive && (
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
                        {actions?.delete && (
                            <MenuItem
                                disabled={selectedCount === 0}
                                onClick={() => {
                                    if (selectedCount > 0) {
                                        const idsToDelete = new Set(selectedRows.map((r) => r.id));
                                        setRows((prev) => prev.filter((row) => !idsToDelete.has(row.id)));
                                        rowSelection
                                            ? onRowSelectionChange?.({})
                                            : setInternalRowSelection({});
                                        handleMenuClose();
                                    }
                                }}
                            >
                                Eliminar
                            </MenuItem>
                        )}

                        {/* EXPORTACIONES */}
                        {actions?.export && [
                            <MenuItem
                                key="export-all"
                                onClick={() => {
                                    handleExportData();
                                    handleMenuClose();
                                }}
                            >
                                Exportar Todo
                            </MenuItem>,

                            <MenuItem
                                key="export-page"
                                onClick={() => {
                                    handleExportRows(table.getRowModel().rows);
                                    handleMenuClose();
                                }}
                            >
                                Exportar Página Actual
                            </MenuItem>,

                            <MenuItem
                                disabled={selectedCount === 0}
                                onClick={() => {
                                    handleExportRows(selectedRows);
                                    handleMenuClose();
                                }}
                            >
                                Exportar Seleccionados
                            </MenuItem>
                        ]}

                    </Menu>

                </Box>
            );
        },

        // CLICK EN FILA
        muiTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                //console.log(JSON.stringify(row.original, null, 2))
                if (urlRoute) {
                    setRouteModal(true)
                    setId(row.original.id)
                } else if (actions?.editRow) {
                    setEditRow(row.original);
                }

            },
            sx: { cursor: "pointer" },
        }),
    });

    // =============== RENDERIZADO DE MODALES Y TABLA ===============
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
                    setRouteModal(!routeModal)
                    setId(null)
                }}
                onRoute={() => { handleConfirmRoute() }}
                title="Redireccionamiento"
            >
                <>
                    <div className="flex flex-col items-center justify-center text-center">
                        <h3>Estas seguro ?</h3>
                        <div>
                            <p className="text-sm font-bold text-gray-500">Estas apunto de salir de la vista</p>
                        </div>
                    </div>
                </>
            </ModalRoute>
        </>
    );
}
