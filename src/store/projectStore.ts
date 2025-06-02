import { create } from 'zustand';
import { Project, ProjectStatus } from '@/types/project';
import { projectApi } from '@/services/api';

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  createProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,
  fetchProjects: async () => {
    set({ loading: true });
    try {
      const response = await projectApi.getAll();
      set({ projects: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch projects', loading: false });
    }
  },
  createProject: async (project) => {
    try {
      await projectApi.create(project);
      const response = await projectApi.getAll();
      set({ projects: response.data });
    } catch (error) {
      set({ error: 'Failed to create project' });
    }
  },
  updateProject: async (id, project) => {
    try {
      await projectApi.update(id, project);
      const response = await projectApi.getAll();
      set({ projects: response.data });
    } catch (error) {
      set({ error: 'Failed to update project' });
    }
  },
  deleteProject: async (id) => {
    try {
      await projectApi.delete(id);
      const response = await projectApi.getAll();
      set({ projects: response.data });
    } catch (error) {
      set({ error: 'Failed to delete project' });
    }
  },
}));