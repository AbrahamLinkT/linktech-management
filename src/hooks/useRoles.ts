import { useEffect, useState } from "react";
import { buildApiUrl, API_CONFIG } from "@/config/api";

export type RoleItem = {
  id: number;
  name: string;
  shortName: string;
  roleLevel?: number | null;
  isManager: boolean;
  canApproveHours: boolean;
  active: boolean;
};

export const useRoles = () => {
  const [data, setData] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ROLES));
      if (!res.ok) throw new Error(`Error fetching roles: ${res.status}`);
      const json = await res.json();
      const mapped: RoleItem[] = (json || []).map((it: any) => ({
        id: it.id,
        name: it.name ?? it.role_name ?? "",
        shortName: it.short_name ?? it.shortName ?? "",
        roleLevel: it.role_level ?? null,
        isManager: !!it.is_manager,
        canApproveHours: !!it.can_approve_hours,
        active: typeof it.active === "boolean" ? it.active : true,
      }));
      setData(mapped);
    } catch (err: any) {
      setError(err?.message || "Error cargando roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const createRole = async (payload: {
    name: string;
    short_name: string;
    role_level?: number | null;
    is_manager?: boolean;
    can_approve_hours?: boolean;
    active?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ROLES), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error creating role: ${res.status}`);
      await fetchRoles();
      return true;
    } catch (err: any) {
      setError(err?.message || "Error creando rol");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (
    id: string | number,
    payload: {
      name: string;
      short_name: string;
      role_level?: number | null;
      is_manager?: boolean;
      can_approve_hours?: boolean;
      active?: boolean;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.ROLES)}/${id}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error updating role: ${res.status}`);
      await fetchRoles();
      return true;
    } catch (err: any) {
      setError(err?.message || "Error actualizando rol");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteRoles = async (ids: string[] | number[]) => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.ROLES)}/${id}`, {
            method: "DELETE",
          })
        )
      );
      await fetchRoles();
      return true;
    } catch (err: any) {
      setError(err?.message || "Error eliminando rol(es)");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    createRole,
    updateRole,
    deleteRoles,
    refetch: fetchRoles,
  } as const;
};
