"use client";
import React, { useMemo, useState } from "react";
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
  const [search, setSearch] = useState("");

  // Convertimos los usuarios del JSON a un arreglo con ID
  const data: User[] = useMemo(() => {
    return user.usuarios.map((u, idx) => ({
      id: idx.toString(),
      nombre: u.nombre_empleado,
      correo: u.correo,
      rol: u.rol,
      estatus: u.estatus,
    })).filter(u =>
      u.nombre.toLowerCase().includes(search.toLowerCase()) ||
      u.correo.toLowerCase().includes(search.toLowerCase()) ||
      u.rol.toLowerCase().includes(search.toLowerCase()) ||
      u.estatus.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const columns = useMemo<MRT_ColumnDef<User>[]>(() => [
    { accessorKey: "nombre", header: "Nombre", size: 200 },
    { accessorKey: "correo", header: "Correo", size: 250 },
    { accessorKey: "rol", header: "Rol", size: 120 },
    { accessorKey: "estatus", header: "Estatus" },
  ], []);

  return (
    <ContentBody title="Usuarios">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      <DataTable data={data} columns={columns} />
    </ContentBody>
  );
}
