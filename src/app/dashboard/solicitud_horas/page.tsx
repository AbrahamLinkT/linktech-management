"use client";

import React, { useMemo } from "react";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { Btn_data } from "@/components/buttons/buttons";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation"; // Eliminado: no usado

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
  // Definir columnas
  const columns = useMemo<MRT_ColumnDef<Solicitud>[]>(
    () => [
      { accessorKey: "consultor", header: "Consultor", size: 200 },
      { accessorKey: "departamento", header: "Departamento", size: 120 },
      { accessorKey: "modulo", header: "Módulo", size: 120 },
      { accessorKey: "proyecto", header: "Proyecto-OI", size: 150 },
      { accessorKey: "fechas", header: "Fechas", size: 200 },
      { accessorKey: "horas", header: "Horas por día", size: 150 },
      { accessorKey: "solicitante", header: "Solicitante", size: 180 },
    ],
    []
  );

  // Datos estáticos (sin estado)
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

  const actions = { edit: false, add: false, export: false, delete: false, cancel: true, accept: true };
  const router = useRouter() // Eliminado: no usado
  const handleClickRoute = () => {
    router.push("/dashboard/proyeccion")
  }
  return (
    <ContentBody title="Solicitud de horas pendientes"
      btnReg={
        <Btn_data
          icon={<ArrowLeft />}
          text={"Regresar"}
          styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
          Onclick={handleClickRoute}
        />
      }>
      <DataTable<Solicitud>
        data={data}
        columns={columns}
        menu={true}
        actions={actions}
      />
    </ContentBody>
  );
}
