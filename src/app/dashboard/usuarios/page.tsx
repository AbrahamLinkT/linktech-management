"use client";
import React, { useMemo } from "react";
import user from "@/data/usuarios.json";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";

interface User {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  estatus: string;
}

export default function UsersComponent() {

  const columns = useMemo<MRT_ColumnDef<User>[]>(() => [
    { accessorKey: "nombre", header: "Nombre", size: 200 },
    { accessorKey: "correo", header: "Correo", size: 250 },
    { accessorKey: "rol", header: "Rol", size: 120 },
    { accessorKey: "estatus", header: "Estatus" },
  ], []);
  const data: User[] = Array.isArray(user.usuarios) ? user.usuarios : [];
  const actions = { edit: true, add: true, export: true, delete: true }

  return (
    <ContentBody title="Usuarios">
      <DataTable<User>
        data={data}
        columns={columns}
        menu={true}
        actions={actions}
      />
    </ContentBody>
  );
}
