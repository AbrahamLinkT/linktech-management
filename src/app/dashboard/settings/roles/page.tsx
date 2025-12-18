"use client";
import { ContentBody } from "@/components/containers/containers";
import RoleTable from "@/components/roles/RoleTable";

export default function RolesPage() {
  return (
    <ContentBody title="Gestión de Roles">
      <RoleTable />
    </ContentBody>
  );
}
