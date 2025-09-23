// Este store es para el contador de horas por aprobar
import { useState, useEffect } from "react";

export function useHorasPorAprobar() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function fetchHoras() {
      try {
        const res = await fetch("/data/staff_horas.json");
        const data = await res.json();
        // Suponiendo que las horas pendientes tienen un campo 'estatus' = 'Pendiente'
        const pendientes = data.staff.filter((h) => h.estatus === "Pendiente");
        setCount(pendientes.length);
      } catch (e) {
        setCount(0);
      }
    }
    fetchHoras();
  }, []);

  return count;
}
