"use client";
import { useEffect, useState } from "react";
import { buildApiUrl, API_CONFIG } from "../config/api";

export interface ClientItem {
  id: string;
  clientName: string;
  shortName: string;
  clientCode: string;
  contactEmail: string;
  contactPhone: string;
  active: boolean;
}

interface ClientApiResponse {
  client_id: number;
  client_name: string;
  short_name: string;
  client_code: string;
  contact_email: string;
  contact_phone: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CreateClientDto {
  client_name: string;
  short_name: string;
  client_code: string;
  contact_email?: string;
  contact_phone?: string;
  active?: boolean;
}

export function useClients() {
  const [data, setData] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // =====================================
  // GET
  // =====================================
  const fetchClients = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CLIENTS));

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const json: ClientApiResponse[] = await res.json();

      const mapped: ClientItem[] = json.map((item) => ({
        id: item.client_id.toString(),
        clientName: item.client_name,
        shortName: item.short_name,
        clientCode: item.client_code,
        contactEmail: item.contact_email || '',
        contactPhone: item.contact_phone || '',
        active: item.active,
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
  const createClient = async (body: CreateClientDto) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CLIENTS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData?.error || 
          errorData?.details || 
          `Error HTTP: ${res.status}`
        );
      }

      await fetchClients();
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setError(message);
      console.error('createClient error:', message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // DELETE múltiples
  // =====================================
  const deleteClients = async (ids: string[]) => {
    if (ids.length === 0) return false;

    setDeleting(true);
    setError(null);

    try {
      for (const id of ids) {
        const res = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.CLIENTS)}/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error(`Falló eliminar id=${id}, status: ${res.status}`);
        }
      }

      await fetchClients();
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
  const updateClient = async (id: string, body: CreateClientDto) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.CLIENTS)}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      await fetchClients();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    data,
    loading,
    deleting,
    error,
    createClient,
    deleteClients,
    updateClient,
  };
}
