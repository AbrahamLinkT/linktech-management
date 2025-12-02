// Configuración centralizada de la API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://13.56.13.129',
  ENDPOINTS: {
    WORKERS: '/worker',
    PROJECTS: '/projects',
    DEPARTMENT_HEADS: '/department-heads',
    DEPARTMENTS: '/department',
    CLIENTS: '/client',
    NON_WORKING_DAYS: '/Non-Working-Days'
  }
};

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};