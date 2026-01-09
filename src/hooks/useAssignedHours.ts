import { useState } from 'react';
import axios from 'axios';
import { buildApiUrl, API_CONFIG } from '../config/api';

// Interfaz para las horas por día
interface HoursData {
  monday: number | null;
  tuesday: number | null;
  wednesday: number | null;
  thursday: number | null;
  friday: number | null;
  saturday: number | null;
  sunday: number | null;
  total: number;
  week: string;
}

// Interfaz para la respuesta de horas asignadas
export interface AssignedHour {
  id: number;
  projectId: number;
  projectName: string;
  assignedTo: number;
  nameAssignedTo: string;
  assignedBy: number;
  nameAssignedBy: string;
  hoursData: HoursData;
}

// Interfaz para trabajador
interface Worker {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: boolean;
  location: string;
  description: string;
  roleId: number | null;
  schemeId: number | null;
  levelId: number | null;
  roleName: string | null;
  schemeName: string | null;
  levelName: string | null;
}

export const useAssignedHours = () => {
  const [assignedHours, setAssignedHours] = useState<AssignedHour[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener todas las horas asignadas
  const getAssignedHours = async (): Promise<AssignedHour[]> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching assigned hours from:', buildApiUrl(API_CONFIG.ENDPOINTS.ASSIGNED_HOURS));
      const response = await axios.get<AssignedHour[]>(
        buildApiUrl(API_CONFIG.ENDPOINTS.ASSIGNED_HOURS),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      console.log('Assigned hours response:', response.data);
      const data = Array.isArray(response.data) ? response.data : [];
      setAssignedHours(data);
      setIsLoading(false);
      return data;
    } catch (err: unknown) {
      console.error('Error fetching assigned hours:', err);
      let errorMessage = 'Error fetching assigned hours';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as {
          response?: { data?: { message?: string }; status?: number };
          message?: string;
        };
        errorMessage =
          errorObj?.response?.data?.message ||
          errorObj?.message ||
          'Error fetching assigned hours';
      }

      setError(errorMessage);
      setIsLoading(false);
      return [];
    }
  };

  // Obtener horas asignadas por proyecto ID
  const getAssignedHoursByProjectId = async (projectId: number): Promise<AssignedHour[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const allHours = await getAssignedHours();
      const filtered = allHours.filter((hour) => hour.projectId === projectId);
      setIsLoading(false);
      return filtered;
    } catch (err: unknown) {
      console.error('Error filtering assigned hours:', err);
      setError('Error filtering assigned hours');
      setIsLoading(false);
      return [];
    }
  };

  // Obtener empleados para horas asignadas
  const getWorkersForAssignedHours = async (assignedHoursList: AssignedHour[]): Promise<Worker[]> => {
    try {
      console.log('Fetching workers from:', buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS));
      const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS), {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });

      console.log('Workers response:', response.data);

      // Extraer el array de workers dependiendo de la estructura de respuesta
      const workers: Worker[] = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      // Obtener los IDs únicos de assignedTo
      const assignedToIds = new Set(assignedHoursList.map((h) => h.assignedTo));

      // Filtrar workers que tienen horas asignadas
      return workers.filter((worker) => assignedToIds.has(worker.id));
    } catch (err: unknown) {
      console.error('Error fetching workers:', err);
      setError('Error fetching workers');
      return [];
    }
  };

  // Eliminar horas asignadas por ID
  const deleteAssignedHour = async (id: number): Promise<boolean> => {
    try {
      console.log('Deleting assigned hour with ID:', id);
      await axios.delete(`${buildApiUrl(API_CONFIG.ENDPOINTS.ASSIGNED_HOURS)}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });
      console.log('✅ Assigned hour deleted successfully');
      return true;
    } catch (err: unknown) {
      console.error('Error deleting assigned hour:', err);
      let errorMessage = 'Error deleting assigned hour';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as {
          response?: { data?: { message?: string }; status?: number };
          message?: string;
        };
        errorMessage =
          errorObj?.response?.data?.message ||
          errorObj?.message ||
          'Error deleting assigned hour';
      }

      setError(errorMessage);
      return false;
    }
  };

  // Crear horas asignadas (POST)
  interface CreateAssignedHourPayload {
    project_id: number;
    assigned_to: number;
    assigned_by: number;
    hours_data: {
      monday: number;
      tuesday: number;
      wednesday: number;
      thursday: number;
      friday: number;
      saturday: number;
      sunday: number;
      total: number;
      week: string;
    };
  }

  const createAssignedHours = async (payload: CreateAssignedHourPayload[]): Promise<boolean> => {
    try {
      console.log('Creating assigned hours:', payload);

      // Some backends expect a single object, not an array.
      const items = Array.isArray(payload) ? payload : [payload as any];

      // Fallback week if empty string
      const ensureWeek = (week: string) => {
        if (week && week.trim().length > 0) return week;
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`; // default to today's date
      };

      // Post items individually to match API expectations
      for (const item of items) {
        const body = {
          project_id: item.project_id,
          assigned_to: item.assigned_to,
          assigned_by: item.assigned_by,
          hours_data: {
            monday: item.hours_data.monday ?? 0,
            tuesday: item.hours_data.tuesday ?? 0,
            wednesday: item.hours_data.wednesday ?? 0,
            thursday: item.hours_data.thursday ?? 0,
            friday: item.hours_data.friday ?? 0,
            saturday: item.hours_data.saturday ?? 0,
            sunday: item.hours_data.sunday ?? 0,
            total: item.hours_data.total ?? 0,
            week: ensureWeek(item.hours_data.week ?? ''),
          },
        };

        const res = await axios.post(
          buildApiUrl(API_CONFIG.ENDPOINTS.ASSIGNED_HOURS),
          body,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 30000,
          }
        );

        if (res.status < 200 || res.status >= 300) {
          throw new Error(`HTTP ${res.status}`);
        }
      }

      console.log('✅ Assigned hours created successfully');
      return true;
    } catch (err: unknown) {
      console.error('Error creating assigned hours:', err);
      let errorMessage = 'Error creating assigned hours';

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as { message?: string };
        errorMessage = errorObj?.message || 'Error creating assigned hours';
      }

      setError(errorMessage);
      return false;
    }
  };

  return {
    assignedHours,
    isLoading,
    error,
    getAssignedHours,
    getAssignedHoursByProjectId,
    getWorkersForAssignedHours,
    deleteAssignedHour,
    createAssignedHours,
  };
};
