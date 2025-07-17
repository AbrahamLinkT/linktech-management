import { create } from 'zustand';

import { Consultant } from '@/types/consultant';
import { consultantApi } from '@/services/api';


interface ConsultantState {
  consultants: Consultant[];
  loading: boolean;
  error: string | null;
  fetchConsultants: () => Promise<void>;
  fetchAvailableConsultants: () => Promise<void>;
  updateConsultant: (id: string, consultant: Partial<Consultant>) => Promise<void>;
}

export const useConsultantStore = create<ConsultantState>((set) => ({
  consultants: [],
  loading: false,
  error: null,
  fetchConsultants: async () => {
    set({ loading: true });
    try {
      const response = await consultantApi.getAll();
      set({ consultants: response.data, loading: false });
    } catch {
      set({ error: 'Failed to fetch consultants', loading: false });
    }
  },
  fetchAvailableConsultants: async () => {
    set({ loading: true });
    try {
      const response = await consultantApi.getAvailable();
      set({ consultants: response.data, loading: false });
    } catch {
      set({ error: 'Failed to fetch available consultants', loading: false });
    }
  },
  updateConsultant: async (id, consultant) => {
    try {
      await consultantApi.update(id, consultant);
      const response = await consultantApi.getAll();
      set({ consultants: response.data });
    } catch {
      set({ error: 'Failed to update consultant' });
    }
  },
}));