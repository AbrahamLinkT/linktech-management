/**
 * Perfiles de roles predefinidos para el sistema
 */

export type RoleType = 'admin' | 'lider' | 'worker';

export interface RolePermissions {
  dashboard: boolean;
  projects: boolean;
  consultants: boolean;
  workers: boolean;
  client: boolean;
  billing: boolean;
  metrics: boolean;
  cargabilidad: boolean;
  proyeccion: boolean;
  disponibilidad: boolean;
  departamentos: boolean;
  usuarios: boolean;
  analisis: boolean;
  asuetos: boolean;
  especialidades: boolean;
  esquemaContratacion: boolean;
  horasContrato: boolean;
  horasPorAprobar: boolean;
  solicitudHoras: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
}

export const ROLE_PROFILES: Record<RoleType, RolePermissions> = {
  admin: {
    // Full Access
    dashboard: true,
    projects: true,
    consultants: true,
    workers: true,
    client: true,
    billing: true,
    metrics: true,
    cargabilidad: true,
    proyeccion: true,
    disponibilidad: true,
    departamentos: true,
    usuarios: true,
    analisis: true,
    asuetos: true,
    especialidades: true,
    esquemaContratacion: true,
    horasContrato: true,
    horasPorAprobar: true,
    solicitudHoras: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
  },
  lider: {
    // Líder de Proyecto - Sin gestión de usuarios
    dashboard: true,
    projects: true,
    consultants: true,
    workers: true,
    client: true,
    billing: true,
    metrics: true,
    cargabilidad: true,
    proyeccion: true,
    disponibilidad: true,
    departamentos: true,
    usuarios: false,
    analisis: true,
    asuetos: true,
    especialidades: true,
    esquemaContratacion: true,
    horasContrato: true,
    horasPorAprobar: true,
    solicitudHoras: true,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canExport: true,
  },
  worker: {
    // Worker - Sin permisos por defecto
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
  },
};

export const ROLE_LABELS: Record<RoleType, string> = {
  admin: 'Administrador (Full Access)',
  lider: 'Líder de Proyecto',
  worker: 'Trabajador',
};

export const ROLE_DESCRIPTIONS: Record<RoleType, string> = {
  admin: 'Acceso completo a todos los módulos y funcionalidades del sistema',
  lider: 'Acceso a gestión de proyectos y equipo, sin permisos de administración de usuarios',
  worker: 'Sin permisos por defecto, debe solicitar acceso específico',
};
