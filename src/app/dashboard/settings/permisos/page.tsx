"use client";
import { useState } from "react";

const roles = ["Admin", "Manager", "Empleado"];
const secciones = [
  { label: "Inicio", path: "/dashboard" },
  { label: "Proyectos", path: "/dashboard/projects" },
  { label: "Workers", path: "/dashboard/workers" },
  { label: "Nuevo trabajador", path: "/dashboard/new_worker" },
  { label: "Solicitud de horas", path: "/dashboard/solicitud_horas" },
  { label: "Disponibilidad", path: "/dashboard/disponibilidad" },
  { label: "Cargabilidad", path: "/dashboard/cargabilidad" },
  { label: "Departamento", path: "/dashboard/departamento" },
  { label: "Esquema contractual", path: "/dashboard/esquema-contratacion" },
  { label: "Especialidades", path: "/dashboard/especialidades" },
  { label: "Asuetos", path: "/dashboard/asuetos" },
  { label: "Clientes", path: "/dashboard/client" },
  { label: "Roles", path: "/settings/roles" },
  { label: "Permisos", path: "/settings/permisos" },
  { label: "Configuracion", path: "/settings" },
];

type Permisos = {
  [rol: string]: {
    [seccion: string]: boolean;
  };
};

const defaultPermisos: Permisos = {};
roles.forEach((rol) => {
  defaultPermisos[rol] = {};
  secciones.forEach((sec) => {
    defaultPermisos[rol][sec.label] = rol === "Admin"; // Admin tiene acceso por defecto
  });
});

export default function PermisosPage() {
  const [permisos, setPermisos] = useState<Permisos>(defaultPermisos);

  const handleCheckbox = (rol: string, seccion: string) => {
    setPermisos((prev) => ({
      ...prev,
      [rol]: {
        ...prev[rol],
        [seccion]: !prev[rol][seccion],
      },
    }));
  };

  const handleGuardar = () => {
    // Aquí puedes agregar la lógica para guardar los permisos (API, localStorage, etc.)
    alert("Permisos guardados correctamente.");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Permisos</h1>
      <p className="text-gray-600 mb-6">Gestiona qué roles pueden acceder a cada sección del sistema.</p>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Sección</th>
              {roles.map((rol) => (
                <th key={rol} className="px-4 py-2 text-center">{rol}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {secciones.map((sec) => (
              <tr key={sec.label}>
                <td className="border px-4 py-2 font-medium">{sec.label}</td>
                {roles.map((rol) => (
                  <td key={rol} className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={permisos[rol][sec.label]}
                      onChange={() => handleCheckbox(rol, sec.label)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={handleGuardar}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 shadow"
      >
        Guardar
      </button>
    </div>
  );
}
