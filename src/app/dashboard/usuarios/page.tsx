"use client";
import React, { useMemo, useState } from "react";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import ConfirmModal from "@/components/ConfirmModal";
import { useUsuarios, type DepartmentHeadItem } from "@/hooks/useUsuarios";

export default function UsersComponent() {
  // hook que maneja department-heads + deps + workers
  const {
    data,
    loading,
    error,
    deleteDepartmentHeads,
  } = useUsuarios();

  // row selection para habilitar los checkboxes en DataTable (igual que ejemplo functional)
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
    {}
  );
  const [idsToDelete, setIdsToDelete] = useState<string[] | null>(null);

  // columnas: id, lider, departamento
  const columns = useMemo<MRT_ColumnDef<DepartmentHeadItem>[]>(() => [
    { accessorKey: "id", header: "ID", size: 80 },
    { accessorKey: "workerName", header: "Líder (Persona)", size: 250 },
    { accessorKey: "departmentName", header: "Departamento", size: 250 },
  ], []);

  const tableData = useMemo(() => {
    // data ya mapeado en hook a DepartmentHeadItem con id:string y names
    return data;
  }, [data]);

  const actions = { edit: true, add: true, export: true, delete: true };

  return (
    <ContentBody title="Líderes de Departamento">
      {loading && <p>Cargando líderes...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      <ConfirmModal
        isOpen={idsToDelete !== null}
        message={`¿Eliminar ${idsToDelete?.length ?? 0} registro(s)?`}
        onCancel={() => setIdsToDelete(null)}
        onConfirm={async () => {
          if (idsToDelete) {
            await deleteDepartmentHeads(idsToDelete);
          }
          setIdsToDelete(null);
          setRowSelection({});
        }}
      />

      {!loading && !error && (
        <DataTable<DepartmentHeadItem & { id: string }>
          data={tableData}
          columns={columns}
          menu={true}
          actions={actions}
          urlRouteAdd="/dashboard/usuarios/new"
          urlRouteEdit="/dashboard/usuarios/edit?id="
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onDelete={(ids) => setIdsToDelete(ids)}
        />
      )}
    </ContentBody>
  );
}
