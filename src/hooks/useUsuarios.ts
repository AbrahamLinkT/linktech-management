"use client";
import { useEffect, useState } from "react";
import { buildApiUrl, API_CONFIG } from "../config/api";

export interface DepartmentHeadItem {
  id: string;
  id_department: number;
  id_worker: number;
  departmentName?: string;
  workerName?: string;
}

interface DepartmentHeadApiResponse {
  id: number;
  department: number;
  department_name: string;
  worker: number;
  worker_name: string;
}

interface DepartmentApiItem {
  id: number;
  name: string;
  short_name: string;
  description: string;
}

interface WorkerItem {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status?: boolean;
  // otras props ignoradas
}

interface CreateDepartmentHeadDto {
  id_department: number;
  id_worker: number;
}

export function useUsuarios() {
  const [data, setData] = useState<DepartmentHeadItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentApiItem[]>([]);
  const [workers, setWorkers] = useState<WorkerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingDepsWorkers, setLoadingDepsWorkers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // =====================================
  // GET Department Heads
  // =====================================
  const fetchDepartmentHeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENT_HEADS+"/dto"));
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const json: DepartmentHeadApiResponse[] = await res.json();

      // ensure departments and workers are loaded (names) to map; if not available map with empty strings
      const mapped: DepartmentHeadItem[] = json.map((item) => {
        //Esto usualmente se rellena despues de hacer el editar o crear
        //const dept = departments.find((d) => d.id === item.department);
        //const worker = workers.find((w) => w.id === item.worker);
        return {
          id: item.id.toString(),
          id_department: item.department,
          id_worker: item.worker,
          departmentName: item.department_name,
          workerName: item.worker_name,
        };
      });

      setData(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // GET Departments
  // =====================================
  const fetchDepartments = async () => {
    setLoadingDepsWorkers(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENTS));
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const json: DepartmentApiItem[] = await res.json();
      setDepartments(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoadingDepsWorkers(false);
    }
  };

  // =====================================
  // GET Workers
  // =====================================
  const fetchWorkers = async () => {
    setLoadingDepsWorkers(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS));
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const json = await res.json();
      // según el ejemplo, worker viene en { content: [...] }
      const list: WorkerItem[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.content)
        ? json.content
        : [];
      setWorkers(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoadingDepsWorkers(false);
    }
  };

  // =====================================
  // POST
  // =====================================
  const createDepartmentHead = async (body: CreateDepartmentHeadDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENT_HEADS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      // refrescar lista
      await fetchDepartmentHeads();
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
  const deleteDepartmentHeads = async (ids: string[]) => {
    if (ids.length === 0) return false;
    setDeleting(true);
    setError(null);
    try {
      for (const id of ids) {
        const res = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENT_HEADS)}/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error(`Falló eliminar id=${id}, status: ${res.status}`);
        }
      }
      await fetchDepartmentHeads();
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
  const updateDepartmentHead = async (id: string, body: CreateDepartmentHeadDto) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENT_HEADS)}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      await fetchDepartmentHeads();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales: primero departments & workers (para nombres), luego heads
  useEffect(() => {
    (async () => {
      await Promise.all([fetchDepartments(), fetchWorkers()]);
      // después de tener departments y workers, fetch heads para mapear nombres correctamente
      await fetchDepartmentHeads();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    departments,
    workers,
    loading,
    loadingDepsWorkers,
    deleting,
    error,
    createDepartmentHead,
    deleteDepartmentHeads,
    updateDepartmentHead,
    fetchDepartmentHeads,
  };
}
