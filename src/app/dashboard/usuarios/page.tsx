"use client";
import React from "react";
import { ContentBody } from "@/components/containers/containers";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import RoleTable from "@/components/roles/RoleTable";

export default function UsersComponent() {
  return (
    <ProtectedRoute requiredPermission="usuarios">
      <ContentBody title="Gestión de Roles de Usuario">
        <RoleTable />
      </ContentBody>
    </ProtectedRoute>
  );
}
