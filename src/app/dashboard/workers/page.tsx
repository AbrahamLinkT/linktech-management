"use client";

import { ContentBody } from "@/components/containers/containers";
import { useMemo } from "react";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { useWorkers } from "@/hooks/useWorkers";

interface StaffItem {
  id: string;
  consultor: string;
  especialidad: string;
  nivel: string;
  departamento: string;
  esquema: string;
  estatus: string;
}

export default function Workers() {
  const { data: workers, loading } = useWorkers();

  const data: StaffItem[] = workers.map((w: any) => ({
    id: String(w.id),
    consultor: w.name,
    especialidad: w.roleName || "-",
    nivel: w.levelName || "-",
    departamento: w.roleId || "-",
    esquema: w.schemeName || "-",
    estatus: w.status ? "Activo" : "Inactivo",
  }));

  // Columnas del DataTable
  const columns = useMemo<MRT_ColumnDef<StaffItem>[]>(
    () => [
      { accessorKey: "consultor", header: "Nombre" },
      { accessorKey: "especialidad", header: "Especialidad" },
      { accessorKey: "nivel", header: "Nivel" },
      { accessorKey: "departamento", header: "Departamento" },
      { accessorKey: "esquema", header: "Esquema" },
      { accessorKey: "estatus", header: "Estatus" },
    ],
    []
  );

  if (loading) return <div>Cargando...</div>;

  return (
    <ContentBody title="Trabajadores">
      <DataTable
        data={data}
        columns={columns}
        menu={true}
        actions={{ edit: true, add: true }}
        urlRoute="/dashboard/workers/show?id="
        urlRouteAdd="/dashboard/workers/new"
        urlRouteEdit="/dashboard/workers/edit?id="
      />
    </ContentBody>
  );
}
