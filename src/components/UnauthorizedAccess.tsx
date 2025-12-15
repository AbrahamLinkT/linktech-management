"use client";

import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export function UnauthorizedAccess() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-6 text-center">
        <div className="rounded-full bg-red-100 p-6 dark:bg-red-900/20">
          <ShieldAlert className="h-16 w-16 text-red-600 dark:text-red-400" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            Permisos no habilitados
          </h1>
          <p className="max-w-md text-lg text-gray-600 dark:text-gray-400">
            No tienes acceso a esta sección del sistema.
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Si necesitas acceso a este módulo, por favor comunícate con tu{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              jefe de área
            </span>{" "}
            para solicitar los permisos correspondientes.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="mt-4 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  );
}
