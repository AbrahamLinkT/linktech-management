"use client";
import React, { useState, useEffect } from "react";
import { Save, X, RefreshCw, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import type { UserPermissions } from "@/types/permissions";

const API_URL = "https://linktech-management-a.vercel.app/api/permissions";

interface UserPermissionsEditorProps {
  email: string;
  onClose: () => void;
  onSave: () => void;
}

interface PermissionCategory {
  title: string;
  permissions: Array<{ key: keyof UserPermissions; label: string }>;
}

const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    title: "Módulos Principales",
    permissions: [
      { key: "dashboard", label: "Dashboard" },
      { key: "projects", label: "Proyectos" },
      { key: "workers", label: "Trabajadores" },
      { key: "consultants", label: "Consultores" },
      { key: "client", label: "Clientes" },
    ],
  },
  {
    title: "Gestión Financiera",
    permissions: [
      { key: "billing", label: "Facturación" },
      { key: "metrics", label: "Métricas" },
      { key: "horasContrato", label: "Horas de Contrato" },
    ],
  },
  {
    title: "Recursos Humanos",
    permissions: [
      { key: "cargabilidad", label: "Cargabilidad" },
      { key: "disponibilidad", label: "Disponibilidad" },
      { key: "proyeccion", label: "Proyección" },
      { key: "departamentos", label: "Departamentos" },
      { key: "asuetos", label: "Asuetos" },
      { key: "especialidades", label: "Especialidades" },
      { key: "esquemaContratacion", label: "Esquema de Contratación" },
    ],
  },
  {
    title: "Gestión de Horas",
    permissions: [
      { key: "horasPorAprobar", label: "Horas por Aprobar" },
      { key: "solicitudHoras", label: "Solicitud de Horas" },
    ],
  },
  {
    title: "Administración",
    permissions: [
      { key: "usuarios", label: "Usuarios" },
      { key: "analisis", label: "Análisis" },
    ],
  },
  {
    title: "Acciones",
    permissions: [
      { key: "canCreate", label: "Crear" },
      { key: "canEdit", label: "Editar" },
      { key: "canDelete", label: "Eliminar" },
      { key: "canExport", label: "Exportar" },
    ],
  },
];

export default function UserPermissionsEditor({
  email,
  onClose,
  onSave,
}: UserPermissionsEditorProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [permissions, setPermissions] = useState<UserPermissions>({
    dashboard: false,
    projects: false,
    consultants: false,
    workers: false,
    client: false,
    billing: false,
    metrics: false,
    cargabilidad: false,
    proyeccion: false,
    disponibilidad: false,
    departamentos: false,
    usuarios: false,
    analisis: false,
    asuetos: false,
    especialidades: false,
    esquemaContratacion: false,
    horasContrato: false,
    horasPorAprobar: false,
    solicitudHoras: false,
    canCreate: false,
    canEdit: false,
    canDelete: false,
    canExport: false,
  });

  useEffect(() => {
    fetchUserPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const fetchUserPermissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.success) {
        setUserName(data.name);
        setUserRole(data.role);
        setPermissions(data.permissions);
      } else {
        setError("No se pudo cargar la información del usuario");
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (key: keyof UserPermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSelectAll = (category: PermissionCategory, value: boolean) => {
    const updates: Partial<UserPermissions> = {};
    category.permissions.forEach((perm) => {
      updates[perm.key] = value;
    });
    setPermissions((prev) => ({ ...prev, ...updates }));
  };

  const handleSavePermissions = async () => {
    setSaving(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          permissions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSave();
        onClose();
      } else {
        setError("Error al guardar: " + data.message);
      }
    } catch (err) {
      console.error("Error saving permissions:", err);
      setError("No se pudo guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const countActivePermissions = () => {
    return Object.values(permissions).filter(Boolean).length;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="animate-spin mr-3" size={24} />
            <span className="text-lg">Cargando permisos...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full mx-4 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Editar Permisos de Usuario</h2>
              <p className="text-blue-100 font-semibold">{userName}</p>
              <p className="text-blue-200 text-sm">{email}</p>
              <div className="mt-3 flex items-center gap-4">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  Rol: {userRole}
                </span>
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {countActivePermissions()} / {Object.keys(permissions).length} permisos activos
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Permissions Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PERMISSION_CATEGORIES.map((category) => (
              <div key={category.title} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg text-gray-800">{category.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSelectAll(category, true)}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                      title="Activar todos"
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => handleSelectAll(category, false)}
                      className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                      title="Desactivar todos"
                    >
                      Ninguno
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {category.permissions.map((perm) => (
                    <label
                      key={perm.key}
                      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                        permissions[perm.key]
                          ? "bg-green-50 border border-green-300"
                          : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span className="font-medium text-gray-700">{perm.label}</span>
                      <div className="flex items-center gap-2">
                        {permissions[perm.key] ? (
                          <CheckCircle2 size={20} className="text-green-600" />
                        ) : (
                          <XCircle size={20} className="text-gray-400" />
                        )}
                        <input
                          type="checkbox"
                          checked={permissions[perm.key]}
                          onChange={() => handlePermissionToggle(perm.key)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between items-center border-t">
          <div className="text-sm text-gray-600">
            <ShieldCheck size={16} className="inline mr-1" />
            Los cambios se aplicarán inmediatamente
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSavePermissions}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
