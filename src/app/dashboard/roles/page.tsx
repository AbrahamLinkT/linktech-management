"use client";

import { useMemo, useState } from "react";
import { ContentBody } from "@/components/containers/containers";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { useRoles, type RoleItem } from "@/hooks/useRoles";
import ConfirmModal from "@/components/ConfirmModal";

export default function RolesPage() {
  const { data, loading, error, deleteRoles } = useRoles();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [idsToDelete, setIdsToDelete] = useState<string[] | null>(null);

  const tableData = useMemo<(RoleItem & { id: string })[]>(() => {
    if (!data) return [];
    return data.map((d) => {
      const { id, ...rest } = d;
      return { ...rest, id: id.toString() } as RoleItem & { id: string };
    });
  }, [data]);

  const columns = useMemo<MRT_ColumnDef<RoleItem & { id: string }>[]>(
    () => [
      { accessorKey: "name", header: "Nombre" },
      { accessorKey: "shortName", header: "Nombre Corto" },
    ],
    []
  );

  const actions = { edit: true, add: true, export: true, delete: true };

  return (
    <ProtectedRoute requiredPermission="roles">
      <ContentBody title="Roles">
        {loading && <p>Cargando roles...</p>}
        {error && <p>Error: {error}</p>}

        <ConfirmModal
          isOpen={idsToDelete !== null}
          message={`¿Eliminar ${idsToDelete?.length ?? 0} rol(es)?`}
          onCancel={() => setIdsToDelete(null)}
          onConfirm={async () => {
            if (idsToDelete) {
              await deleteRoles(idsToDelete);
            }
            setIdsToDelete(null);
            setRowSelection({});
          }}
        />

        {!loading && !error && (
          <DataTable<RoleItem & { id: string }>
            data={tableData}
            edit={true}
            columns={columns}
            menu={true}
            urlRouteEdit="/dashboard/roles/edit?id="
            urlRouteAdd="/dashboard/roles/new"
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
