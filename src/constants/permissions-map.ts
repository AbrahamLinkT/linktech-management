/**
 * Mapeo de rutas a permisos requeridos
 * Usado para filtrar el menú de navegación según los permisos del usuario
 */
export const routePermissionsMap: Record<string, string> = {
  "/dashboard/proyeccion": "proyeccion",
  "/dashboard/projects": "projects",
  "/dashboard/disponibilidad": "disponibilidad",
  "/dashboard/workers": "workers",
  "/dashboard/cargabilidad": "cargabilidad",
  "/dashboard/departamento": "departamentos",
  "/dashboard/esquema-contratacion": "esquemaContratacion",
  "/dashboard/especialidades": "especialidades",
  "/dashboard/asuetos": "asuetos",
  "/dashboard/horas-por-aprobar": "horasPorAprobar",
  "/dashboard/usuarios": "usuarios",
  "/dashboard/client": "client",
  "/dashboard/consultants": "consultants",
  "/dashboard/billing": "billing",
  "/dashboard/metrics": "metrics",
  "/dashboard/solicitud_horas": "solicitudHoras",
  "/dashboard/horas-contrato": "horasContrato",
  "/dashboard/analisis": "analisis",
  "/dashboard/correo": "correo",
  "/dashboard/tabla": "dashboard",
  "/dashboard/edith": "dashboard",
  "/settings": "dashboard",
  "/dashboard/settings/roles": "dashboard",
  "/dashboard/settings/permisos": "dashboard",
};

/**
 * Verifica si una ruta requiere permisos especiales
 */
export function getRequiredPermission(path: string): string | null {
  return routePermissionsMap[path] || null;
}
