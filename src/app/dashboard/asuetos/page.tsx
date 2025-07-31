
"use client";
import { useState } from "react";

interface Asueto {
  empleado: string;
  fechaInicio: string;
  fechaFin: string;
  descripcion: string;
  tiempo: string;
}

export default function AsuetosPage() {
  const [asuetos, setAsuetos] = useState<Asueto[]>([
    {
      empleado: "Abraham Castañeda",
      fechaInicio: "2025-11-16",
      fechaFin: "2025-11-16",
      descripcion: "Independencia de MX",
      tiempo: "Completo",
    },
  ]);
  const [form, setForm] = useState<Asueto>({
    empleado: "",
    fechaInicio: "",
    fechaFin: "",
    descripcion: "",
    tiempo: "Completo",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.empleado || !form.fechaInicio || !form.fechaFin || !form.descripcion) return;
    setAsuetos((prev) => [...prev, form]);
    setForm({ empleado: "", fechaInicio: "", fechaFin: "", descripcion: "", tiempo: "Completo" });
  };

  const formatDate = (date: string) => {
    if (!date) return "";
    const [y, m, d] = date.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Asuetos</h1>
      <p className="text-gray-600 mb-6">Aquí podrás gestionar los días de asueto de la organización.</p>
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Empleado</th>
              <th className="px-4 py-2 text-left">Fecha inicio</th>
              <th className="px-4 py-2 text-left">Fecha fin</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Tiempo</th>
            </tr>
          </thead>
          <tbody>
            {asuetos.map((a, i) => (
              <tr key={i}>
                <td className="border px-4 py-2">{a.empleado}</td>
                <td className="border px-4 py-2">{formatDate(a.fechaInicio)}</td>
                <td className="border px-4 py-2">{formatDate(a.fechaFin)}</td>
                <td className="border px-4 py-2">{a.descripcion}</td>
                <td className="border px-4 py-2">{a.tiempo === "Completo" ? "Completo" : "Medio día"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <form className="bg-white p-6 rounded-lg shadow-md max-w-2xl" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold mb-4">Agregar asueto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Empleado</label>
            <input
              type="text"
              name="empleado"
              className="w-full border rounded px-3 py-2"
              placeholder="Nombre del empleado"
              value={form.empleado}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha inicio</label>
            <input
              type="date"
              name="fechaInicio"
              className="w-full border rounded px-3 py-2"
              value={form.fechaInicio}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha fin</label>
            <input
              type="date"
              name="fechaFin"
              className="w-full border rounded px-3 py-2"
              value={form.fechaFin}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <input
              type="text"
              name="descripcion"
              className="w-full border rounded px-3 py-2"
              placeholder="Motivo del asueto"
              value={form.descripcion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Tiempo</label>
            <select
              name="tiempo"
              className="w-full border rounded px-3 py-2"
              value={form.tiempo}
              onChange={handleChange}
            >
              <option value="Completo">Día completo</option>
              <option value="Medio">Medio día</option>
            </select>
          </div>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Agregar</button>
      </form>
    </div>
  );
}
