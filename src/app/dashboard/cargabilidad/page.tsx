"use client";
import CargabilidadComponent from '@/components/cargabilidad/Cargabilidad';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Cargabilidad() {
  return (
    <ProtectedRoute requiredPermission="cargabilidad">
      <CargabilidadComponent />
    </ProtectedRoute>
  );
}