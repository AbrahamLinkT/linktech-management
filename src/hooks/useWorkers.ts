"use client";
import { useEffect, useState } from "react";
import { buildApiUrl, API_CONFIG } from '../config/api';

export function useWorkers() {
  const [data, setData] = useState([]);
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

  return { data, loading };
}
