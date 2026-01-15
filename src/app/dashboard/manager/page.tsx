"use client";

import { useMemo, useState } from "react";
import { ContentBody } from "@/components/containers/containers";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { useUsuarios } from "@/hooks/useUsuarios";
import ConfirmModal from "@/components/ConfirmModal";

interface ManagerRow {
  id: string;
  departamento: string;
  lider: string;
  id_department: number;
  id_worker: number;
}

export default function ManagerPage() {
  const { data, loading, error, deleteDepartmentHeads } = useUsuarios();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [idsToDelete, setIdsToDelete] = useState<string[] | null>(null);

  const tableData = useMemo<ManagerRow[]>(() => {
    return (data || []).map((d) => ({
      id: d.id,
      departamento: d.departmentName || String(d.id_department),
      lider: d.workerName || String(d.id_worker),
      id_department: d.id_department,
      id_worker: d.id_worker,
    }));
  }, [data]);

  const columns = useMemo<MRT_ColumnDef<ManagerRow>[]>(() => [
    { accessorKey: "departamento", header: "Departamento" },
    { accessorKey: "lider", header: "Líder" },
  ], []);

  const actions = { edit: true, add: true, export: true, delete: true };

  return (
    <ProtectedRoute requiredPermission="usuarios">
      <ContentBody title="Líderes de Departamento">
        {loading && <p>Cargando líderes...</p>}
        {error && <p>Error: {error}</p>}

        <ConfirmModal
          isOpen={idsToDelete !== null}
          message={`¿Eliminar ${idsToDelete?.length ?? 0} registro(s)?`}
          onCancel={() => setIdsToDelete(null)}
          onConfirm={async () => {
            if (idsToDelete && idsToDelete.length > 0) {
              await deleteDepartmentHeads(idsToDelete);
              setRowSelection({});
            }
            setIdsToDelete(null);
          }}
        />

        {!loading && !error && (
          <DataTable<ManagerRow>
            data={tableData}
            edit={true}
            columns={columns}
            menu={true}
            urlRouteEdit="/dashboard/manager/edit?id="
            urlRouteAdd="/dashboard/manager/new"
            actions={actions}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            onDelete={async (ids) => {
              setIdsToDelete(ids);
            }}
          />
        )}
      </ContentBody>
    </ProtectedRoute>
  );
}
