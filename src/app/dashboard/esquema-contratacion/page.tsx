"use client";
import React, { useMemo, useState } from "react";
import { ContentBody } from "@/components/containers/containers";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { useEsquemaContratacion, type EsquemaItem } from "@/hooks/useEsquema-contratacion";
import ConfirmModal from "@/components/ConfirmModal";

export default function EsquemaContratacionPage() {
  const { data, loading, error, deleteEsquemas } = useEsquemaContratacion();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [idsToDelete, setIdsToDelete] = useState<string[] | null>(null);

  // Asegurar id:string
  const tableData = useMemo(() => {
    if (!data) return [];
    return data.map((d) => ({ ...d, id: d.id.toString() }));
  }, [data]);

  const columns = useMemo<MRT_ColumnDef<EsquemaItem>[]>(() => [
    { accessorKey: "name", header: "Nombre", size: 200 },
    { accessorKey: "description", header: "Descripción", size: 300 },
    { accessorKey: "hours", header: "Horas", size: 100 },
  ], []);

  const actions = { edit: true, add: true, export: true, delete: true };

  return (
    <ProtectedRoute requiredPermission="esquemaContratacion">
      <ContentBody title="Esquema contractual">
      {loading && <p>Cargando esquemas...</p>}
      {error && <p>Error: {error}</p>}

      <ConfirmModal
        isOpen={idsToDelete !== null}
        message={`¿Eliminar ${idsToDelete?.length ?? 0} esquema(s)?`}
        onCancel={() => setIdsToDelete(null)}
        onConfirm={async () => {
          if (idsToDelete) {
            await deleteEsquemas(idsToDelete);
          }
          setIdsToDelete(null);
          setRowSelection({});
        }}
      />

      {!loading && !error && (
        <DataTable<EsquemaItem & { id: string }>
          data={tableData}
          columns={columns}
          menu={true}
          actions={actions}
          urlRouteAdd="/dashboard/esquema-contratacion/new"
          urlRouteEdit="/dashboard/esquema-contratacion/edit?id="
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onDelete={(ids) => setIdsToDelete(ids)}
        />
      )}
      </ContentBody>
    </ProtectedRoute>
  );
}
