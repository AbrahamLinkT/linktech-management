import { useState } from 'react';
import axios from 'axios';

// Interfaz para el payload del proyecto según el endpoint
interface ProjectPayload {
  name: string;
  description: string;
  status: boolean;
  start_date: string; // ISO string format with milliseconds
  end_date: string; // ISO string format with milliseconds
  oi: string; // Orden interna
  id_project_manager: number | null;
  client_id: number; // Requerido, no puede ser null
}

// Interfaz para el proyecto que viene del GET
interface Project {
  id: number;
  name: string;
  description: string;
  status: boolean;
  start_date: string;
  end_date: string;
  oi: string;
  id_project_manager: number | null;
  client_id: number | null;
  created_at?: string;
  updated_at?: string;
}

interface CreateProjectResponse {
  success: boolean;
  data?: unknown;
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
  data?: unknown;
  error?: string;
}

export const useProjects = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todos los proyectos
  const getProjects = async (): Promise<GetProjectsResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching projects from API...');
      const response = await axios.get('http://13.56.13.129/projects', {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 segundos timeout
      });

      console.log('API Response:', response.data);
      setIsLoading(false);
      return {
        success: true,
        data: response.data,
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
      // Limpiar datos antes de enviar - convertir 0 a null para evitar problemas de FK
      // Ajustar formato de fechas para incluir milisegundos
      const cleanedData = {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        start_date: projectData.start_date ? new Date(projectData.start_date).toISOString() : new Date().toISOString(),
        end_date: projectData.end_date ? new Date(projectData.end_date).toISOString() : new Date().toISOString(),
        oi: projectData.oi,
        id_project_manager: projectData.id_project_manager === 0 ? null : projectData.id_project_manager,
        client_id: projectData.client_id, // No convertir a null, debe ser un ID válido
      };

      const response = await axios.post('http://13.56.13.129/projects', cleanedData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 segundos timeout
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

  // Función para obtener un proyecto por ID
  const getProjectById = async (id: string): Promise<GetProjectResponse> => {
    setIsLoadingProject(true);
    setError(null);

    try {
      const response = await axios.get(`http://13.56.13.129/projects/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 segundos timeout
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

  // Función para actualizar un proyecto
  const updateProject = async (id: string, projectData: ProjectPayload): Promise<UpdateProjectResponse> => {
    setIsUpdating(true);
    setError(null);

    try {
      // Limpiar datos antes de enviar
      const cleanedData = {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        start_date: projectData.start_date ? new Date(projectData.start_date).toISOString() : new Date().toISOString(),
        end_date: projectData.end_date ? new Date(projectData.end_date).toISOString() : new Date().toISOString(),
        oi: projectData.oi,
        id_project_manager: projectData.id_project_manager === 0 ? null : projectData.id_project_manager,
        client_id: projectData.client_id, // No convertir a null, debe ser un ID válido
      };

      const response = await axios.put(`http://13.56.13.129/projects/${id}`, cleanedData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 segundos timeout
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

  return {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    isLoading,
    isLoadingProject,
    isUpdating,
    error,
  };
};