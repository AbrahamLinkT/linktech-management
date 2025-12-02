import { useState, useEffect } from 'react';
import axios from 'axios';
import { buildApiUrl, API_CONFIG } from '../config/api';

// Interfaz para el cliente
interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  created_at?: string;
  updated_at?: string;
}

interface GetClientsResponse {
  success: boolean;
  data?: Client[];
  error?: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todos los clientes
  const getClients = async (): Promise<GetClientsResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.CLIENTS), {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 segundos timeout
      });

      console.log('Clients API Response:', response.data);
      setClients(response.data);
      setIsLoading(false);
      return {
        success: true,
        data: response.data,
      };
    } catch (err: unknown) {
      console.error('Error fetching clients:', err);
      let errorMessage = 'Error fetching clients';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
        errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error fetching clients';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Hook para cargar clientes automáticamente
  const useAutoLoadClients = () => {
    useEffect(() => {
      getClients();
    }, []);
  };

  return {
    clients,
    getClients,
    useAutoLoadClients,
    isLoading,
    error,
  };
};