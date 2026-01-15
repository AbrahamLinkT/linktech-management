"use client";
import { useEffect, useState } from "react";
import { buildApiUrl, API_CONFIG } from "../config/api";

export interface DepartmentHeadItem {
  id: string;
  id_department: number;
  id_worker: number;
  departmentName?: string;
  workerName?: string;
  start_date?: string | null;
  end_date?: string | null;
  active?: boolean;
}

// Respuesta DTO enriquecida
interface DepartmentHeadDto {
  id: number;
  department: number;
  department_name: string;
  worker: number;
  worker_name: string;
  start_date?: string | null;
  end_date?: string | null;
  active?: boolean;
}

// Respuesta mínima sin DTO
interface DepartmentHeadRaw {
  id: number;
  id_department: number;
  id_worker: number;
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
  start_date?: string; // YYYY-MM-DD
  end_date?: string | null; // YYYY-MM-DD or null
  active?: boolean;
}

interface DepartmentHeadDetail {
  id: number;
  id_department: number;
  id_worker: number;
  start_date?: string | null;
  end_date?: string | null;
  active?: boolean;
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
      // Intentar DTO primero
      let mapped: DepartmentHeadItem[] = [];
      const dtoUrl = buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENT_HEADS+"/dto");
      try {
        const resDto = await fetch(dtoUrl);
        if (resDto.ok) {
          const json: DepartmentHeadDto[] = await resDto.json();
          mapped = json.map((item) => ({
            id: item.id.toString(),
            id_department: item.department,
            id_worker: item.worker,
            departmentName: item.department_name,
            workerName: item.worker_name,
            start_date: item.start_date ?? null,
            end_date: item.end_date ?? null,
            active: item.active ?? true,
          }));
        } else {
          throw new Error(`DTO no disponible: ${resDto.status}`);
        }
      } catch (_) {
        // Fallback a respuesta mínima
        const resRaw = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENT_HEADS));
        if (!resRaw.ok) throw new Error(`Error HTTP: ${resRaw.status}`);
        const raw: DepartmentHeadRaw[] = await resRaw.json();
        mapped = raw.map((item) => {
          const dept = departments.find((d) => d.id === item.id_department);
          const worker = workers.find((w) => w.id === item.id_worker);
          return {
            id: item.id.toString(),
            id_department: item.id_department,
            id_worker: item.id_worker,
            departmentName: dept?.name,
            workerName: worker?.name,
            start_date: undefined,
            end_date: undefined,
            active: undefined,
          };
        });
      }

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

  // =====================================
  // GET por ID (detalle)
  // =====================================
  const fetchDepartmentHeadById = async (id: string): Promise<DepartmentHeadDetail | null> => {
    try {
      const res = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENT_HEADS)}/${id}`);
      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
      const json = await res.json();
      // Aceptar tanto objeto directo como envuelto
      const item = Array.isArray(json) ? json[0] : json;
      return {
        id: Number(item.id),
        id_department: Number(item.id_department),
        id_worker: Number(item.id_worker),
        start_date: item.start_date ?? null,
        end_date: item.end_date ?? null,
        active: item.active ?? true,
      };
    } catch (err) {
      console.error('Error fetching department head by id:', err);
      return null;
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
    fetchDepartmentHeadById,
  };
}
