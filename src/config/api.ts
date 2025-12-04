// Configuración centralizada de la API
const isProduction = process.env.NODE_ENV === 'production';
const baseUrl = isProduction 
  ? '/api/proxy' // Usar proxy interno en producción para evitar Mixed Content
  : process.env.NEXT_PUBLIC_API_URL || 'http://backend.linktech.com.mx';

export const API_CONFIG = {
  BASE_URL: baseUrl,
  ENDPOINTS: {
    WORKERS: '/worker',
    PROJECTS: '/projects',
    DEPARTMENT_HEADS: '/department-heads',
    DEPARTMENTS: '/department',
    CLIENTS: '/client',
    NON_WORKING_DAYS: '/Non-Working-Days',
    WORK_SCHEDULE: '/workSchedule',
  }
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};