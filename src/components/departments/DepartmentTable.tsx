"use client";

import { useState, useMemo } from "react";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";

interface DepartmentItem {
  id: string;
  departamento: string;
  responsable: string;
  responsableAprobacion: string;
}

// Datos definidos con id
const departments: DepartmentItem[] = [
  { id: "1", departamento: "Finanzas", responsable: "Juan Pérez", responsableAprobacion: "María López" },
  { id: "2", departamento: "Recursos Humanos", responsable: "Ana Torres", responsableAprobacion: "Carlos Ruiz" },
  { id: "3", departamento: "TI", responsable: "Luis Gómez", responsableAprobacion: "Sofía Martínez" },
];

export default function DepartmentTable() {
  const [data] = useState<DepartmentItem[]>(departments);

  // Columnas para DataTable
  const columns = useMemo<MRT_ColumnDef<DepartmentItem>[]>(
    () => [
      { accessorKey: "departamento", header: "Departamento" },
      { accessorKey: "responsable", header: "Responsable" },
      { accessorKey: "responsableAprobacion", header: "Responsable de Aprobación", size: 250 },
    ],
    []
  );

  return (
    <ContentBody title="Departamentos">
      <DataTable<DepartmentItem> data={data} columns={columns} />
    </ContentBody>
  );
}
