// Este store es para el contador de horas por aprobar
import { useState, useEffect } from "react";

export function useHorasPorAprobar() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // TODO: Conectar con endpoint real de horas por aprobar desde el backend
    // Por ahora retorna 0 para evitar el error 404
    setCount(0);
  }, []);

  return count;
}
