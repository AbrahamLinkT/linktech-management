"use client";

import { useMemo } from "react";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { useDepartments, type DepartmentItem } from "@/hooks/useDepartments";

export default function DepartmentPage() {
  const { data, loading, error } = useDepartments();

  const columns = useMemo<MRT_ColumnDef<DepartmentItem>[]>(
    () => [
      { accessorKey: "departamento", header: "Departamento" },
      { accessorKey: "nombreCorto", header: "Nombre Corto" },
      { accessorKey: "descripcion", header: "Descripción", size: 200 },
    ],
    []
  );

  const actions = { edit: true, add: true, export: true, delete: true };

  return (
    <ContentBody title="Departamentos">
      {loading && <p>Cargando departamentos...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <DataTable<DepartmentItem>
          data={data}
          edit={true}
          columns={columns}
          menu={true}
          urlRouteEdit="/dashboard/departamento/edit?id="
          urlRouteAdd="/dashboard/departamento/new"
          actions={actions}
        />
      )}
    </ContentBody>
  );
}
