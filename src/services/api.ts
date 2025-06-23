import axios from 'axios';
import { Project } from 'src/types/project';
import { Consultant } from 'src/types/consultant';
import { BillingPlan } from 'src/types/billing';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const projectApi = {
  getAll: () => api.get<Project[]>('/projects'),
  getById: (id: string) => api.get<Project>(`/projects/${id}`),
  create: (data: Partial<Project>) => api.post<Project>('/projects', data),
  update: (id: string, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: string) => api.delete<void>(`/projects/${id}`),
};

export const billingApi = {
  getPlan: (projectId: string) => api.get<BillingPlan>(`/billing/plan/${projectId}`),
  createPlan: (data: Partial<BillingPlan>) => api.post<BillingPlan>('/billing/plan', data),
  updatePlan: (id: string, data: Partial<BillingPlan>) => api.put<BillingPlan>(`/billing/plan/${id}`, data),
};

export const consultantApi = {
  getAll: () => api.get<Consultant[]>('/consultants'),
  getAvailable: () => api.get<Consultant[]>('/consultants/available'),
  getById: (id: string) => api.get<Consultant>(`/consultants/${id}`),
  update: (id: string, data: Partial<Consultant>) => api.put<Consultant>(`/consultants/${id}`, data),
};

export const metricsApi = {
  getProjectMetrics: (projectId: string) => api.get(`/metrics/project/${projectId}`),
  getOverallMetrics: () => api.get('/metrics/overall'),
  getConsultantMetrics: (consultantId: string) => api.get(`/metrics/consultant/${consultantId}`),
};

export default api;