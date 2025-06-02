import React from 'react';
import Link from 'next/link';

const modules = [
  {
    title: 'Gestión de Proyectos',
    description: 'Administra el ciclo de vida completo de proyectos SAP',
    href: '/dashboard/projects',
  },
  {
    title: 'Plan de Facturación',
    description: 'Gestiona planes de facturación y seguimiento de pagos',
    href: '/dashboard/billing',
  },
  {
    title: 'Métricas',
    description: 'Visualiza KPIs y métricas importantes del negocio',
    href: '/dashboard/metrics',
  },
  {
    title: 'Consultores',
    description: 'Gestiona la disponibilidad y asignación de consultores',
    href: '/dashboard/consultants',
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((module) => (
          <Link
            key={module.href}
            href={module.href}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
          >
            <h2 className="text-xl font-semibold text-blue-700">{module.title}</h2>
            <p className="mt-2 text-gray-600">{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}