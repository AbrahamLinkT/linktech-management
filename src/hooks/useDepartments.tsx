"use client";
import { useEffect, useState } from "react";

export interface DepartmentItem {
  id: string;
  departamento: string;
  nombreCorto: string;
  descripcion: string;
}

interface CreateDepartmentDto {
  name: string;
  short_name: string;
  description: string;
}

interface DepartmentApiResponse {
  id: number;
  name: string;
  short_name: string;
  description: string;
}

export function useDepartments() {
  const [data, setData] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // =====================================
  // GET
  // =====================================
  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENTS));

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const json: DepartmentApiResponse[] = await res.json();

      const mapped: DepartmentItem[] = json.map((item) => ({
        id: item.id.toString(),
        departamento: item.name,
        nombreCorto: item.short_name,
        descripcion: item.description,
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
  const createDepartment = async (body: CreateDepartmentDto) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      await fetchDepartments();
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
  const deleteDepartments = async (ids: string[]) => {
    if (ids.length === 0) return false;

    setDeleting(true);
    setError(null);

    try {
      for (const id of ids) {
        const res = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENTS)}/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error(`Falló eliminar id=${id}, status: ${res.status}`);
        }
      }

      await fetchDepartments();
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
  const updateDepartment = async (id: string, body: CreateDepartmentDto) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.DEPARTMENTS)}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      await fetchDepartments();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return {
    data,
    loading,
    deleting,
    error,
    createDepartment,
    deleteDepartments,
    updateDepartment
  };
}
