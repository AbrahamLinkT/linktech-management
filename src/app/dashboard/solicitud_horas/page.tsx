"use client";

import React, { useMemo, useState } from "react";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { Button } from "@mui/material";

interface Solicitud {
  id: string;
  consultor: string;
  departamento: string;
  modulo: string;
  proyecto: string;
  fechas: string;
  horas: string;
  solicitante: string;
}

export default function SolicitudHoras() {
  const columns = useMemo<MRT_ColumnDef<Solicitud>[]>(() => [
    { accessorKey: "consultor", header: "Consultor", size: 200 },
    { accessorKey: "departamento", header: "Departamento", size: 120 },
    { accessorKey: "modulo", header: "Módulo", size: 120 },
    { accessorKey: "proyecto", header: "Proyecto-OI", size: 150 },
    { accessorKey: "fechas", header: "Fechas", size: 200 },
    { accessorKey: "horas", header: "Horas por día", size: 150 },
    { accessorKey: "solicitante", header: "Solicitante", size: 180 },
  ], []);

  const initialData: Solicitud[] = [
    {
      id: "1",
      consultor: "Diego Carranza",
      departamento: "FI",
      modulo: "FI",
      proyecto: "",
      fechas: "20/08/25 - 15/10/25",
      horas: "8 horas",
      solicitante: "Mario Alvarez",
    },
    {
      id: "2",
      consultor: "Esteban Gutiérrez",
      departamento: "MM",
      modulo: "MM",
      proyecto: "",
      fechas: "20/08/25 - 10/09/25",
      horas: "8 horas",
      solicitante: "Luis Martinez",
    },
  ];

  // Estado para las filas
  const [rows, setRows] = useState<Solicitud[]>(initialData);
  // Estado para filas seleccionadas (ids)
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>({});

  const actions = { edit: false, add: false, export: false, delete: false };

  const handleRechazar = () => {
    const selectedIds = Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]);
    if (selectedIds.length === 0) {
      alert("No seleccionaste ninguna solicitud.");
      return;
    }
    setRows((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
    setSelectedRowIds({});
    alert("Se rechazaron las solicitudes seleccionadas.");
  };

  const handleAceptar = () => {
    const selectedIds = Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]);
    if (selectedIds.length === 0) {
      alert("No seleccionaste ninguna solicitud.");
      return;
    }
    setRows((prev) => prev.filter((row) => !selectedIds.includes(row.id)));
    setSelectedRowIds({});
    alert("Se aceptaron las solicitudes seleccionadas.");
  };

  return (
    <ContentBody title="Solicitud de horas pendientes">
    <DataTable<Solicitud>
      data={rows}
      columns={columns}
      menu={false}
      actions={actions}
      rowSelection={selectedRowIds}
      onRowSelectionChange={setSelectedRowIds}
    />

      {/* Botones debajo de la tabla */}
      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outlined"
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
        >
          Cerrar
        </Button>
        <div className="flex gap-4">
          <Button
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
            onClick={handleRechazar}
          >
            Rechazar
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
            onClick={handleAceptar}
          >
            Aceptar
          </Button>
        </div>
      </div>
    </ContentBody>
  );
}
