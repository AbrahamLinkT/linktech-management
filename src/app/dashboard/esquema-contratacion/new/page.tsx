"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEsquemaContratacion } from "@/hooks/useEsquema-contratacion";
import { useState } from "react";

export default function NewEsquema() {
  const router = useRouter();
  const { createEsquema, loading, error } = useEsquemaContratacion();

  const [form, setForm] = useState({
    name: "",
    description: "",
    hours: "8",
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
    router.push("/dashboard/esquema-contratacion");
  };

  const validate = (values: typeof form) => {
    const errs: { [k: string]: string } = {};
    const name = values.name?.trim();
    const desc = values.description ?? "";
    const hours = values.hours?.toString().trim();

    if (!name) errs.name = "El nombre es requerido";
    else if (name.length < 3) errs.name = "Mínimo 3 caracteres";

    if (!hours) errs.hours = "Las horas son requeridas";
    else {
      const n = Number(hours);
      if (Number.isNaN(n) || !Number.isFinite(n)) errs.hours = "Ingrese un número válido";
      else if (!Number.isInteger(n)) errs.hours = "Ingrese un número entero";
      else if (n <= 0) errs.hours = "Debe ser mayor que 0";
      else if (n > 24) errs.hours = "Debe ser menor o igual a 24";
    }

    if (desc.length > 250) errs.description = "Máximo 250 caracteres";

    return errs;
  };

  const handleChange = (field: string, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    // validate single field
    const v = validate(updated);
    setErrors((prev) => ({ ...prev, [field]: v[field] }));
  };

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const v = validate(form);
    setErrors(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const v = validate(form);
    setErrors(v);
    setTouched({ name: true, hours: true, description: true });

    if (Object.keys(v).length > 0) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      hours: form.hours.toString().trim(),
    };

    const ok = await createEsquema(payload);

    if (ok) router.push("/dashboard/esquema-contratacion");
  };

  return (
    <ContentBody
      title="Nuevo esquema"
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
        <h2 className="text-2xl font-bold mb-6 ml-4">Esquema</h2>

        <form className="space-y-10 ml-4 mr-4" onSubmit={handleSubmit} noValidate>
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
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-name" : undefined}
                />
                {touched.name && errors.name && (
                  <p id="err-name" className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Horas</label>
                <input
                  type="text"
                  inputMode="numeric"
                  className={stylesInput}
                  value={form.hours}
                  onChange={(e) => handleChange("hours", e.target.value)}
                  onBlur={() => handleBlur("hours")}
                  aria-invalid={!!errors.hours}
                  aria-describedby={errors.hours ? "err-hours" : undefined}
                />
                {touched.hours && errors.hours && (
                  <p id="err-hours" className="text-red-600 text-sm mt-1">{errors.hours}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Descripción</label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  onBlur={() => handleBlur("description")}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? "err-description" : undefined}
                />
                {touched.description && errors.description && (
                  <p id="err-description" className="text-red-600 text-sm mt-1">{errors.description}</p>
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
