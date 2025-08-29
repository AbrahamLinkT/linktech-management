"use client";

import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from "material-react-table";
import { Box, Typography, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
  { nombre: "Semana 1", dias: ["Lunes 1", "Martes 2", "Miércoles 3", "Jueves 4", "Viernes 5"] },
  { nombre: "Semana 2", dias: ["Lunes 8", "Martes 9", "Miércoles 10", "Jueves 11", "Viernes 12"] },
  { nombre: "Semana 3", dias: ["Lunes 15", "Martes 16", "Miércoles 17", "Jueves 18", "Viernes 19"] },
];

// Encabezado minimalista: SOLO título arriba (sin opciones abajo)
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

function ProyeccionTablePage() {
  // ---- Datos de ejemplo ----
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [tableData] = useState<ProyeccionRow[]>([
    {
      consultor: "—",
      departamento: "—",
      tipoEmpleado: "—",
      esquema: "—",
      tiempo: "—",
      modulo: "—",
      nivel: "—",
      horas: ["8h", "8h", "8h", "", "", "", "", "", "", "", "", "", "", "", ""],
      fechaLibre: "10-09-25",
    },
    {
      consultor: "—",
      departamento: "—",
      tipoEmpleado: "—",
      esquema: "—",
      tiempo: "—",
      modulo: "—",
      nivel: "—",
      horas: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
      fechaLibre: "20-09-25",
    },
  ]);

  // ---- Columnas (con grupos por semana) ----
  const columns = useMemo<MRT_ColumnDef<ProyeccionRow>[]>(() => {
    const baseCols: MRT_ColumnDef<ProyeccionRow>[] = [
      {
        accessorKey: "consultor",
        header: "Consultor",
        size: 120,
        Header: () => <TitleOnlyHeader title="Consultor" />,
      },
      {
        accessorKey: "departamento",
        header: "Departamento",
        size: 120,
        Header: () => <TitleOnlyHeader title="Departamento" />,
      },
      {
        accessorKey: "tipoEmpleado",
        header: "Tipo de empleado",
        size: 140,
        Header: () => <TitleOnlyHeader title="Tipo de empleado" />,
      },
      {
        accessorKey: "esquema",
        header: "Esquema",
        size: 120,
        Header: () => <TitleOnlyHeader title="Esquema" />,
      },
      {
        accessorKey: "tiempo",
        header: "Tiempo",
        size: 120,
        Header: () => <TitleOnlyHeader title="Tiempo" />,
      },
      {
        accessorKey: "modulo",
        header: "Módulo",
        size: 120,
        Header: () => <TitleOnlyHeader title="Módulo" />,
      },
      {
        accessorKey: "nivel",
        header: "Nivel",
        size: 120,
        Header: () => <TitleOnlyHeader title="Nivel" />,
      },
    ];

    const semanaGroups: MRT_ColumnDef<ProyeccionRow>[] = semanas.map((semana, sIdx) => ({
      header: semana.nombre,
      columns: semana.dias.map((dia, dIdx) => {
        const idx = sIdx * 5 + dIdx;
        return {
          id: `horas_${idx}`,
          header: dia,
          size: 80,
          accessorFn: (row) => row.horas?.[idx] ?? "",
          muiTableHeadCellProps: {
            sx: {
              bgcolor: "#b6c6f7",
              color: "#222",
              fontWeight: 600,
              textAlign: "center",
            },
          },
          Header: () => <TitleOnlyHeader title={dia} />,
          Cell: ({ cell }) => {
            const value = cell.getValue<string>();
            return (
              <Box
                sx={{
                  bgcolor: value ? "#e3e8fd" : "#fff",
                  color: "#222",
                  fontWeight: 500,
                  textAlign: "center",
                  borderRadius: 1,
                  py: 0.5,
                }}
              >
                {value}
              </Box>
            );
          },
        } as MRT_ColumnDef<ProyeccionRow>;
      }),
    }));

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
      Header: () => <TitleOnlyHeader title="Próxima fecha libre" />,
      Cell: ({ cell }) => (
        <Box
          sx={{
            bgcolor: "#4afc7c",
            color: "#222",
            fontWeight: 700,
            textAlign: "center",
            borderRadius: 1,
            py: 0.5,
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
      <Typography variant="h5" sx={{ mr: "auto", mb: 2 }}>
        Proyección
      </Typography>

      <MaterialReactTable
        columns={columns}
        data={tableData}
        // Deshabilitamos completamente opciones de encabezado:
        enableSorting={false}
        enableColumnActions={false}
        enableFilters={false}
        // Mantén lo demás si te sirve
        enableRowSelection
        enableColumnResizing
        enableColumnOrdering
        enablePagination
        enableHiding={false} // sin menú, evitar acciones de ocultar
        enableDensityToggle
        enableFullScreenToggle
        muiTableContainerProps={{
          sx: { borderRadius: 3, boxShadow: "none", background: "#fff" },
        }}
        muiTableHeadCellProps={{
          sx: {
            textAlign: "center",
            fontWeight: 500,
            fontSize: 14,
            py: 0.5,
          },
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
        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
              onClick={() => {
                /* tu lógica */
              }}
            >
              Cambiar vista
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
              onClick={() => {
                /* tu lógica */
              }}
            >
              Cambiar horas
            </Button>
          </Box>
        )}
      />
    </Box>
  );
}

export default ProyeccionTablePage;
