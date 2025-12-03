"use client";

import { useMemo, useState } from "react";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { useClients, type ClientItem } from "@/hooks/useClients";
import ConfirmModal from "@/components/ConfirmModal";

export default function ClientPage() {
  const { data, loading, error, deleteClients } = useClients();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [idsToDelete, setIdsToDelete] = useState<string[] | null>(null);

  // ==== Table data is already mapped in hook, but ensure id is string ===
  const tableData = useMemo(() => {
    if (!data) return [];
    return data.map((d) => ({
      ...d,
      id: d.id.toString(),
    }));
  }, [data]);

  const columns = useMemo<MRT_ColumnDef<ClientItem>[]>(() => [
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "nombreCorto", header: "Nombre Corto" },
  ], []);

  const actions = { edit: true, add: true, export: true, delete: true };

  return (
    <ContentBody title="Clientes">
      {loading && <p>Cargando clientes...</p>}
      {error && <p>Error: {error}</p>}

      <ConfirmModal
        isOpen={idsToDelete !== null}
        message={`¿Eliminar ${idsToDelete?.length ?? 0} cliente(s)?`}
        onCancel={() => setIdsToDelete(null)}
        onConfirm={async () => {
          if (idsToDelete) {
            await deleteClients(idsToDelete);
          }
          setIdsToDelete(null);
          setRowSelection({});
        }}
      />

      {!loading && !error && (
        <DataTable<ClientItem & { id: string }>
          data={tableData}
          edit={true}
          columns={columns}
          menu={true}
          urlRouteEdit="/dashboard/client/edit?id="
          urlRouteAdd="/dashboard/client/new"
          actions={actions}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onDelete={(ids) => setIdsToDelete(ids)}
        />
      )}
    </ContentBody>
  );
}
