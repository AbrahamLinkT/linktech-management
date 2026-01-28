"use client";

import { useMemo, useState } from "react";
import { ContentBody } from "@/components/containers/containers";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { useLevels, type LevelItem } from "@/hooks/useLevels";
import ConfirmModal from "@/components/ConfirmModal";

export default function LevelPage() {
  const { data, loading, error, deleteLevels } = useLevels();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [idsToDelete, setIdsToDelete] = useState<string[] | null>(null);

  const tableData = useMemo<(LevelItem & { id: string })[]>(() => {
    if (!data) return [];
    return data.map((d) => {
      const { id, ...rest } = d;
      return { ...rest, id: id.toString() } as LevelItem & { id: string };
    });
  }, [data]);

  const columns = useMemo<MRT_ColumnDef<LevelItem & { id: string }>[]>(
    () => [
      { accessorKey: "name", header: "Nombre" },
      { accessorKey: "shortName", header: "Nombre Corto" },
      { accessorKey: "description", header: "Descripción" },
    ],
    []
  );

  const actions = { edit: true, add: true, export: true, delete: true };

  return (
    <ProtectedRoute requiredPermission="level">
      <ContentBody title="Niveles">
        {loading && <p>Cargando niveles...</p>}
        {error && <p>Error: {error}</p>}

        <ConfirmModal
          isOpen={idsToDelete !== null}
          message={`¿Eliminar ${idsToDelete?.length ?? 0} nivel(es)?`}
          onCancel={() => setIdsToDelete(null)}
          onConfirm={async () => {
            if (idsToDelete) {
              await deleteLevels(idsToDelete);
            }
            setIdsToDelete(null);
            setRowSelection({});
          }}
        />

        {!loading && !error && (
          <DataTable<LevelItem & { id: string }>
            data={tableData}
            edit={true}
            columns={columns}
            menu={true}
            urlRouteEdit="/dashboard/level/edit?id="
            urlRouteAdd="/dashboard/level/new"
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
