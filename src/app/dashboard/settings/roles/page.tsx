import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { MRT_ColumnDef } from "material-react-table";
import { useMemo } from "react";
type Role = {
  id: string;
  nombre: string;
  descripcion: string;
}
type Administracion = {
  id: string;
  correo: string;
  rol: string;
}
export default function RolesPage() {

  const columns = useMemo<MRT_ColumnDef<Administracion>[]>(() => [
    { accessorKey: "correo", header: "Correo electrónico" },
    { accessorKey: "rol", header: "Rol" },
  ], []);
  const columns2 = useMemo<MRT_ColumnDef<Role>[]>(() => [
    { accessorKey: "nombre", header: "Nombre" },
    { accessorKey: "descripcion", header: "Descripción" },
  ], []);
  return (
    <ContentBody title="Roles">
      <div>
        {/* <RoleTable /> */}
        <DataTable<Administracion>
          menu={true}
          columns={columns}
          data={[]}
          title_add="Agregar"
          ModalAdd={<h1>Agregar</h1>}
        />
        <DataTable<Role>
          menu={true}
          columns={columns2}
          data={[]}
          title_add="Agregar"
          ModalAdd={<h1>Agregar</h1>}
        />
      </div>
    </ContentBody>
  );
}
