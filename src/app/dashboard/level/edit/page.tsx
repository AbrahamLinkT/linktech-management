"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ContentBody } from "@/components/containers/containers";
import { Btn_data } from "@/components/buttons/buttons";
import { ArrowLeft } from "lucide-react";
import { useLevels } from "@/hooks/useLevels";

export default function EditLevel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data, updateLevel, loading, error } = useLevels();

  const [form, setForm] = useState({
    name: "",
    shortName: "",
    description: "",
  });

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

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
    const updated: typeof form = { ...form, [field]: value };
    setForm(updated);
    const v = validate(updated);
    setErrors((prev) => ({ ...prev, [field]: v[field] }));
  };

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(form));
  };

  useEffect(() => {
    if (!id || data.length === 0) return;
    const item = data.find((d) => d.id.toString() === id);
    if (item) {
      setForm({ name: item.name, shortName: item.shortName, description: item.description || "" });
    }
  }, [id, data]);

  const handleClickRoute = () => {
    router.push("/dashboard/level");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const v = validate(form);
    setErrors(v);
    setTouched({ name: true, shortName: true, description: true });
    if (Object.keys(v).length > 0) return;

    const payload = {
      name: form.name.trim(),
      short_name: form.shortName.trim(),
      description: form.description.trim() || undefined,
    };

    const ok = await updateLevel(id, payload);

    if (ok) router.push("/dashboard/level");
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
      title="Editar nivel"
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
        <h2 className="text-2xl font-bold mb-6 ml-4">Editar Nivel</h2>

        <form className="space-y-10 ml-4 mr-4" onSubmit={handleSubmit}>
          <fieldset className="border border-gray-400 rounded-xl p-4">
            <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
              Datos del nivel
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-1">Nombre </label>
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
                {touched.name && errors.name && (<p className="text-red-600 text-sm mt-1">{errors.name}</p>)}
              </div>

              <div>
                <label className="block font-medium mb-1">Nombre Corto </label>
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
                {touched.shortName && errors.shortName && (<p className="text-red-600 text-sm mt-1">{errors.shortName}</p>)}
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Descripción</label>
                <textarea
                  className={`${stylesInput} h-24`}
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  onBlur={() => handleBlur("description")}
                  maxLength={1000}
                />
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
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
