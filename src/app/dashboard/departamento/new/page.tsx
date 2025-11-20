"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDepartments } from "@/hooks/useDepartments";
import { useState } from "react";

export default function New() {
  const router = useRouter();
  const { createDepartment, loading, error } = useDepartments();

  const [form, setForm] = useState({
    departamento: "",
    short_name: "",
    description: "",
  });

  const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-2 
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;

  const handleClickRoute = () => {
    router.push("/dashboard/departamento");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.departamento,
      short_name: form.short_name,
      description: form.description,
    };

    const ok = await createDepartment(payload);

    if (ok) router.push("/dashboard/departamento");
  };

  return (
    <ContentBody
      title="Nuevo"
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
        <h2 className="text-2xl font-bold mb-6 ml-4">Departamento</h2>

        <form className="space-y-10 ml-4 mr-4" onSubmit={handleSubmit}>
          <fieldset className="border border-gray-400 rounded-xl p-4">
            <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
              Datos del departamento
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.departamento}
                  onChange={(e) =>
                    setForm({ ...form, departamento: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Nombre corto</label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.short_name}
                  onChange={(e) =>
                    setForm({ ...form, short_name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Descripción</label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
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
