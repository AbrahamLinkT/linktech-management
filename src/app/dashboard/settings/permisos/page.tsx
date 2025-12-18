"use client";
import { useState, useEffect } from "react";
import { ContentBody } from "@/components/containers/containers";
import { Autocomplete, TextField, Switch, FormControlLabel, Button, Box, Typography, Paper, Grid, Divider, Alert, Chip } from "@mui/material";
import { Save, RefreshCw, Shield } from "lucide-react";
import type { UserPermissions } from "@/types/permissions";

const API_URL = "https://linktech-management-a.vercel.app/api/permissions";

interface UserItem {
  email: string;
  name: string;
  role: string;
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

// Función auxiliar para activar/desactivar todos los permisos de una categoría
const toggleCategoryPermissions = (
  permissions: UserPermissions,
  category: PermissionCategory,
  value: boolean
): UserPermissions => {
  const updates: Partial<UserPermissions> = {};
  category.permissions.forEach((perm) => {
    updates[perm.key] = value;
  });
  return { ...permissions, ...updates };
};

export default function PermisosPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Cargar lista de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.success && data.users) {
          setUsers(data.users.map((u: any) => ({
            email: u.email,
            name: u.name,
            role: u.role
          })));
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  // Cargar permisos del usuario seleccionado
  const loadUserPermissions = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.success && data.permissions) {
        setPermissions(data.permissions);
      } else {
        setError("No se pudieron cargar los permisos");
      }
    } catch (err) {
      console.error("Error loading permissions:", err);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // Manejar selección de usuario
  const handleUserSelect = (_event: any, value: UserItem | null) => {
    setSelectedUser(value);
    setPermissions(null);
    setError(null);
    setSuccess(false);
    if (value) {
      loadUserPermissions(value.email);
    }
  };

  // Cambiar un permiso individual
  const handlePermissionToggle = (key: keyof UserPermissions) => {
    if (permissions) {
      setPermissions({
        ...permissions,
        [key]: !permissions[key],
      });
    }
  };

  // Activar/desactivar todos los permisos de una categoría
  const handleToggleCategory = (category: PermissionCategory, value: boolean) => {
    if (permissions) {
      setPermissions(toggleCategoryPermissions(permissions, category, value));
    }
  };

  // Verificar si todos los permisos de una categoría están activos
  const isCategoryFullyActive = (category: PermissionCategory): boolean => {
    if (!permissions) return false;
    return category.permissions.every((perm) => permissions[perm.key]);
  };

  // Guardar cambios
  const handleSave = async () => {
    if (!selectedUser || !permissions) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${API_URL}?email=${encodeURIComponent(selectedUser.email)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permissions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Error al guardar: " + (data.message || "Error desconocido"));
      }
    } catch (err) {
      console.error("Error saving permissions:", err);
      setError("No se pudieron guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  // Contar permisos activos
  const countActivePermissions = () => {
    if (!permissions) return 0;
    return Object.values(permissions).filter(Boolean).length;
  };

  return (
    <ContentBody title="Gestión Granular de Permisos">
      <Paper elevation={0} sx={{ p: 3 }}>
        {/* Selector de Usuario */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Shield size={24} />
            Seleccionar Usuario
          </Typography>
          <Autocomplete
            options={users}
            getOptionLabel={(option) => `${option.email} - ${option.name}`}
            value={selectedUser}
            onChange={handleUserSelect}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar usuario por email"
                placeholder="Escribe el email del usuario..."
                variant="outlined"
              />
            )}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <li key={key} {...otherProps}>
                  <Box>
                    <Typography variant="body1" fontWeight={600}>{option.email}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.name} - {option.role}
                    </Typography>
                  </Box>
                </li>
              );
            }}
            fullWidth
            loading={loading}
          />
        </Box>

        {/* Información del usuario seleccionado */}
        {selectedUser && (
          <Box sx={{ mb: 3 }}>
            <Alert severity="info" icon={false}>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                <Typography variant="body1">
                  <strong>Usuario:</strong> {selectedUser.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {selectedUser.email}
                </Typography>
                <Chip label={selectedUser.role} color="primary" size="small" />
                {permissions && (
                  <Chip 
                    label={`${countActivePermissions()} / 23 permisos activos`} 
                    color="success" 
                    size="small" 
                  />
                )}
              </Box>
            </Alert>
          </Box>
        )}

        {/* Mensajes */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(false)}>
            Permisos actualizados correctamente
          </Alert>
        )}

        {permissions && !loading && (
          <>
            <Grid container spacing={2}>
              {PERMISSION_CATEGORIES.map((category) => (
                <Grid item xs={12} sm={6} lg={4} key={category.title}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2.5, 
                      height: "100%",
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: 2,
                        borderColor: "primary.main",
                      }
                    }}
                  >
                    {/* Header de categoría con botones */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                        {category.title}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Button
                          size="small"
                          variant="text"
                          color="success"
                          onClick={() => handleToggleCategory(category, true)}
                          sx={{ minWidth: "auto", px: 1, fontSize: "0.75rem" }}
                        >
                          Todos
                        </Button>
                        <Button
                          size="small"
                          variant="text"
                          color="error"
                          onClick={() => handleToggleCategory(category, false)}
                          sx={{ minWidth: "auto", px: 1, fontSize: "0.75rem" }}
                        >
                          Ninguno
                        </Button>
                      </Box>
                    </Box>
                    
                    {/* Indicador de estado de la categoría */}
                    <Box sx={{ mb: 1.5 }}>
                      <Chip
                        size="small"
                        label={`${category.permissions.filter(p => permissions[p.key]).length} / ${category.permissions.length}`}
                        color={isCategoryFullyActive(category) ? "success" : "default"}
                        sx={{ fontSize: "0.7rem", height: 20 }}
                      />
                    </Box>

                    <Divider sx={{ mb: 2 }} />
                    
                    {/* Lista de permisos */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      {category.permissions.map((perm) => (
                        <FormControlLabel
                          key={perm.key}
                          control={
                            <Switch
                              checked={permissions[perm.key]}
                              onChange={() => handlePermissionToggle(perm.key)}
                              color="primary"
                              size="small"
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                              {perm.label}
                            </Typography>
                          }
                          sx={{ 
                            ml: 0,
                            mr: 0,
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                            py: 0.5,
                            px: 1,
                            borderRadius: 1,
                            "&:hover": {
                              backgroundColor: "action.hover",
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Botón Guardar */}
            <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => selectedUser && loadUserPermissions(selectedUser.email)}
                disabled={saving}
                startIcon={<RefreshCw size={18} />}
              >
                Recargar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={saving}
                startIcon={<Save size={18} />}
                size="large"
              >
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </Box>
          </>
        )}

        {!selectedUser && !loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Shield size={64} style={{ opacity: 0.3 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              Selecciona un usuario para gestionar sus permisos
            </Typography>
          </Box>
        )}
      </Paper>
    </ContentBody>
  );
}
