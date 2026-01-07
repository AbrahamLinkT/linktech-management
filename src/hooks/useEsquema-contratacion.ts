"use client";
import { useEffect, useState } from "react";
import { buildApiUrl, API_CONFIG } from "../config/api";

export interface EsquemaItem {
  id: string;
  name: string;
  description: string;
  hours: string;
  working_days?: string;
  active?: boolean;
}

interface EsquemaApiResponse {
  id: number;
  name: string;
  description: string;
  hours: string;
  working_days?: string;
  active?: boolean;
}

interface CreateEsquemaDto {
  name: string;
  description: string;
  hours: string;
  working_days?: string;
  active?: boolean;
}

export function useEsquemaContratacion() {
  const [data, setData] = useState<EsquemaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // =====================================
  // GET
  // =====================================
  const fetchEsquemas = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORK_SCHEDULE));

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const json: EsquemaApiResponse[] = await res.json();

      const mapped: EsquemaItem[] = json.map((item) => ({
        id: item.id.toString(),
        name: item.name,
        description: item.description,
        hours: item.hours,
        working_days: item.working_days ?? "",
        active: item.active ?? true,
      }));

      setData(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // POST
  // =====================================
  const createEsquema = async (body: CreateEsquemaDto) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORK_SCHEDULE), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      await fetchEsquemas();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // DELETE múltiples
  // =====================================
  const deleteEsquemas = async (ids: string[]) => {
    if (ids.length === 0) return false;

    setDeleting(true);
    setError(null);

    try {
      for (const id of ids) {
        const res = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.WORK_SCHEDULE)}/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error(`Falló eliminar id=${id}, status: ${res.status}`);
        }
      }

      await fetchEsquemas();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return false;
    } finally {
      setDeleting(false);
    }
  };

  // =====================================
  // PUT
  // =====================================
  const updateEsquema = async (id: string, body: CreateEsquemaDto) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.WORK_SCHEDULE)}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      await fetchEsquemas();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEsquemas();
  }, []);

  return {
    data,
    loading,
    deleting,
    error,
    createEsquema,
    deleteEsquemas,
    updateEsquema,
  };
}
