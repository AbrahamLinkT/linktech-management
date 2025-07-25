
"use client";
import React, { useState, ChangeEvent } from "react";
import { ContentBody, ContentTable } from "@/components/containers/containers";
import { PanelLateral } from "@/components/modal/modals";

interface SearchBarProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2 p-4">
      <input
        type="text"
        placeholder="Buscar"
        value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
        className="border rounded px-4 py-2 w-1/3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      <button
        onClick={onSearch}
        className="border rounded px-4 py-2 bg-white font-semibold hover:bg-blue-50 shadow-sm"
      >
        Buscar
      </button>
    </div>
  );
}

const departments = [
  {
    departamento: "Finanzas",
    responsable: "Juan Pérez",
    responsableAprobacion: "María López",
  },
  {
    departamento: "Recursos Humanos",
    responsable: "Ana Torres",
    responsableAprobacion: "Carlos Ruiz",
  },
  {
    departamento: "TI",
    responsable: "Luis Gómez",
    responsableAprobacion: "Sofía Martínez",
  },
];

export default function DepartmentTable() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [departmentsList, setDepartmentsList] = useState([...departments]);
  const [form, setForm] = useState({
    departamento: "",
    responsable: "",
    responsableAprobacion: "",
  });

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const filteredDepartments = departmentsList.filter(dep =>
    dep.departamento.toLowerCase().includes(search.toLowerCase()) ||
    dep.responsable.toLowerCase().includes(search.toLowerCase()) ||
    dep.responsableAprobacion.toLowerCase().includes(search.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.departamento && form.responsable && form.responsableAprobacion) {
      setDepartmentsList([...departmentsList, { ...form }]);
      setForm({ departamento: "", responsable: "", responsableAprobacion: "" });
    }
  };

  return (
    <div className="relative flex">
      {/* Contenido principal */}
      <div className={`transition-all duration-300 ${isPanelOpen ? "w-[calc(100%-25%)] pr-4" : "w-full pr-4"}`}>
        <ContentBody>
          <ContentTable
            header={
              <SearchBar
                value={search}
                onChange={e => setSearch(e.target.value)}
                onSearch={() => {}}
              />
            }
            Body={
              <>
                <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-base font-bold text-gray-700 bg-gray-100">Departamento</th>
                      <th className="px-6 py-3 text-left text-base font-bold text-gray-700 bg-gray-100">Responsable</th>
                      <th className="px-6 py-3 text-left text-base font-bold text-gray-700 bg-gray-100">Responsable de aprobación</th>
                      <th className="px-6 py-3 text-left text-base font-bold text-gray-700 bg-gray-100"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDepartments.map((dep, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{dep.departamento}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{dep.responsable}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">{dep.responsableAprobacion}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          <button
                            onClick={togglePanel}
                            className="text-blue-500 hover:text-blue-700 font-semibold"
                          >
                            ...
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <form onSubmit={handleSubmit} className="mt-8 bg-gray-50 rounded-lg shadow p-6 flex flex-col md:flex-row gap-6 items-center justify-center">
                  <div className="flex flex-col w-full md:w-1/4">
                    <label className="mb-2 text-sm font-semibold text-gray-700">Departamento</label>
                    <input
                      type="text"
                      name="departamento"
                      value={form.departamento}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-1/4">
                    <label className="mb-2 text-sm font-semibold text-gray-700">Responsable</label>
                    <input
                      type="text"
                      name="responsable"
                      value={form.responsable}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-full md:w-1/4">
                    <label className="mb-2 text-sm font-semibold text-gray-700">Responsable de aprobación</label>
                    <input
                      type="text"
                      name="responsableAprobacion"
                      value={form.responsableAprobacion}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                      required
                    />
                  </div>
                  <div className="flex items-center h-full w-full md:w-auto">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-600 shadow transition-colors duration-200 mt-[20px]"
                    >
                      Agregar
                    </button>
                  </div>
                </form>
              </>
            }
          />
        </ContentBody>
      </div>

      {/* Panel lateral */}
      <PanelLateral
        title="Información del departamento"
        Open={isPanelOpen}
        close={togglePanel}
      />
    </div>
  );
}
