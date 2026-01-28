import { useEffect, useState } from "react";
import { buildApiUrl, API_CONFIG } from "@/config/api";

export type LevelItem = {
  id: number;
  name: string;
  shortName: string;
  description?: string;
};

export const useLevels = () => {
  const [data, setData] = useState<LevelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLevels = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LEVELS));
      if (!res.ok) throw new Error(`Error fetching levels: ${res.status}`);
      const json = await res.json();
      // Map backend keys to frontend keys
      const mapped: LevelItem[] = (json || []).map((it: any) => ({
        id: it.id,
        name: it.name,
        shortName: it.short_name ?? it.shortName ?? "",
        description: it.description ?? "",
      }));
      setData(mapped);
    } catch (err: any) {
      setError(err?.message || "Error cargando niveles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  const createLevel = async (payload: { name: string; short_name: string; description?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LEVELS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error creating level: ${res.status}`);
      await fetchLevels();
      return true;
    } catch (err: any) {
      setError(err?.message || "Error creando nivel");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateLevel = async (id: string | number, payload: { name: string; short_name: string; description?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.LEVELS)}/${id}`;
      const res = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Error updating level: ${res.status}`);
      await fetchLevels();
      return true;
    } catch (err: any) {
      setError(err?.message || "Error actualizando nivel");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteLevels = async (ids: string[] | number[]) => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all(
        ids.map((id) =>
          fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.LEVELS)}/${id}`, {
            method: "DELETE",
          })
        )
      );
      await fetchLevels();
      return true;
    } catch (err: any) {
      setError(err?.message || "Error eliminando nivel(es)");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    createLevel,
    updateLevel,
    deleteLevels,
    refetch: fetchLevels,
  } as const;
};
