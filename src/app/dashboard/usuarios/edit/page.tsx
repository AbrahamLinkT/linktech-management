"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUsuarios } from "@/hooks/useUsuarios";

export default function Edit() {
  const router = useRouter();
  const pathname = usePathname();
  const returnTo = pathname.includes("/dashboard/manager") ? "/dashboard/manager" : "/dashboard/usuarios";
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

  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

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

  useEffect(() => {
    setErrors(validate(form));
  }, [form]);

  const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-2 
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;
  const handleClickRoute = () => {
    router.push(returnTo);
  };

  const validate = (values: typeof form) => {
    const errs: { [k: string]: string } = {};
    if (!values.id_department) errs.id_department = "Selecciona un departamento";
    if (!values.id_worker) errs.id_worker = "Selecciona una persona";

    if (values.id_department && Number.isNaN(Number(values.id_department)))
      errs.id_department = "Departamento inválido";
    if (values.id_worker && Number.isNaN(Number(values.id_worker)))
      errs.id_worker = "Persona inválida";

    return errs;
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
    setTouched({ id_department: true, id_worker: true });
    if (Object.keys(v).length > 0) return;

    const payload = {
      id_department: Number(form.id_department),
      id_worker: Number(form.id_worker),
    };

    const ok = await updateDepartmentHead(id, payload);
    if (ok) router.push(returnTo);
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
        <form
          className="space-y-10 ml-4 mr-4"
          onSubmit={handleSubmit}
          noValidate
        >
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
                    handleChange("id_department", e.target.value)
                  }
                  onBlur={() => handleBlur("id_department")}
                  aria-invalid={!!errors.id_department}
                  aria-describedby={
                    errors.id_department ? "err-departamento" : undefined
                  }
                >
                  <option value="">Selecciona un departamento</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                {touched.id_department && errors.id_department && (
                  <p
                    id="err-departamento"
                    className="text-red-600 text-sm mt-1"
                  >
                    {errors.id_department}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="persona" className="block font-medium mb-1">
                  Persona (Líder)
                </label>
                <select
                  id="persona"
                  className={stylesInput}
                  value={form.id_worker}
                  onChange={(e) => handleChange("id_worker", e.target.value)}
                  onBlur={() => handleBlur("id_worker")}
                  aria-invalid={!!errors.id_worker}
                  aria-describedby={errors.id_worker ? "err-persona" : undefined}
                >
                  <option value="">Selecciona una persona</option>
                  {workers.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
                {touched.id_worker && errors.id_worker && (
                  <p id="err-persona" className="text-red-600 text-sm mt-1">
                    {errors.id_worker}
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
