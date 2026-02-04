"use client";

import { useMemo, useState } from "react";
import { ContentBody } from "@/components/containers/containers";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { useDepartments, type DepartmentItem } from "@/hooks/useDepartments";
import ConfirmModal from "@/components/ConfirmModal";

export default function DepartmentPage() {
  const { data, loading, error, deleteDepartments } = useDepartments();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [idsToDelete, setIdsToDelete] = useState<string[] | null>(null);

  // ==== Convertir id:number → string =====
  const tableData = useMemo(() => {
    if (!data) return [];
    return data.map((d) => ({
      ...d,
      id: d.id.toString(),
    }));
  }, [data]);

  const columns = useMemo<MRT_ColumnDef<DepartmentItem>[]>(() => [
    { accessorKey: "departamento", header: "Departamento" },
    { accessorKey: "nombreCorto", header: "Nombre Corto" },
    { accessorKey: "descripcion", header: "Descripción", size: 200 },
    {
      accessorKey: "parent_id",
      header: "Departamento Padre",
      size: 150,
      Cell: ({ cell }) => {
        const val = cell.getValue() as string | null | undefined;
        if (!val) return "-";
        const parent = data.find((d) => d.id === val);
        return (parent ? parent.departamento : "-") as React.ReactNode;
      },
    },
    {
      accessorKey: "active",
      header: "Activo",
      size: 80,
      Cell: ({ cell }) => {
        const val = cell.getValue() as boolean | undefined;
        return (val ? "Sí" : "No") as React.ReactNode;
      },
    },
  ], [data]);

  const actions = { edit: true, add: true, export: true, delete: true };

  return (
    <ProtectedRoute requiredPermission="departamentos">
      <ContentBody title="Departamentos">
        {loading && <p>Cargando departamentos...</p>}
        {error && <p>Error: {error}</p>}

        <ConfirmModal
          isOpen={idsToDelete !== null}
          message={`¿Eliminar ${idsToDelete?.length ?? 0} departamento(s)?`}
          onCancel={() => setIdsToDelete(null)}
          onConfirm={async () => {
            if (idsToDelete) {
              await deleteDepartments(idsToDelete);
            }
            setIdsToDelete(null);
            setRowSelection({});
          }}
        />

        {/* ================= TABLE ================= */}
        {!loading && !error && (
          <DataTable<DepartmentItem & { id: string }>
            data={tableData}
            edit={true}
            columns={columns}
            menu={true}
            urlRouteEdit="/dashboard/departamento/edit?id="
            urlRouteAdd="/dashboard/departamento/new"
            actions={actions}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            onDelete={(ids) => setIdsToDelete(ids)}
          />
        )}
      </ContentBody>
    </ProtectedRoute>
  );
}
