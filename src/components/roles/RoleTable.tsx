"use client";
import React, { useState, useEffect } from "react";
import { Check, X, RefreshCw, UserCheck, Shield, Users, Edit2 } from "lucide-react";
import { ROLE_PROFILES, ROLE_LABELS, ROLE_DESCRIPTIONS, type RoleType } from "@/constants/role-profiles";
import type { UserListItem } from "@/types/permissions";
import UserPermissionsEditor from "./UserPermissionsEditor";

const API_URL = "https://linktech-management-a.vercel.app/api/permissions";

export default function RoleTable() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleType>("worker");
  const [updating, setUpdating] = useState(false);
  const [editingPermissionsEmail, setEditingPermissionsEmail] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
      } else {
        setError("Error al cargar los usuarios");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("No se pudo conectar con el servidor");
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

      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          role: selectedRole,
          permissions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUsers(users.map(u => 
          u.email === email 
            ? { ...u, role: selectedRole }
            : u
        ));
        setEditingEmail(null);
      } else {
        alert("Error al actualizar el rol: " + data.message);
      }
    } catch (err) {
      console.error("Error updating role:", err);
      alert("No se pudo actualizar el rol");
    } finally {
      setUpdating(false);
    }
  };

  const getRoleBadge = (role: RoleType) => {
    const badges = {
      admin: "bg-purple-100 text-purple-800 border-purple-300",
      lider: "bg-blue-100 text-blue-800 border-blue-300",
      worker: "bg-gray-100 text-gray-800 border-gray-300",
    };
    return badges[role] || badges.worker;
  };

  const getRoleIcon = (role: RoleType) => {
    switch (role) {
      case "admin":
        return <Shield size={16} />;
      case "lider":
        return <UserCheck size={16} />;
      default:
        return <Users size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="animate-spin mr-3" size={24} />
          <span className="text-lg">Cargando usuarios...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 text-lg font-semibold mb-3">⚠️ {error}</p>
          <button
            onClick={fetchUsers}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 inline-flex items-center gap-2"
          >
            <RefreshCw size={18} /> Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {editingPermissionsEmail && (
        <UserPermissionsEditor
          email={editingPermissionsEmail}
          onClose={() => setEditingPermissionsEmail(null)}
          onSave={() => {
            fetchUsers();
            setEditingPermissionsEmail(null);
          }}
        />
      )}

      <div className="bg-white rounded-lg shadow p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Gestión de Roles de Usuario</h2>
            <p className="text-gray-600 mt-1">
              Total de usuarios: <strong>{users.length}</strong>
            </p>
          </div>
          <button
            onClick={fetchUsers}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {(Object.keys(ROLE_PROFILES) as RoleType[]).map((role) => (
            <div key={role} className={`p-4 rounded-lg border-2 ${getRoleBadge(role)}`}>
              <div className="flex items-center gap-2 mb-2">
                {getRoleIcon(role)}
                <h3 className="font-bold">{ROLE_LABELS[role]}</h3>
              </div>
              <p className="text-sm">{ROLE_DESCRIPTIONS[role]}</p>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr>
                <th className="text-left border-b-2 border-gray-200 pb-3 text-lg font-semibold">
                  Nombre
                </th>
                <th className="text-left border-b-2 border-gray-200 pb-3 text-lg font-semibold">
                  Correo
                </th>
                <th className="text-left border-b-2 border-gray-200 pb-3 text-lg font-semibold">
                  Rol Actual
                </th>
                <th className="text-left border-b-2 border-gray-200 pb-3 text-lg font-semibold">
                  Estado
                </th>
                <th className="text-left border-b-2 border-gray-200 pb-3 text-lg font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.email} className="bg-gray-50 hover:bg-gray-100 transition">
                  <td className="p-3 text-base font-medium">{user.name}</td>
                  <td className="p-3 text-base">{user.email}</td>
                  <td className="p-3">
                    {editingEmail === user.email ? (
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value as RoleType)}
                        className="border-2 border-blue-400 rounded px-3 py-2 w-full text-base focus:ring-2 focus:ring-blue-300 bg-white"
                        disabled={updating}
                      >
                        {(Object.keys(ROLE_PROFILES) as RoleType[]).map((role) => (
                          <option key={role} value={role}>
                            {ROLE_LABELS[role]}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold ${getRoleBadge(user.role as RoleType)}`}>
                        {getRoleIcon(user.role as RoleType)}
                        {ROLE_LABELS[user.role as RoleType] || user.role}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      user.isActive 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-3">
                    {editingEmail === user.email ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveRoleChange(user.email)}
                          disabled={updating}
                          className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center gap-1 disabled:bg-gray-400"
                        >
                          <Check size={18} /> Guardar
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={updating}
                          className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500 flex items-center gap-1"
                        >
                          <X size={18} /> Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(user)}
                          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 flex items-center gap-1"
                          title="Cambiar rol completo"
                        >
                          <Shield size={18} /> Rol
                        </button>
                        <button
                          onClick={() => setEditingPermissionsEmail(user.email)}
                          className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 flex items-center gap-1"
                          title="Editar permisos individuales"
                        >
                          <Edit2 size={18} /> Permisos
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No hay usuarios registrados en el sistema</p>
          </div>
        )}
      </div>
    </>
  );
}
