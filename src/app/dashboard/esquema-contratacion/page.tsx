"use client";
import React, { useState } from "react";
import { ContentBody, ContentTable } from "@/components/containers/containers";

interface Esquema {
  nombreCorto: string;
  descripcion: string;
}

const esquemasIniciales: Esquema[] = [
  { nombreCorto: "Honorarios", descripcion: "Pago por servicios profesionales" },
  { nombreCorto: "Asimilados", descripcion: "Pago bajo régimen de asimilados" },
];

export default function EsquemaContratacionPage() {
  const [esquemas, setEsquemas] = useState<Esquema[]>(esquemasIniciales);
  const [form, setForm] = useState<Esquema>({ nombreCorto: "", descripcion: "" });
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.nombreCorto && form.descripcion) {
      if (editIdx !== null) {
        const nuevos = [...esquemas];
        nuevos[editIdx] = { ...form };
        setEsquemas(nuevos);
        setEditIdx(null);
      } else {
        setEsquemas([...esquemas, { ...form }]);
      }
      setForm({ nombreCorto: "", descripcion: "" });
    }
  };

  const handleEdit = (idx: number) => {
    setForm(esquemas[idx]);
    setEditIdx(idx);
  };

  return (
    <ContentBody title="Esquema contractual">
      <ContentTable
        header={null}
        Body={
          <>
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow mb-8">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-base font-bold text-gray-700 bg-gray-100">Nombre corto</th>
                  <th className="px-6 py-3 text-left text-base font-bold text-gray-700 bg-gray-100">Descripción</th>
                  <th className="px-6 py-3 text-left text-base font-bold text-gray-700 bg-gray-100"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {esquemas.map((esq, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{esq.nombreCorto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{esq.descripcion}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleEdit(idx)}
                        className="bg-yellow-400 text-white px-4 py-2 rounded font-semibold hover:bg-yellow-500 shadow"
                      >
                        Modificar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg shadow p-6 flex flex-col md:flex-row gap-6 items-center justify-center">
              <div className="flex flex-col w-full md:w-1/3">
                <label className="mb-2 text-sm font-semibold text-gray-700">Nombre corto</label>
                <input
                  type="text"
                  name="nombreCorto"
                  value={form.nombreCorto}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  required
                />
              </div>
              <div className="flex flex-col w-full md:w-1/3">
                <label className="mb-2 text-sm font-semibold text-gray-700">Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  required
                />
              </div>
              <div className="flex items-center h-full w-full md:w-auto">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-8 py-2 rounded-lg font-semibold hover:bg-blue-600 shadow transition-colors duration-200 mt-[10px]"
                >
                  {editIdx !== null ? "Guardar cambios" : "Agregar"}
                </button>
              </div>
            </form>
          </>
        }
      />
    </ContentBody>
  );
}
