"use client";

import React, { useMemo, useState } from "react";
import {
    MaterialReactTable,
    type MRT_ColumnDef,
    type MRT_RowSelectionState,
} from "material-react-table";
import { Box, Typography } from "@mui/material";

// ---- Tipos ----
type TablaRow = {
    consultor: string;
    departamento: string;
    tipoEmpleado: string;
    esquema: string;
    tiempo: string;
    modulo: string;
    nivel: string;
    horas: string[]; // índice 0..14 (3 semanas * 5 días)
    fechaLibre: string;
};

// ---- Datos de cabeceras por semana ----
const semanas = [
    { nombre: "Semana 1", dias: ["Lunes 1", "Martes 2", "Miércoles 3", "Jueves 4", "Viernes 5"] },
    { nombre: "Semana 2", dias: ["Lunes 8", "Martes 9", "Miércoles 10", "Jueves 11", "Viernes 12"] },
    { nombre: "Semana 3", dias: ["Lunes 15", "Martes 16", "Miércoles 17", "Jueves 18", "Viernes 19"] },
];

// ---- Encabezado minimalista ----
function TitleOnlyHeader({ title }: { title: string }) {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", p: 0.5 }}>
            <Typography
                variant="body2"
                sx={{ fontWeight: 700, textAlign: "center", lineHeight: 1.1 }}
                title={title}
            >
                {title}
            </Typography>
        </Box>
    );
}

function TablaPage() {
    // ---- Datos vacíos ----
    const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
    const [tableData] = useState<TablaRow[]>([
        {
            consultor: "",
            departamento: "",
            tipoEmpleado: "",
            esquema: "",
            tiempo: "",
            modulo: "",
            nivel: "",
            horas: Array(15).fill(""), // todas vacías
            fechaLibre: "",
        },
    ]);

    // ---- Columnas (con grupos por semana) ----
    const columns = useMemo<MRT_ColumnDef<TablaRow>[]>(() => {
        const baseCols: MRT_ColumnDef<TablaRow>[] = [
            { accessorKey: "consultor", header: "Consultor", Header: () => <TitleOnlyHeader title="Consultor" /> },
            { accessorKey: "departamento", header: "Departamento", Header: () => <TitleOnlyHeader title="Departamento" /> },
            { accessorKey: "tipoEmpleado", header: "Tipo de empleado", Header: () => <TitleOnlyHeader title="Tipo de empleado" /> },
            { accessorKey: "esquema", header: "Esquema", Header: () => <TitleOnlyHeader title="Esquema" /> },
            { accessorKey: "tiempo", header: "Tiempo", Header: () => <TitleOnlyHeader title="Tiempo" /> },
            { accessorKey: "modulo", header: "Módulo", Header: () => <TitleOnlyHeader title="Módulo" /> },
            { accessorKey: "nivel", header: "Nivel", Header: () => <TitleOnlyHeader title="Nivel" /> },
        ];

        const semanaGroups: MRT_ColumnDef<TablaRow>[] = semanas.map((semana, sIdx) => ({
            header: semana.nombre,
            columns: semana.dias.map((dia, dIdx) => {
                const idx = sIdx * 5 + dIdx;
                return {
                    id: `horas_${idx}`,
                    header: dia,
                    accessorFn: (row) => row.horas?.[idx] ?? "",
                    Header: () => <TitleOnlyHeader title={dia} />,
                    Cell: ({ cell }) => (
                        <Box
                            sx={{
                                bgcolor: "#fff",
                                textAlign: "center",
                                borderRadius: 1,
                                py: 0.5,
                            }}
                        >
                            {cell.getValue<string>()}
                        </Box>
                    ),
                } as MRT_ColumnDef<TablaRow>;
            }),
        }));

        const tailCol: MRT_ColumnDef<TablaRow> = {
            accessorKey: "fechaLibre",
            header: "Próxima fecha libre",
            Header: () => <TitleOnlyHeader title="Próxima fecha libre" />,
        };

        return [...baseCols, ...semanaGroups, tailCol];
    }, []);

    return (
        <Box sx={{ p: 4, bgcolor: "#f7f8fa", minHeight: "100vh" }}>
            <Typography variant="h5" sx={{ mr: "auto", mb: 2 }}>
                Tabla Vacía
            </Typography>

            <MaterialReactTable
                columns={columns}
                data={tableData}
                enableSorting={false}
                enableColumnActions={false}
                enableFilters={false}
                enableRowSelection
                enableColumnResizing
                enableColumnOrdering
                enablePagination
                enableHiding={false}
                enableDensityToggle
                enableFullScreenToggle
                muiTableContainerProps={{
                    sx: { borderRadius: 3, boxShadow: "none", background: "#fff" },
                }}
                muiTableHeadCellProps={{
                    sx: { textAlign: "center", fontWeight: 500, fontSize: 14, py: 0.5 },
                }}
                muiTableBodyCellProps={{ sx: { textAlign: "center", fontSize: 15 } }}
                onRowSelectionChange={setRowSelection}
                state={{ rowSelection }}
                initialState={{
                    columnPinning: {
                        left: ["consultor", "departamento", "tipoEmpleado", "esquema", "tiempo", "modulo", "nivel"],
                    },
                }}

            />
        </Box>
    );
}

export default TablaPage;
