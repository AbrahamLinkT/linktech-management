// Configuración centralizada de la API
export const API_CONFIG = {
  // En producción usa el proxy interno para evitar Mixed Content (HTTPS -> HTTP)
  // En desarrollo puede usar directamente el backend HTTP
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? '/api/proxy' 
    : (process.env.NEXT_PUBLIC_API_URL || 'http://backend.linktech.com.mx'),
  ENDPOINTS: {
    WORKERS: '/worker',
    PROJECTS: '/projects',
    DEPARTMENT_HEADS: '/department-heads',
    DEPARTMENTS: '/department',
    CLIENTS: '/client',
    NON_WORKING_DAYS: '/Non-Working-Days',
    WORK_SCHEDULE: '/workSchedule',
    ASSIGNED_HOURS: '/assigned-hours',
    LEVELS: '/level',
    ROLES: '/roles',
  }
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};