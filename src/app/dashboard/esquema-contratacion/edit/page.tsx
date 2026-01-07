"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEsquemaContratacion } from "@/hooks/useEsquema-contratacion";
import { useEffect, useState } from "react";

export default function EditEsquema() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data, updateEsquema, loading, error } = useEsquemaContratacion();

  const [form, setForm] = useState({
    name: "",
    description: "",
    start_time: "08:00",
    end_time: "18:00",
    working_days: [] as string[],
    active: true,
  });

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

  const DAYS = [
    { key: "LUNES", label: "Lunes" },
    { key: "MARTES", label: "Martes" },
    { key: "MIERCOLES", label: "Miércoles" },
    { key: "JUEVES", label: "Jueves" },
    { key: "VIERNES", label: "Viernes" },
    { key: "SABADO", label: "Sábado" },
    { key: "DOMINGO", label: "Domingo" },
  ];

  const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) => {
    const h = String(i).padStart(2, "0");
    return `${h}:00`;
  });

  const toggleDay = (day: string) => {
    setForm((f) => {
      const set = new Set(f.working_days);
      if (set.has(day)) set.delete(day);
      else set.add(day);
      return { ...f, working_days: Array.from(set) };
    });
  };

  const toggleActive = () => {
    setForm((f) => ({ ...f, active: !f.active }));
  };

  // ===========================
  // CARGAR DATOS DEL REGISTRO
  // ===========================
  useEffect(() => {
    if (!id || data.length === 0) return;

    const esquema = data.find((d) => d.id === id);
    if (esquema) {
      setForm({
        name: esquema.name ?? "",
        description: esquema.description ?? "",
        start_time: esquema.hours?.toString().split("-")[0] ?? "08:00",
        end_time: esquema.hours?.toString().split("-")[1] ?? "18:00",
        working_days: esquema.working_days ? esquema.working_days.split(/,\s*/).map(s=>s.toUpperCase()) : [],
        active: esquema.active ?? true,
      });
    }
  }, [id, data]);

  useEffect(() => {
    setErrors(validate(form));
  }, [form]);

  const validate = (values: typeof form) => {
    const errs: { [k: string]: string } = {};
    const name = values.name?.trim();
    const desc = values.description ?? "";
    const start = values.start_time?.toString().trim();
    const end = values.end_time?.toString().trim();

    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    if (!name) errs.name = "El nombre es requerido";
    else if (name.length < 3) errs.name = "Mínimo 3 caracteres";

    if (!start) errs.start_time = "Hora de entrada es requerida";
    else if (!timeRegex.test(start)) errs.start_time = "Formato HH:MM inválido";

    if (!end) errs.end_time = "Hora de salida es requerida";
    else if (!timeRegex.test(end)) errs.end_time = "Formato HH:MM inválido";

    // Se permite que end_time sea anterior a start_time (horarios que cruzan medianoche)

    if (desc.length > 250) errs.description = "Máximo 250 caracteres";

    return errs;
  };

  const handleClickRoute = () => {
    router.push("/dashboard/esquema-contratacion");
  };

  const handleChange = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    const v = validate({ ...form, [field]: value });
    setErrors((prev) => ({ ...prev, [field]: v[field] }));
  };

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    const v = validate(form);
    setErrors(v);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const v = validate(form);
    setErrors(v);
    setTouched({ name: true, start_time: true, end_time: true, description: true });

    if (Object.keys(v).length > 0) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      hours: `${form.start_time}-${form.end_time}`,
      working_days: form.working_days.join(", "),
      active: !!form.active,
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
                <div className="flex space-x-2">
                  <div className="w-1/2">
                    <select
                      className={stylesInput}
                      value={form.start_time}
                      onChange={(e) => handleChange("start_time", e.target.value)}
                      onBlur={() => handleBlur("start_time")}
                      aria-invalid={!!errors.start_time}
                      aria-describedby={errors.start_time ? "err-start_time" : undefined}
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {touched.start_time && errors.start_time && (
                      <p id="err-start_time" className="text-red-600 text-sm mt-1">{errors.start_time}</p>
                    )}
                  </div>

                  <div className="w-1/2">
                    <select
                      className={stylesInput}
                      value={form.end_time}
                      onChange={(e) => handleChange("end_time", e.target.value)}
                      onBlur={() => handleBlur("end_time")}
                      aria-invalid={!!errors.end_time}
                      aria-describedby={errors.end_time ? "err-end_time" : undefined}
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {touched.end_time && errors.end_time && (
                      <p id="err-end_time" className="text-red-600 text-sm mt-1">{errors.end_time}</p>
                    )}
                  </div>
                </div>
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

              {/* working days */}
              <div className="md:col-span-2">
                <label className="block font-medium mb-2">Días laborables</label>
                <div className="grid grid-cols-2 gap-2">
                  {DAYS.map((d) => (
                    <label key={d.key} className="inline-flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={form.working_days.includes(d.key)}
                        onChange={() => toggleDay(d.key)}
                        className="rounded text-blue-600"
                      />
                      <span>{d.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* active */}
              <div className="md:col-span-2">
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!!form.active}
                    onChange={toggleActive}
                    className="rounded text-blue-600"
                  />
                  <span className="font-medium">Activo</span>
                </label>
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
