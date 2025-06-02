import React from 'react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-700">Dashboard</h1>
            <button className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Proyectos Activos</h2>
            <p className="text-gray-600">Visualiza y gestiona tus proyectos SAP actuales</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Soporte Técnico</h2>
            <p className="text-gray-600">Accede a tu portal de soporte y tickets</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">Documentación</h2>
            <p className="text-gray-600">Consulta documentos y recursos importantes</p>
          </div>
        </div>
      </main>
    </div>
  );
}