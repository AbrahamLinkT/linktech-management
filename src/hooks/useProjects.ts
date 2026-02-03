import { useState, useCallback } from 'react';
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
  department_id?: number | null;
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
  department_id?: number | null;
  status: string;
  project_type: string;
  estimated_hours: number;
  budget_amount: number;
  start_date: string;
  end_date: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  department_name?: string;
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

interface FilterPageable {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

interface FilterProjectsResponse {
  success: boolean;
  data?: {
    content: Project[];
    pageable: FilterPageable;
    number: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
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
  const getProjects = useCallback(async (): Promise<GetProjectsResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Intentar obtener desde /projects (contiene employee_id en la respuesta completa)
      const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS), {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      // Manejar varios formatos de respuesta posibles
      const payload = response.data;
      let projectsData: Project[] = [];
      if (Array.isArray(payload)) {
        projectsData = payload;
      } else if (Array.isArray(payload.content)) {
        projectsData = payload.content;
      } else if (Array.isArray(payload.data)) {
        projectsData = payload.data;
      }

      // Fallback: si no obtuvimos datos, intentar /projects/dto (compatibilidad con versiones previas)
      if (!projectsData || projectsData.length === 0) {
        try {
          const dtoRes = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS + '/dto'), {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000,
          });
          const dtoData = dtoRes.data;
          projectsData = Array.isArray(dtoData) ? dtoData : dtoData?.content || [];
        } catch (dtoErr) {
          console.warn('Fallback to /projects/dto failed:', dtoErr);
        }
      }

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
  }, []);

  // Filter projects by departmentId with pagination
  const getProjectsFiltered = useCallback(async (
    departmentId?: number,
    page: number = 0,
    size: number = 20
  ): Promise<FilterProjectsResponse> => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = { page, size };
      if (departmentId) params.departmentId = departmentId;
      const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS + '/filter'), {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
        params,
      });

      const payload = response.data;
      const content: Project[] = Array.isArray(payload?.content) ? payload.content : [];
      setProjects(content);
      setIsLoading(false);
      return {
        success: true,
        data: {
          content,
          pageable: {
            pageNumber: payload?.pageable?.pageNumber ?? page,
            pageSize: payload?.pageable?.pageSize ?? size,
            totalElements: payload?.totalElements ?? content.length,
            totalPages: payload?.totalPages ?? 1,
          },
          number: payload?.number ?? page,
          size: payload?.size ?? size,
          totalElements: payload?.totalElements ?? content.length,
          totalPages: payload?.totalPages ?? 1,
        },
      };
    } catch (err: unknown) {
      let errorMessage = 'Error filtering projects';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
        errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error filtering projects';
      }
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  const createProject = async (projectData: ProjectPayload): Promise<CreateProjectResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const cleanedData: Record<string, any> = {
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

      // incluir department_id si se proporcionó
      if (projectData.department_id != null) {
        cleanedData.department_id = projectData.department_id;
      }

      console.log('📤 Enviando proyecto:', cleanedData);

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
        const errorObj = err as { response?: { data?: { message?: string; details?: string }; status?: number; statusText?: string }; message?: string };
        if (errorObj?.response?.status === 500) {
          errorMessage = `Error del servidor (500): ${errorObj?.response?.data?.message || errorObj?.response?.data?.details || 'Error desconocido. Verifica la consola del servidor.'}`;
          console.error('❌ Error 500:', errorObj?.response?.data);
        } else if (errorObj?.response?.status === 400) {
          errorMessage = `Datos inválidos (400): ${errorObj?.response?.data?.message || 'Verifica que todos los campos sean correctos.'}`;
          console.error('❌ Error 400:', errorObj?.response?.data);
        } else {
          errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error creating project';
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
      console.error('❌ createProject error:', errorMessage);
      
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
      const cleanedData: Record<string, any> = {
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

      // incluir department_id si se proporcionó
      if (projectData.department_id != null) {
        cleanedData.department_id = projectData.department_id;
      }

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
      console.log(`🗑️ Intentando eliminar proyecto ID: ${id}`);
      
      // Intento 1: DELETE /projects/{id}
      console.log(`🌐 Intento 1: DELETE ${buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS)}/${id}`);
      let response = await axios.delete(`${buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS)}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
        validateStatus: () => true,
      });
      
      console.log(`   Status: ${response.status}, Data:`, response.data);

      // Fallback: algunos backends esperan DELETE /projects con body
      if (response.status >= 400) {
        console.log(`🌐 Intento 1 falló. Intento 2: DELETE ${buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS)} con body`);
        response = await axios.delete(buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS), {
          headers: {
            'Content-Type': 'application/json',
          },
          data: { project_id: Number(id) },
          timeout: 30000,
          validateStatus: () => true,
        });
        
        console.log(`   Status: ${response.status}, Data:`, response.data);
        
        if (response.status >= 400) {
          // Intento 3: POST con método DELETE simulado
          console.log(`🌐 Intento 2 falló. Intento 3: POST simulando DELETE`);
          response = await axios.post(buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS + '/delete'), 
            { project_id: Number(id) }, 
            {
              headers: {
                'Content-Type': 'application/json',
              },
              timeout: 30000,
              validateStatus: () => true,
            }
          );
          
          console.log(`   Status: ${response.status}, Data:`, response.data);
          
          if (response.status >= 400) {
            throw new Error(`Delete failed: Tried 3 methods, last status ${response.status}`);
          }
        }
      }

      console.log('✅ Proyecto eliminado exitosamente');
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
        const errorObj = err as { response?: { data?: { message?: string; error?: string }; status?: number }; message?: string };
        if (errorObj?.response?.status === 405) {
          errorMessage = 'El servidor no soporta este método DELETE. Contacta al administrador del backend.';
        } else if (errorObj?.response?.status === 400) {
          errorMessage = `Error de solicitud (400): ${errorObj?.response?.data?.message || errorObj?.response?.data?.error || 'Formato incorrecto'}`;
        } else {
          errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error deleting project';
        }
      }
      
      console.error('❌ deleteProject error:', errorMessage);
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
    getProjectsFiltered,
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
