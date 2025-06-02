import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectApi = {
  getAll: () => api.get('/projects'),
  getById: (id: string) => api.get(`/projects/${id}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const billingApi = {
  getPlan: (projectId: string) => api.get(`/billing/plan/${projectId}`),
  createPlan: (data: any) => api.post('/billing/plan', data),
  updatePlan: (id: string, data: any) => api.put(`/billing/plan/${id}`, data),
};

export const consultantApi = {
  getAll: () => api.get('/consultants'),
  getAvailable: () => api.get('/consultants/available'),
  getById: (id: string) => api.get(`/consultants/${id}`),
  update: (id: string, data: any) => api.put(`/consultants/${id}`, data),
};

export const metricsApi = {
  getProjectMetrics: (projectId: string) => api.get(`/metrics/project/${projectId}`),
  getOverallMetrics: () => api.get('/metrics/overall'),
  getConsultantMetrics: (consultantId: string) => api.get(`/metrics/consultant/${consultantId}`),
};

export default api;