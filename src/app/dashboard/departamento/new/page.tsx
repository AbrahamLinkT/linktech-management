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

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

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

  const validate = (values: typeof form) => {
    const errs: { [key: string]: string } = {};
    const nombre = values.departamento?.trim();
    const short = values.short_name?.trim();
    const desc = values.description ?? "";

    if (!nombre) errs.departamento = "El nombre es requerido";
    else if (nombre.length < 3) errs.departamento = "Mínimo 3 caracteres";

    if (!short) errs.short_name = "El nombre corto es requerido";
    else if (short.length > 15) errs.short_name = "Máximo 15 caracteres";

    if (desc.length > 250) errs.description = "Máximo 250 caracteres";

    return errs;
  };

  const handleChange = (field: string, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);

    // validate this field
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
    setTouched({ departamento: true, short_name: true, description: true });

    if (Object.keys(v).length > 0) return;

    const payload = {
      name: form.departamento.trim(),
      short_name: form.short_name.trim(),
      description: form.description.trim(),
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

        <form
          className="space-y-10 ml-4 mr-4"
          onSubmit={handleSubmit}
          noValidate
        >
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
                    handleChange("departamento", e.target.value)
                  }
                  onBlur={() => handleBlur("departamento")}
                  aria-invalid={!!errors.departamento}
                  aria-describedby={
                    errors.departamento ? "err-departamento" : undefined
                  }
                />
                {touched.departamento && errors.departamento && (
                  <p
                    id="err-departamento"
                    className="text-red-600 text-sm mt-1"
                  >
                    {errors.departamento}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Nombre corto</label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.short_name}
                  onChange={(e) => handleChange("short_name", e.target.value)}
                  onBlur={() => handleBlur("short_name")}
                  aria-invalid={!!errors.short_name}
                  aria-describedby={
                    errors.short_name ? "err-short_name" : undefined
                  }
                />
                {touched.short_name && errors.short_name && (
                  <p
                    id="err-short_name"
                    className="text-red-600 text-sm mt-1"
                  >
                    {errors.short_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">Descripción</label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  onBlur={() => handleBlur("description")}
                  aria-invalid={!!errors.description}
                  aria-describedby={
                    errors.description ? "err-description" : undefined
                  }
                />
                {touched.description && errors.description && (
                  <p
                    id="err-description"
                    className="text-red-600 text-sm mt-1"
                  >
                    {errors.description}
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
