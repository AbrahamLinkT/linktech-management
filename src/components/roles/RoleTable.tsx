"use client";
import React, { useState, useEffect, useMemo } from "react";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { Box, Button, MenuItem, Select, SelectChangeEvent, Chip } from "@mui/material";
import { Check, X } from "lucide-react";
import { ROLE_PROFILES, ROLE_LABELS, type RoleType } from "@/constants/role-profiles";
import type { UserListItem } from "@/types/permissions";

const API_URL = "https://linktech-management-a.vercel.app/api/permissions";

export default function RoleTable() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleType>("worker");
  const [updating, setUpdating] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      // La API devuelve { success: true, count: N, users: [...] }
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else if (data.success && Array.isArray(data.data)) {
        // Fallback por si cambia el formato
        setUsers(data.data);
      } else if (Array.isArray(data)) {
        // Si la API devuelve directamente un array
        setUsers(data);
      } else {
        console.error("Unexpected data format:", data);
        setError("Formato de datos inesperado del servidor");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(`Error al cargar usuarios: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const startEdit = (user: UserListItem) => {
    setEditingEmail(user.email);
    setSelectedRole(user.role as RoleType);
  };

  const cancelEdit = () => {
    setEditingEmail(null);
  };

  const saveRoleChange = async (email: string) => {
    setUpdating(true);
    try {
      const permissions = ROLE_PROFILES[selectedRole];

      // PUT con email como query parameter
      const response = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole,
          permissions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar el usuario en la lista local
        setUsers(users.map(u => 
          u.email === email 
            ? { ...u, role: selectedRole }
            : u
        ));
        setEditingEmail(null);
      } else {
        alert("Error al actualizar el rol: " + (data.message || "Error desconocido"));
      }
    } catch (err) {
      console.error("Error updating role:", err);
      alert("No se pudo actualizar el rol: " + (err instanceof Error ? err.message : "Error desconocido"));
    } finally {
      setUpdating(false);
    }
  };

  const getRoleColor = (role: RoleType): "secondary" | "primary" | "default" => {
    const colors = {
      admin: "secondary" as const,
      lider: "primary" as const,
      worker: "default" as const,
    };
    return colors[role] || colors.worker;
  };

  const columns = useMemo<MRT_ColumnDef<UserListItem>[]>(
    () => [
      {
        accessorKey: "email",
        header: "Email",
        size: 250,
        Cell: ({ row }) => (
          <Box>
            <Box sx={{ fontWeight: 600, color: "#111827" }}>{row.original.email}</Box>
            <Box sx={{ fontSize: "0.875rem", color: "#6B7280" }}>{row.original.name}</Box>
          </Box>
        ),
      },
      {
        accessorKey: "role",
        header: "Rol",
        size: 150,
        Cell: ({ row }) =>
          editingEmail === row.original.email ? (
            <Select
              value={selectedRole}
              onChange={(e: SelectChangeEvent) => setSelectedRole(e.target.value as RoleType)}
              size="small"
              disabled={updating}
              autoFocus
              sx={{
                minWidth: 200,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#3B82F6",
                  borderWidth: 2,
                },
              }}
            >
              {(Object.keys(ROLE_PROFILES) as RoleType[]).map((role) => (
                <MenuItem key={role} value={role}>
                  {ROLE_LABELS[role]}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Chip
              label={ROLE_LABELS[row.original.role as RoleType] || row.original.role}
              color={getRoleColor(row.original.role as RoleType)}
              sx={{ fontWeight: 700 }}
            />
          ),
      },
      {
        accessorKey: "actions",
        header: "Acciones",
        size: 200,
        enableSorting: false,
        Cell: ({ row }) =>
          editingEmail === row.original.email ? (
            <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
              <Button
                variant="contained"
                color="success"
                size="small"
                disabled={updating}
                onClick={() => saveRoleChange(row.original.email)}
                startIcon={<Check size={16} />}
              >
                {updating ? "Guardando..." : "Guardar"}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                disabled={updating}
                onClick={cancelEdit}
                startIcon={<X size={16} />}
              >
                Cancelar
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => startEdit(row.original)}
              >
                Editar Rol
              </Button>
            </Box>
          ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingEmail, selectedRole, updating]
  );

  const table = useMaterialReactTable({
    columns,
    data: users,
    enableColumnActions: false,
    enableColumnFilters: true,
    enablePagination: true,
    enableSorting: true,
    enableBottomToolbar: true,
    enableTopToolbar: true,
    muiTableBodyRowProps: {
      hover: true,
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: "none",
      },
    },
    initialState: {
      pagination: { pageIndex: 0, pageSize: 10 },
      density: "comfortable",
    },
    state: {
      isLoading: loading,
      showAlertBanner: !!error,
    },
    muiToolbarAlertBannerProps: error
      ? {
          color: "error",
          children: error,
        }
      : undefined,
    renderTopToolbarCustomActions: () => (
      <Button variant="outlined" onClick={fetchUsers} disabled={loading}>
        Actualizar
      </Button>
    ),
  });

  return <MaterialReactTable table={table} />;
}
