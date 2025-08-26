"use client";

import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from "material-react-table";
import { Box, Typography, Button } from "@mui/material";

// ---- Tipos ----
type ProyeccionRow = {
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
  {
    nombre: "Semana 1",
    dias: ["Lunes 1", "Martes 2", "Miércoles 3", "Jueves 4", "Viernes 5"],
  },
  {
    nombre: "Semana 2",
    dias: ["Lunes 8", "Martes 9", "Miércoles 10", "Jueves 11", "Viernes 12"],
  },
  {
    nombre: "Semana 3",
    dias: ["Lunes 15", "Martes 16", "Miércoles 17", "Jueves 18", "Viernes 19"],
  },
];

function ProyeccionTablePage() {
  // ---- Datos de ejemplo ----
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [tableData] = useState<ProyeccionRow[]>([
    {
      consultor: "",
      departamento: "",
      tipoEmpleado: "",
      esquema: "",
      tiempo: "",
      modulo: "",
      nivel: "",
      horas: ["8h", "8h", "8h", "", "", "", "", "", "", "", "", "", "", "", ""],
      fechaLibre: "10-09-25",
    },
    {
      consultor: "",
      departamento: "",
      tipoEmpleado: "",
      esquema: "",
      tiempo: "",
      modulo: "",
      nivel: "",
      horas: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      fechaLibre: "20-09-25",
    },
  ]);

  // ---- Columnas (con grupos por semana) ----
  const columns = useMemo<MRT_ColumnDef<ProyeccionRow>[]>(() => {
    const baseCols: MRT_ColumnDef<ProyeccionRow>[] = [
      { accessorKey: "consultor", header: "Consultor", size: 120 },
      { accessorKey: "departamento", header: "Departamento", size: 120 },
      { accessorKey: "tipoEmpleado", header: "Tipo de empleado", size: 140 },
      { accessorKey: "esquema", header: "Esquema", size: 120 },
      { accessorKey: "tiempo", header: "Tiempo", size: 120 },
      { accessorKey: "modulo", header: "Módulo", size: 120 },
      { accessorKey: "nivel", header: "Nivel", size: 120 },
    ];

    const semanaGroups: MRT_ColumnDef<ProyeccionRow>[] = semanas.map(
      (semana, sIdx) => ({
        header: semana.nombre,
        columns: semana.dias.map((dia, dIdx) => {
          const idx = sIdx * 5 + dIdx;
          return {
            id: `horas-${idx}`,
            header: dia,
            accessorFn: (row) => row.horas[idx] ?? "",
            size: 80,
            muiTableHeadCellProps: {
              sx: {
                bgcolor: "#b6c6f7",
                color: "#222",
                fontWeight: 500,
                textAlign: "center",
              },
            },
            Cell: ({ row }) => {
              const value = row.original.horas[idx] ?? "";
              return (
                <Box
                  sx={{
                    bgcolor: value ? "#e3e8fd" : "#fff",
                    color: "#222",
                    fontWeight: 500,
                    textAlign: "center",
                    borderRadius: 1,
                  }}
                >
                  {value}
                </Box>
              );
            },
          } as MRT_ColumnDef<ProyeccionRow>;
        }),
      })
    );

    const tailCol: MRT_ColumnDef<ProyeccionRow> = {
      accessorKey: "fechaLibre",
      header: "Próxima fecha libre",
      size: 160,
      muiTableHeadCellProps: {
        sx: {
          bgcolor: "#4afc7c",
          color: "#222",
          fontWeight: 700,
          textAlign: "center",
        },
      },
      Cell: ({ cell }) => (
        <Box
          sx={{
            bgcolor: "#4afc7c",
            color: "#222",
            fontWeight: 700,
            textAlign: "center",
            borderRadius: 1,
          }}
        >
          {cell.getValue<string>()}
        </Box>
      ),
    };

    return [...baseCols, ...semanaGroups, tailCol];
  }, []);

  return (
    <Box sx={{ p: 4, bgcolor: "#f7f8fa", minHeight: "100vh" }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Proyección
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#444",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Seleccionar horas
        </Button>
        <Button
          variant="contained"
          sx={{
            bgcolor: "#444",
            color: "#fff",
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Seleccionar horas
        </Button>
      </Box>

      <MaterialReactTable
        columns={columns}
        data={tableData}
        enableRowSelection
        enableColumnResizing
        enableColumnOrdering={false}
        enablePagination={false}
        enableFilters={false}
        enableHiding={false}
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enableColumnActions={false}
        muiTableContainerProps={{
          sx: { borderRadius: 3, boxShadow: "none", background: "#fff" },
        }}
        muiTableHeadCellProps={{
          sx: { textAlign: "center", fontWeight: 500, fontSize: 14 },
        }}
        muiTableBodyCellProps={{ sx: { textAlign: "center", fontSize: 15 } }}
        onRowSelectionChange={setRowSelection}
        state={{ rowSelection }}
        initialState={{
          columnPinning: {
            left: [
              "consultor",
              "departamento",
              "tipoEmpleado",
              "esquema",
              "tiempo",
              "modulo",
              "nivel",
            ],
          },
        }}
      />
    </Box>
  );
}

export default ProyeccionTablePage;
