"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ContentBody } from "@/components/containers/containers";
import { useMemo, useState } from "react";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { useWorkers, WorkerData } from "@/hooks/useWorkers";
import ConfirmModal from "@/components/ConfirmModal";

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
  const { data: workers, loading, deleteWorkers } = useWorkers();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [idsToDelete, setIdsToDelete] = useState<string[] | null>(null);

  const data: StaffItem[] = workers.map((w: WorkerData) => ({
    id: w.id.toString(),
    consultor: w.name,
    especialidad: w.roleName ?? "-",
    nivel: w.levelName ?? "-",
    departamento: w.location ?? "-",
    esquema: w.schemeName ?? "-",
    estatus: w.status ? "Activo" : "Inactivo",
  }));

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

  // Habilitar las acciones (igual que en departamentos)
  const actions = { edit: true, add: true, export: true, delete: true };

  if (loading) return <div>Cargando...</div>;

  return (
    <ProtectedRoute requiredPermission="workers">
      <ContentBody title="Trabajadores">
        <ConfirmModal
          isOpen={idsToDelete !== null}
          message={`¿Eliminar ${idsToDelete?.length ?? 0} trabajador(es)?`}
          onCancel={() => setIdsToDelete(null)}
          onConfirm={async () => {
            if (idsToDelete && idsToDelete.length > 0) {
              await deleteWorkers(idsToDelete);
            }
            setIdsToDelete(null);
            setRowSelection({});
          }}
        />

        <DataTable
          data={data}
          columns={columns}
          menu={true}
          actions={actions}
          urlRoute="/dashboard/workers/show?id="
          urlRouteAdd="/dashboard/workers/new"
          urlRouteEdit="/dashboard/workers/edit?id="
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          onDelete={(ids: string[]) => setIdsToDelete(ids)}
        />
      </ContentBody>
    </ProtectedRoute>
  );
}
