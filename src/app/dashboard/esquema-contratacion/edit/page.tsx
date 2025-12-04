"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEsquemaContratacion, type EsquemaItem } from "@/hooks/useEsquema-contratacion";
import { useEffect, useState } from "react";

export default function EditEsquema() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data, updateEsquema, loading, error } = useEsquemaContratacion();

  const [form, setForm] = useState({
    name: "",
    description: "",
    hours: "8",
  });

  // ===========================
  // CARGAR DATOS DEL REGISTRO
  // ===========================
  useEffect(() => {
    if (!id || data.length === 0) return;

    const esquema = data.find((d) => d.id === id);
    if (esquema) {
      setForm({
        name: esquema.name,
        description: esquema.description,
        hours: esquema.hours,
      });
    }
  }, [id, data]);

  const handleClickRoute = () => {
    router.push("/dashboard/esquema-contratacion");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const payload = {
      name: form.name,
      description: form.description,
      hours: form.hours,
    };

    const ok = await updateEsquema(id, payload);

    if (ok) router.push("/dashboard/esquema-contratacion");
  };

  const stylesInput = `
    w-full border border-gray-600 rounded px-3 py-2 
    hover:border-blue-600 
    focus:border-blue-500 
    focus:ring-2 focus:ring-blue-300 
    focus:outline-none
  `;

  return (
    <ContentBody
      title="Editar esquema"
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
        <h2 className="text-2xl font-bold mb-6 ml-4">Editar Esquema</h2>

        <form className="space-y-10 ml-4 mr-4" onSubmit={handleSubmit}>
          <fieldset className="border border-gray-400 rounded-xl p-4">
            <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
              Datos del esquema
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Horas</label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.hours}
                  onChange={(e) => setForm({ ...form, hours: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Descripción</label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
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
