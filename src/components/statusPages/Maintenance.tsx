// src/components/statusPages/Maintenance.tsx

import { AlertTriangle } from "lucide-react";

const Maintenance = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
            <AlertTriangle className="text-yellow-500 w-16 h-16 mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Sitio en mantenimiento</h1>
            <p className="text-gray-600 max-w-md">
                Estamos realizando tareas de mantenimiento para mejorar tu experiencia. Por favor, vuelve a intentarlo más tarde.
            </p>
            <p className="mt-4 text-sm text-gray-500">Última actualización: 30 de julio, 2025</p>
        </div>
    );
};

export default Maintenance;
