"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { buildApiUrl, API_CONFIG } from '../config/api';

export interface WorkerData {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: boolean;
  location: string;
  description: string;
  roleId?: number | null;
  schemeId?: number | null;
  levelId?: number | null;
  roleName?: string;
  schemeName?: string;
  levelName?: string;
}

export interface WorkerPayload {
  name: string;
  email: string;
  phone: string;
  status: boolean;
  location: string;
  description: string;
  roleId?: number | null;
  schemeId?: number | null;
  levelId?: number | null;
}

export function useWorkers() {
  const [data, setData] = useState<WorkerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS));
        const json = await res.json();
        setData(json.content || []);
      } catch (e) {
        console.error("Error cargando workers:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Obtener un trabajador específico por ID
  const getWorkerById = async (id: number): Promise<WorkerData | null> => {
    try {
      // Como el backend no tiene endpoint individual GET /worker/:id,
      // obtenemos todos y filtramos localmente
      const response = await axios.get<{ content: WorkerData[] }>(
        buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS),
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );
      
      const workers = response.data.content || [];
      const worker = workers.find(w => w.id === id);
      return worker || null;
    } catch (error) {
      console.error('Error fetching worker:', error);
      return null;
    }
  };

  // Actualizar un trabajador
  const updateWorker = async (id: number, payload: WorkerPayload): Promise<boolean> => {
    try {
      await axios.put(
        `${buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS)}/${id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );
      return true;
    } catch (error) {
      console.error('Error updating worker:', error);
      return false;
    }
  };

  // Crear un nuevo trabajador
  const createWorker = async (payload: WorkerPayload): Promise<WorkerData | null> => {
    try {
      const response = await axios.post<WorkerData>(
        buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS),
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating worker:', error);
      return null;
    }
  };

  return { 
    data, 
    loading,
    getWorkerById,
    updateWorker,
    createWorker,
  };
}
