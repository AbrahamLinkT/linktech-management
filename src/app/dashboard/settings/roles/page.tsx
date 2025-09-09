import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";

type Role = {
  id: string;
  nombre: string;
  descripcion: string;
};

type Administracion = {
  id: string;
  correo: string;
  rol: string;
};

export default function RolesPage() {
  const columns = useMemo<MRT_ColumnDef<Administracion>[]>(() => [
    { accessorKey: "correo", header: "Correo electrónico" },
    { accessorKey: "rol", header: "Rol" },
  ], []);

  const columns2 = useMemo<MRT_ColumnDef<Role>[]>(() => [
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "descripcion", header: "Descripción" },
  ], []);

  // 🔹 Mock data para tabla de administración
  const dataAdministracion: Administracion[] = [
    { id: "1", correo: "admin@empresa.com", rol: "Administrador" },
    { id: "2", correo: "jose@empresa.com", rol: "Supervisor" },
    { id: "3", correo: "maria@empresa.com", rol: "Usuario" },
  ];

  // 🔹 Mock data para tabla de roles
  const dataRoles: Role[] = [
    { id: "r1", nombre: "Administrador", descripcion: "Acceso total al sistema" },
    { id: "r2", nombre: "Supervisor", descripcion: "Gestiona usuarios y proyectos" },
    { id: "r3", nombre: "Usuario", descripcion: "Acceso limitado a módulos asignados" },
  ];

  return (
    <ContentBody title="Roles">
      <div>
        <h2 className="p-1 mb-8 text-2xl font-bold">Administración de Roles</h2>
        <DataTable<Administracion>
          menu={true}
          columns={columns}
          data={dataAdministracion}
          actions={{ edit: true, delete: true, add: true }}
          urlRouteAdd="/dashboard/settings/roles/users/new"
          urlRouteEdit="/dashboard/settings/roles/users/edit?id="
        />

        <h3 className="p-1 mb-8 text-2xl font-bold">Creación de Roles</h3>
        <DataTable<Role>
          menu={true}
          columns={columns2}
          edit
          actions={{ edit: true, delete: true, add: true }}
          data={dataRoles}
          urlRouteAdd="/dashboard/settings/roles/new"
          urlRouteEdit="/dashboard/settings/roles/edit?id="
        />
      </div>
    </ContentBody>
  );
}
