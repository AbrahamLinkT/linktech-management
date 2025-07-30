"use client";
import React, { useState } from "react";
import { ContentBody, ContentTable } from "@/components/containers/containers";

interface HorasContrato {
  esquema: string;
  horas: number;
}

const horasIniciales: HorasContrato[] = [
  { esquema: "Honorarios", horas: 160 },
  { esquema: "Asimilados", horas: 120 },
];

export default function HorasContratoPage() {
  const [horasContrato, setHorasContrato] = useState<HorasContrato[]>(horasIniciales);
  const [form, setForm] = useState<HorasContrato>({ esquema: "", horas: 0 });
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "horas" ? Number(value) : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.esquema && form.horas > 0) {
      if (editIdx !== null) {
        const nuevos = [...horasContrato];
        nuevos[editIdx] = { ...form };
        setHorasContrato(nuevos);
        setEditIdx(null);
      } else {
        setHorasContrato([...horasContrato, { ...form }]);
      }
      setForm({ esquema: "", horas: 0 });
    }
  };

  const handleEdit = (idx: number) => {
    setForm(horasContrato[idx]);
    setEditIdx(idx);
  };

  return (
    <ContentBody title="Horas por contrato">
      <ContentTable
        header={null}
        Body={
          <>
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow mb-8">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-base font-bold text-gray-700 bg-gray-100">Esquema</th>
                  <th className="px-6 py-3 text-left text-base font-bold text-gray-700 bg-gray-100">Horas</th>
                  <th className="px-6 py-3 text-left text-base font-bold text-gray-700 bg-gray-100"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {horasContrato.map((hc, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{hc.esquema}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{hc.horas}</td>
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
                <label className="mb-2 text-sm font-semibold text-gray-700">Esquema</label>
                <input
                  type="text"
                  name="esquema"
                  value={form.esquema}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  required
                />
              </div>
              <div className="flex flex-col w-full md:w-1/3">
                <label className="mb-2 text-sm font-semibold text-gray-700">Horas</label>
                <input
                  type="number"
                  name="horas"
                  value={form.horas}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                  required
                  min={1}
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
