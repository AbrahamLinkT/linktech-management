import { useState, useEffect } from 'react';
import axios from 'axios';
import { buildApiUrl, API_CONFIG } from '../config/api';

// Interfaz para el formulario de asueto (ahora con nuevos campos opcionales)
interface AsuetoFormData {
  employee_id: number;
  startDate?: string; // ISO string format (POST)
  endDate?: string; // ISO string format (POST)
  status?: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approved_by?: number | null;
  reason?: string | null;
}

interface CreateAsuetoResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

// Interfaz para la respuesta del GET, nueva estructura completa
export interface AsuetoResponse {
  id: string | number;
  employee_id?: number;
  name?: string; // El API ahora puede devolver name directamente
  startDate: string;
  endDate: string;
  reason?: string | null;
  approvedByName?: string | null;
  approvedAt?: string | null;
  status?: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  createdAt?: string;
  updatedAt?: string;
}

export const useAsuetos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para crear un asueto
  const createAsueto = async (asuetoData: AsuetoFormData): Promise<CreateAsuetoResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating asueto with data:', asuetoData);
      console.log('JSON stringified data:', JSON.stringify(asuetoData, null, 2));

      const response = await axios.post(buildApiUrl(API_CONFIG.ENDPOINTS.NON_WORKING_DAYS), asuetoData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000, // Reducir timeout a 10 segundos
      });

      console.log('Asueto created successfully:', response.data);
      
      setIsLoading(false);
      return {
        success: true,
        data: response.data,
      };
    } catch (err: unknown) {
      console.error('Full error object:', err);
      
      // Log detalles específicos del error Axios
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:');
        console.error('Status:', err.response?.status);
        console.error('Status text:', err.response?.statusText);
        console.error('Response data:', err.response?.data);
        console.error('Request config:', err.config);
      }
      
      let errorMessage = 'Error creating asueto';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
        errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error creating asueto';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Función para obtener todos los asuetos
  const getAsuetos = async (): Promise<AsuetoResponse[]> => {
    try {
      console.log('📥 Obteniendo asuetos desde:', buildApiUrl(API_CONFIG.ENDPOINTS.NON_WORKING_DAYS));
      
      const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.NON_WORKING_DAYS), {
        timeout: 30000,
      });
      
      console.log('✅ Respuesta cruda de asuetos:', response.data);
      
      // Verificar si la respuesta es un array directamente o viene en una estructura paginada
      let asuetoData: AsuetoResponse[] = [];
      
      if (Array.isArray(response.data)) {
        asuetoData = response.data;
        console.log('📋 Datos como array directo:', asuetoData.length, 'asuetos');
      } else if (response.data && Array.isArray(response.data.content)) {
        asuetoData = response.data.content;
        console.log('📋 Datos en estructura paginada:', asuetoData.length, 'asuetos');
      } else if (response.data) {
        console.log('📋 Estructura de datos desconocida:', response.data);
      }
      
      console.log('📊 Primer asueto como ejemplo:', asuetoData[0]);
      return asuetoData || [];
    } catch (err) {
      console.error('❌ Error obteniendo asuetos:', err);
      throw err;
    }
  };

  // Función para actualizar un asueto existente
  const updateAsueto = async (id: string, asuetoData: AsuetoFormData): Promise<CreateAsuetoResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('📝 Updating asueto with ID:', id, 'and data:', asuetoData);
      console.log('JSON stringified data:', JSON.stringify(asuetoData, null, 2));

      // El endpoint PUT ahora espera el id en el payload junto con employee_id, status, approved_by y reason
      const payload = {
        id: Number(id),
        ...asuetoData,
      };

      const response = await axios.put(`${buildApiUrl(API_CONFIG.ENDPOINTS.NON_WORKING_DAYS)}/${id}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000, // Reducir timeout a 10 segundos
      });

      console.log('Asueto updated successfully:', response.data);
      
      setIsLoading(false);
      return {
        success: true,
        data: response.data,
      };
    } catch (err: unknown) {
      console.error('Full error object:', err);
      
      // Log detalles específicos del error Axios
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:');
        console.error('Status:', err.response?.status);
        console.error('Status text:', err.response?.statusText);
        console.error('Response data:', err.response?.data);
        console.error('Request config:', err.config);
      }
      
      let errorMessage = 'Error updating asueto';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
        errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error updating asueto';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Función para eliminar un asueto
  const deleteAsueto = async (id: string): Promise<CreateAsuetoResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🗑️ Deleting asueto with ID:', id);

      const response = await axios.delete(`${buildApiUrl(API_CONFIG.ENDPOINTS.NON_WORKING_DAYS)}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 10000, // Reducir timeout a 10 segundos
      });

      console.log('Asueto deleted successfully:', response.data);
      
      setIsLoading(false);
      return {
        success: true,
        data: response.data,
      };
    } catch (err: unknown) {
      console.error('Full error object:', err);
      
      // Log detalles específicos del error Axios
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:');
        console.error('Status:', err.response?.status);
        console.error('Status text:', err.response?.statusText);
        console.error('Response data:', err.response?.data);
        console.error('Request config:', err.config);
      }
      
      let errorMessage = 'Error deleting asueto';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
        errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error deleting asueto';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  return {
    createAsueto,
    updateAsueto,
    deleteAsueto,
    getAsuetos,
    isLoading,
    error,
  };
};

// Hook para auto-cargar los asuetos
export const useAutoLoadAsuetos = () => {
  const [asuetos, setAsuetos] = useState<AsuetoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAsuetos = async () => {
      try {
        setIsLoading(true);
        console.log('📥 Obteniendo asuetos desde:', buildApiUrl(API_CONFIG.ENDPOINTS.NON_WORKING_DAYS));
        
        const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.NON_WORKING_DAYS), {
          timeout: 10000, // Reducir timeout a 10 segundos
        });
        
        console.log('✅ Respuesta cruda autoload:', response.data);
        
        // Verificar si la respuesta es un array directamente o viene en una estructura paginada
        let asuetoData: AsuetoResponse[] = [];
        
        if (Array.isArray(response.data)) {
          asuetoData = response.data;
          console.log('📋 Autoload - datos como array directo:', asuetoData.length, 'asuetos');
        } else if (response.data && Array.isArray(response.data.content)) {
          asuetoData = response.data.content;
          console.log('📋 Autoload - datos en estructura paginada:', asuetoData.length, 'asuetos');
        } else if (response.data) {
          console.log('📋 Autoload - estructura de datos desconocida:', response.data);
        }
        
        console.log('📊 Autoload - primer asueto:', asuetoData[0]);
        setAsuetos(asuetoData || []);
        setError(null);
      } catch (err) {
        console.error('❌ Error cargando asuetos:', err);
        setError('Error al cargar los asuetos');
        setAsuetos([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadAsuetos();
  }, []);

  const refetch = async () => {
    try {
      setIsLoading(true);
      console.log('📥 Recargando asuetos desde:', buildApiUrl(API_CONFIG.ENDPOINTS.NON_WORKING_DAYS));
      
      const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.NON_WORKING_DAYS), {
        timeout: 30000,
      });
      
      console.log('✅ Asuetos recargados:', response.data?.length || 0, 'asuetos');
      setAsuetos(response.data || []);
      setError(null);
    } catch (err) {
      console.error('❌ Error recargando asuetos:', err);
      setError('Error al recargar los asuetos');
    } finally {
      setIsLoading(false);
    }
  };

  return { asuetos, isLoading, error, refetch };
};