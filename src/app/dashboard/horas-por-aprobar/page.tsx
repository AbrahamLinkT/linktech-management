"use client";

import React, { useMemo } from "react";
import { ContentBody } from "@/components/containers/containers";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { Btn_data } from "@/components/buttons/buttons";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function HorasPorAprobar() {
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

  // Datos estáticos (puedes reemplazar por fetch a futuro)
  const data: Solicitud[] = [
    {
      id: "1",
      consultor: "Diego Carranza",
      departamento: "FI",
      modulo: "FI",
      proyecto: "Proyecto A",
      fechas: "20/08/25 - 15/10/25",
      horas: "8 horas",
      solicitante: "Mario Alvarez",
    },
    {
      id: "2",
      consultor: "Esteban Gutiérrez",
      departamento: "MM",
      modulo: "MM",
      proyecto: "Proyecto B",
      fechas: "20/08/25 - 10/09/25",
      horas: "8 horas",
      solicitante: "Luis Martinez",
    },
    {
      id: "3",
      consultor: "Ana Torres",
      departamento: "FI",
      modulo: "FI",
      proyecto: "Proyecto A",
      fechas: "01/09/25 - 20/09/25",
      horas: "6 horas",
      solicitante: "Mario Alvarez",
    },
  ];

  // Agrupar por proyecto
  const proyectos = Array.from(new Set(data.map(d => d.proyecto)));

  const actions = { edit: false, add: false, export: false, delete: false, cancel: true, accept: true };
  const router = useRouter();
  const handleClickRoute = () => {
    router.push("/dashboard/proyeccion");
  };
  return (
    <ProtectedRoute requiredPermission="horasPorAprobar">
      <ContentBody title="Horas por aprobar"
      btnReg={
        <Btn_data
          icon={<ArrowLeft />}
          text={"Regresar"}
          styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
          Onclick={handleClickRoute}
        />
      }>
      {proyectos.map((proy) => (
        <div key={proy} style={{ marginBottom: 32 }}>
          <h2 style={{ fontWeight: 700, fontSize: 20, margin: '24px 0 12px 0', color: '#2563eb' }}>{proy}</h2>
          <DataTable<Solicitud>
            data={data.filter(d => d.proyecto === proy)}
            columns={columns}
            menu={true}
            actions={actions}
          />
        </div>
      ))}
      </ContentBody>
    </ProtectedRoute>
  );
}
