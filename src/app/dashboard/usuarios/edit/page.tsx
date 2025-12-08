"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUsuarios } from "@/hooks/useUsuarios";

export default function Edit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    data,
    departments,
    workers,
    updateDepartmentHead,
    loading,
    error,
  } = useUsuarios();

  const [form, setForm] = useState({
    id_department: "",
    id_worker: "",
  });

  // Cargar el registro por id (ya que el hook mantiene `data` con todos los registros)
  useEffect(() => {
    if (!id || data.length === 0) return;
    const head = data.find((d) => d.id === id);
    if (head) {
      setForm({
        id_department: String(head.id_department),
        id_worker: String(head.id_worker),
      });
    }
  }, [id, data]);

  const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-2 
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;
  const handleClickRoute = () => {
    router.push("/dashboard/usuarios");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (!form.id_department || !form.id_worker) return;

    const payload = {
      id_department: Number(form.id_department),
      id_worker: Number(form.id_worker),
    };

    const ok = await updateDepartmentHead(id, payload);
    if (ok) router.push("/dashboard/usuarios");
  };

  return (
    <ContentBody
      title="Editar líder"
      btnReg={
        <Btn_data
          icon={<ArrowLeft />}
          text={"Regresar"}
          styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
          Onclick={handleClickRoute}
        />
      }
    >
      <div className="m-1">
        <h2 className="text-2xl font-bold mb-6 ml-4">Editar Líder</h2>
        <form className="space-y-10 ml-4 mr-4" onSubmit={handleSubmit}>
          <fieldset className="border border-gray-400 rounded-xl p-4">
            <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
              Selección
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="departamento" className="block font-medium mb-1">
                  Departamento
                </label>
                <select
                  id="departamento"
                  className={stylesInput}
                  value={form.id_department}
                  onChange={(e) =>
                    setForm({ ...form, id_department: e.target.value })
                  }
                >
                  <option value="">Selecciona un departamento</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="persona" className="block font-medium mb-1">
                  Persona (Líder)
                </label>
                <select
                  id="persona"
                  className={stylesInput}
                  value={form.id_worker}
                  onChange={(e) => setForm({ ...form, id_worker: e.target.value })}
                >
                  <option value="">Selecciona una persona</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>

          {error && <p className="text-red-600">Error: {error}</p>}
        </form>
      </div>
    </ContentBody>
  );
}
