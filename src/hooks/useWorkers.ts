"use client";
import { useEffect, useState } from "react";

export function useWorkers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("http://13.56.13.129/worker");
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
