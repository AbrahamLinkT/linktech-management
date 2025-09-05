"use client";

import React, { useMemo } from "react";
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

  const data: Solicitud[] = [
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

  const actions = { edit: false, add: false, export: false, delete: false };

  const handleRechazar = () => {
    alert("Se rechazaron las solicitudes seleccionadas.");
  };

  const handleAceptar = () => {
    alert("Se aceptaron las solicitudes seleccionadas.");
  };

  return (
    <ContentBody title="Solicitud de horas pendientes">
      <DataTable<Solicitud>
        data={data}
        columns={columns}
        menu={false}
        actions={actions}
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
