export interface UserPermissions {
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

export interface UserPermissionsResponse {
  success: boolean;
  email: string;
  name: string;
  role: 'admin' | 'lider' | 'worker' | 'manager' | 'employee' | 'viewer';
  permissions: UserPermissions;
  isActive: boolean;
}

export interface UserListItem {
  _id?: string;
  email: string;
  name: string;
  role: 'admin' | 'lider' | 'worker';
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
