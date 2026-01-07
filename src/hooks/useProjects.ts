import { useState } from 'react';
import axios from 'axios';
import { buildApiUrl, API_CONFIG } from '../config/api';

// Interfaz para el payload del proyecto según el nuevo endpoint
interface ProjectPayload {
  project_name: string;
  project_code: string;
  order_int: number;
  project_description: string;
  client_id: number;
  employee_id: number;
  status: string; // "PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"
  project_type: string; // "CLIENT", "INTERNAL", "RESEARCH"
  estimated_hours: number;
  budget_amount: number;
  start_date: string; // ISO string format
  end_date: string; // ISO string format
  active: boolean;
}

// Interfaz para el proyecto que viene del GET (/projects/dto)
interface Project {
  project_id: number;
  project_name: string;
  project_code: string;
  order_int: number;
  project_description: string;
  client_id: number;
  employee_id: number;
  status: string;
  project_type: string;
  estimated_hours: number;
  budget_amount: number;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Para compatibilidad con código antiguo
interface LegacyProject {
  id: number;
  name: string;
  description: string;
  status: boolean;
  start_date: string;
  end_date: string;
  oi: string;
  id_project_manager: number | null;
  client_id: number | null;
}

interface CreateProjectResponse {
  success: boolean;
  data?: Project;
  error?: string;
}

interface GetProjectsResponse {
  success: boolean;
  data?: Project[];
  error?: string;
}

interface GetProjectResponse {
  success: boolean;
  data?: Project;
  error?: string;
}

interface UpdateProjectResponse {
  success: boolean;
  data?: Project;
  error?: string;
}

interface DeleteProjectResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todos los proyectos en formato DTO
  const getProjects = async (): Promise<GetProjectsResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Usar /projects/dto para obtener todos los proyectos en formato DTO
      const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS + '/dto'), {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });
      
      const projectsData = Array.isArray(response.data) ? response.data : [];
      setProjects(projectsData);
      
      setIsLoading(false);
      return {
        success: true,
        data: projectsData,
      };
    } catch (err: unknown) {
      console.error('Error fetching projects:', err);
      let errorMessage = 'Error fetching projects';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
        errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error fetching projects';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      setProjects([]);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  const createProject = async (projectData: ProjectPayload): Promise<CreateProjectResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const cleanedData = {
        project_name: projectData.project_name,
        project_code: projectData.project_code,
        order_int: projectData.order_int || 0,
        project_description: projectData.project_description || '',
        client_id: projectData.client_id,
        employee_id: projectData.employee_id,
        status: projectData.status,
        project_type: projectData.project_type,
        estimated_hours: projectData.estimated_hours || 0,
        budget_amount: projectData.budget_amount || 0,
        start_date: projectData.start_date ? new Date(projectData.start_date).toISOString() : new Date().toISOString(),
        end_date: projectData.end_date ? new Date(projectData.end_date).toISOString() : new Date().toISOString(),
        active: projectData.active ?? true,
      };

      const response = await axios.post(buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS), cleanedData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      setIsLoading(false);
      return {
        success: true,
        data: response.data,
      };
    } catch (err: unknown) {
      let errorMessage = 'Error creating project';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
        if (errorObj?.response?.status === 500) {
          errorMessage = 'Error del servidor. Verifica que los IDs de empleados/clientes existan en la base de datos.';
        } else {
          errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error creating project';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Get project by ID
  const getProjectById = async (id: string): Promise<GetProjectResponse> => {
    setIsLoadingProject(true);
    setError(null);

    try {
      const response = await axios.get(`${buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS)}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      setIsLoadingProject(false);
      return {
        success: true,
        data: response.data,
      };
    } catch (err: unknown) {
      let errorMessage = 'Error fetching project';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
        errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error fetching project';
      }
      
      setError(errorMessage);
      setIsLoadingProject(false);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Update project
  const updateProject = async (id: string, projectData: ProjectPayload): Promise<UpdateProjectResponse> => {
    setIsUpdating(true);
    setError(null);

    try {
      const cleanedData = {
        project_name: projectData.project_name,
        project_code: projectData.project_code,
        order_int: projectData.order_int || 0,
        project_description: projectData.project_description || '',
        client_id: projectData.client_id,
        employee_id: projectData.employee_id,
        status: projectData.status,
        project_type: projectData.project_type,
        estimated_hours: projectData.estimated_hours || 0,
        budget_amount: projectData.budget_amount || 0,
        start_date: projectData.start_date ? new Date(projectData.start_date).toISOString() : new Date().toISOString(),
        end_date: projectData.end_date ? new Date(projectData.end_date).toISOString() : new Date().toISOString(),
        active: projectData.active ?? true,
      };

      const response = await axios.put(`${buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS)}/${id}`, cleanedData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      setIsUpdating(false);
      return {
        success: true,
        data: response.data,
      };
    } catch (err: unknown) {
      let errorMessage = 'Error updating project';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
        if (errorObj?.response?.status === 500) {
          errorMessage = 'Error del servidor. Verifica que los IDs de empleados/clientes existan en la base de datos.';
        } else {
          errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error updating project';
        }
      }
      
      setError(errorMessage);
      setIsUpdating(false);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Delete project
  const deleteProject = async (id: string): Promise<DeleteProjectResponse> => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await axios.delete(`${buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS)}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      setIsDeleting(false);
      return {
        success: true,
        data: response.data,
      };
    } catch (err: unknown) {
      let errorMessage = 'Error deleting project';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
        errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error deleting project';
      }
      
      setError(errorMessage);
      setIsDeleting(false);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    isLoading,
    isLoadingProject,
    isUpdating,
    isDeleting,
    error,
    projects,
  };
};
