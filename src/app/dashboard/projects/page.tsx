"use client";
import { useMemo } from "react";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import Proj from "@/data/Projects.json"; // Tu JSON de proyectos
import { ContentBody } from "@/components/containers/containers";


// Definimos el tipo de cada proyecto según tu JSON
type Project = {
  id: string;
  ordenInterna: string;
  titulo: string;
  cliente: string;
  descripcion: string;
  fechaIn: string;
  fechaFn: string;
  estatus: string;
  responsable: string;
};

export default function Projects() {
  // Columnas de la tabla
  const columns = useMemo<MRT_ColumnDef<Project>[]>(() => [
    { accessorKey: "ordenInterna", header: "Orden Interna" },
    { accessorKey: "titulo", header: "Nombre" },
    { accessorKey: "cliente", header: "Cliente" },
    { accessorKey: "descripcion", header: "Descripción" },
    {
      accessorKey: "fechaIn",
      header: "Fechas",
      // Concatenamos fecha inicio y fin en una sola celda
      Cell: ({ row }) => `${row.original.fechaIn} - ${row.original.fechaFn}`,
    },
    { accessorKey: "estatus", header: "Estatus" },
    { accessorKey: "responsable", header: "Responsable" },
  ], []);

  // Datos que se consumen del JSON
  const data: Project[] = Proj.proyectos.map(p => ({
    id: p.id,
    ordenInterna: p.ordenInterna,
    titulo: p.titulo,
    cliente: p.cliente,
    descripcion: p.descripcion,
    fechaIn: p.fechaIn,
    fechaFn: p.fechaFn,
    estatus: p.estatus,
    responsable: p.responsable,
  }));

  return (
    <ContentBody
      title="Proyectos"
    >
      <DataTable<Project>
        data={data}      // Datos consumidos del JSON
        columns={columns} // Columnas definidas arriba
      />
    </ContentBody>
  );
}
