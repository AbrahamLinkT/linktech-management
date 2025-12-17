"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useClients } from "@/hooks/useClients";
import { useState } from "react";

export default function NewClient() {
  const router = useRouter();
  const { createClient, loading, error } = useClients();

  const [form, setForm] = useState({
    nombre: "",
    nombreCorto: "",
  });

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

  const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-2 
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;

  const handleClickRoute = () => {
    router.push("/dashboard/client");
  };

  const validate = (values: typeof form) => {
    const errs: { [k: string]: string } = {};
    const nombre = values.nombre?.trim();
    const short = values.nombreCorto?.trim();

    if (!nombre) errs.nombre = "El nombre es requerido";
    else if (nombre.length < 3) errs.nombre = "Mínimo 3 caracteres";

    if (!short) errs.nombreCorto = "El nombre corto es requerido";
    else if (short.length > 50) errs.nombreCorto = "Máximo 50 caracteres";

    return errs;
  };

  const handleChange = (field: string, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    const v = validate(updated);
    setErrors((prev) => ({ ...prev, [field]: v[field] }));
  };

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    setTouched({ nombre: true, nombreCorto: true });
    if (Object.keys(v).length > 0) return;

    const payload = {
      name: form.nombre.trim(),
      short_name: form.nombreCorto.trim(),
    };

    const ok = await createClient(payload);

    if (ok) router.push("/dashboard/client");
  };

  return (
    <ContentBody
      title="Nuevo cliente"
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
        <h2 className="text-2xl font-bold mb-6 ml-4">Cliente</h2>

        <form
          className="space-y-10 ml-4 mr-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <fieldset className="border border-gray-400 rounded-xl p-4">
            <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
              Datos del cliente
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  onBlur={() => handleBlur("nombre")}
                  aria-invalid={!!errors.nombre}
                  aria-describedby={errors.nombre ? "err-nombre" : undefined}
                />
                {touched.nombre && errors.nombre && (
                  <p
                    id="err-nombre"
                    className="text-red-600 text-sm mt-1"
                  >
                    {errors.nombre}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Nombre corto</label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.nombreCorto}
                  onChange={(e) => handleChange("nombreCorto", e.target.value)}
                  onBlur={() => handleBlur("nombreCorto")}
                  aria-invalid={!!errors.nombreCorto}
                  aria-describedby={
                    errors.nombreCorto ? "err-nombreCorto" : undefined
                  }
                />
                {touched.nombreCorto && errors.nombreCorto && (
                  <p
                    id="err-nombreCorto"
                    className="text-red-600 text-sm mt-1"
                  >
                    {errors.nombreCorto}
                  </p>
                )}
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
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
