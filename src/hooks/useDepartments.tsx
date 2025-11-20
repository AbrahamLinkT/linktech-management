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

export function useDepartments() {
  const [data, setData] = useState<DepartmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================
  // GET DEPARTMENTS
  // ============================
  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://13.56.13.129/department");

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const json = await res.json();

      const mapped: DepartmentItem[] = json.map((item: any) => ({
        id: item.id.toString(),
        departamento: item.name,
        nombreCorto: item.short_name,
        descripcion: item.description,
      }));

      setData(mapped);
    } catch (err: any) {
      setError(err.message ?? "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // ============================
  // POST DEPARTMENT
  // ============================
  const createDepartment = async (body: CreateDepartmentDto) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://13.56.13.129/department", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      // refrescar lista
      await fetchDepartments();

      return true;
    } catch (err: any) {
      setError(err.message ?? "Error desconocido");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return { data, loading, error, createDepartment };
}
