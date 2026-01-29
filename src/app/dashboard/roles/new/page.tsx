"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContentBody } from "@/components/containers/containers";
import { Btn_data } from "@/components/buttons/buttons";
import { ArrowLeft } from "lucide-react";
import { useRoles } from "@/hooks/useRoles";

export default function NewRole() {
  const router = useRouter();
  const { createRole, loading, error } = useRoles();

  const [form, setForm] = useState({
    name: "",
    shortName: "",
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
    router.push("/dashboard/roles");
  };

  const validate = (values: typeof form) => {
    const errs: { [k: string]: string } = {};
    const name = values.name?.trim();
    const shortName = values.shortName?.trim();

    if (!name) errs.name = "El nombre es requerido";
    else if (name.length < 1) errs.name = "Mínimo 1 caracter";
    else if (name.length > 250) errs.name = "Máximo 250 caracteres";

    if (!shortName) errs.shortName = "El nombre corto es requerido";
    else if (shortName.length > 100) errs.shortName = "Máximo 100 caracteres";

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
    setTouched({ name: true, shortName: true });
    if (Object.keys(v).length > 0) return;

    const payload = {
      name: form.name.trim(),
      short_name: form.shortName.trim(),
    };

    const ok = await createRole(payload);

    if (ok) router.push("/dashboard/roles");
  };

  return (
    <ContentBody
      title="Nuevo rol"
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
        <h2 className="text-2xl font-bold mb-6 ml-4">Rol</h2>

        <form className="space-y-10 ml-4 mr-4" onSubmit={handleSubmit} noValidate>
          <fieldset className="border border-gray-400 rounded-xl p-4">
            <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
              Datos del rol
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-1">
                  Nombre <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-name" : undefined}
                  maxLength={250}
                />
                {touched.name && errors.name && (
                  <p id="err-name" className="text-red-600 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Nombre Corto <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.shortName}
                  onChange={(e) => handleChange("shortName", e.target.value)}
                  onBlur={() => handleBlur("shortName")}
                  aria-invalid={!!errors.shortName}
                  aria-describedby={errors.shortName ? "err-shortName" : undefined}
                  maxLength={100}
                />
                {touched.shortName && errors.shortName && (
                  <p id="err-shortName" className="text-red-600 text-sm mt-1">{errors.shortName}</p>
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
