"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ContentBody } from "@/components/containers/containers";
import { Btn_data } from "@/components/buttons/buttons";
import { ArrowLeft } from "lucide-react";
import { useWorkers, WorkerData } from "@/hooks/useWorkers";
import { useDepartments } from "@/hooks/useDepartments";

export default function EditWorker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : null;

  const { getWorkerById, updateWorker, levels, schemes, roles, managers, fetchLevels, fetchSchemes, fetchRoles, fetchWorkers } = useWorkers();
  const { data: departments } = useDepartments();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "1",
    location: "",
    description: "",
    department_id: "",
    level_id: "",
    scheme_id: "",
    role_id: "",
    // include new fields
    // note: initialized together to preserve shape
    // ... keep as string-based for selects and dates
    // manager_id uses "" for no manager
    // active and status use "1"/"0"
    // we'll merge when worker loads
    employee_code: "",
    hire_date: "",
    termination_date: "",
    active: "1",
    manager_id: "",
  });

  // validation state
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

  const validate = (values: typeof form) => {
    const errs: { [k: string]: string } = {};
    const name = values.name?.trim();
    const email = values.email?.trim();
    const phone = values.phone?.trim() ?? "";

    if (!name) errs.name = "El nombre es requerido";
    else if (name.length < 3) errs.name = "Mínimo 3 caracteres";

    if (!email) errs.email = "El email es requerido";
    else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email)) errs.email = "Email inválido";
    }

    if (phone) {
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 7) errs.phone = "Teléfono demasiado corto";
      else if (digits.length > 15) errs.phone = "Teléfono demasiado largo";
    }

    if (values.location && values.location.length > 100) errs.location = "Máximo 100 caracteres";

    if (values.level_id && Number.isNaN(Number(values.level_id))) errs.level_id = "Nivel inválido";
    if (values.scheme_id && Number.isNaN(Number(values.scheme_id))) errs.scheme_id = "Esquema inválido";
    if (values.role_id && Number.isNaN(Number(values.role_id))) errs.role_id = "Rol inválido";
    if ((values as any).department_id && Number.isNaN(Number((values as any).department_id))) (errs as any).department_id = "Departamento inválido";

    return errs;
  };

  const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-2 
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;

  useEffect(() => {
    // ensure option lists loaded
    fetchLevels();
    fetchSchemes();
    fetchRoles();
    fetchWorkers();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        router.push("/dashboard/workers");
        return;
      }
      setLoading(true);
      try {
        const worker: WorkerData | null = await getWorkerById(id);
        if (!worker) {
          router.push("/dashboard/workers");
          return;
        }
        setForm({
          name: worker.name || "",
          email: worker.email || "",
          phone: worker.phone || "",
          status: worker.status ? "1" : "0",
          location: worker.location || "",
          description: worker.description || "",
          department_id: worker.department_id ? String(worker.department_id) : "",
          level_id: worker.level_id ? String(worker.level_id) : "",
          scheme_id: worker.scheme_id ? String(worker.scheme_id) : "",
          role_id: worker.role_id ? String(worker.role_id) : "",
          employee_code: worker.employee_code ?? "",
          hire_date: worker.hire_date ?? "",
          termination_date: worker.termination_date ?? "",
          active: worker.active ? "1" : "0",
          manager_id: worker.manager_id ? String(worker.manager_id) : "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value } as typeof form;
    setForm(updated);
    const v = validate(updated);
    setErrors((prev) => ({ ...prev, [e.target.name]: v[e.target.name] }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const name = e.target.name;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    const v = validate(form);
    setErrors(v);
    setTouched({ name: true, email: true, phone: true, location: true, level_id: true, scheme_id: true, role_id: true });
    if (Object.keys(v).length > 0) return;
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      status: form.status === "1",
      location: form.location.trim(),
      description: form.description.trim(),
      department_id: (form as any).department_id === "" ? null : Number((form as any).department_id),
      level_id: form.level_id === "" ? null : Number(form.level_id),
      scheme_id: form.scheme_id === "" ? null : Number(form.scheme_id),
      role_id: form.role_id === "" ? null : Number(form.role_id),
      // new fields
      employee_code: (form as any).employee_code?.trim() || undefined,
      hire_date: (form as any).hire_date === "" ? null : (form as any).hire_date,
      termination_date: (form as any).termination_date === "" ? null : (form as any).termination_date,
      active: (form as any).active === "1",
      manager_id: (form as any).manager_id === "" ? null : Number((form as any).manager_id),
    };

    try {
      const ok = await updateWorker(id, payload);
      if (ok) router.push("/dashboard/workers");
      else alert("Error al actualizar trabajador");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar trabajador");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ContentBody title="Editar trabajador">
        <div className="flex justify-center items-center h-64">
          <p>Cargando datos del trabajador...</p>
        </div>
      </ContentBody>
    );
  }

  return (
    <ContentBody
      title="Editar trabajador"
      btnReg={
        <Btn_data
          icon={<ArrowLeft />}
          text={"Regresar"}
          styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
          Onclick={() => router.push("/dashboard/workers")}
        />
      }
    >
      <div className="m-1">
        <h2 className="text-2xl font-bold mb-6 ml-4">Editar trabajador</h2>

        <form className="space-y-10 ml-4 mr-4" onSubmit={handleSubmit}>
          <fieldset className="border border-gray-400 rounded-xl p-4">
            <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
              Datos personales
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  className={stylesInput}
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "err-name" : undefined}
                />
                {touched.name && errors.name && <p id="err-name" className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1">Código empleado</label>
                <input type="text" name="employee_code" className={stylesInput} value={(form as any).employee_code || ''} onChange={handleChange} />
              </div>

              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className={stylesInput}
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "err-email" : undefined}
                />
                {touched.email && errors.email && <p id="err-email" className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1">Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  className={stylesInput}
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "err-phone" : undefined}
                />
                {touched.phone && errors.phone && <p id="err-phone" className="text-red-600 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1">Estatus</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className={stylesInput}
                >
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block font-medium mb-1">Ubicación</label>
                <input
                  type="text"
                  name="location"
                  className={stylesInput}
                  value={form.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  aria-invalid={!!errors.location}
                  aria-describedby={errors.location ? "err-location" : undefined}
                />
                {touched.location && errors.location && <p id="err-location" className="text-red-600 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-400 rounded-xl p-4">
            <legend className="text-lg font-semibold px-2 ml-2 mt-4">
              Información laboral
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                  <label className="block font-medium mb-1">Departamento</label>
                  <select
                    name="department_id"
                    value={(form as any).department_id || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={stylesInput}
                    aria-invalid={!!(errors as any).department_id}
                    aria-describedby={(errors as any).department_id ? 'err-department' : undefined}
                  >
                    <option value="">Seleccione departamento</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{(d as any).departamento ?? d.name}</option>
                    ))}
                  </select>
                  {(touched as any).department_id && (errors as any).department_id && <p id="err-department" className="text-red-600 text-sm mt-1">{(errors as any).department_id}</p>}
                </div>

                <div>
                <label className="block font-medium mb-1">Nivel</label>
                <select
                  name="level_id"
                  value={form.level_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={stylesInput}
                  aria-invalid={!!errors.level_id}
                  aria-describedby={errors.level_id ? "err-level" : undefined}
                >
                  <option value="">Seleccione nivel</option>
                  {levels.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
                {touched.level_id && errors.level_id && <p id="err-level" className="text-red-600 text-sm mt-1">{errors.level_id}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1">Esquema</label>
                <select
                  name="scheme_id"
                  value={form.scheme_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={stylesInput}
                  aria-invalid={!!errors.scheme_id}
                  aria-describedby={errors.scheme_id ? "err-scheme" : undefined}
                >
                  <option value="">Seleccione esquema</option>
                  {schemes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {touched.scheme_id && errors.scheme_id && <p id="err-scheme" className="text-red-600 text-sm mt-1">{errors.scheme_id}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1">Rol</label>
                <select
                  name="role_id"
                  value={form.role_id}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={stylesInput}
                  aria-invalid={!!errors.role_id}
                  aria-describedby={errors.role_id ? "err-role" : undefined}
                >
                  <option value="">Seleccione rol</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                {touched.role_id && errors.role_id && <p id="err-role" className="text-red-600 text-sm mt-1">{errors.role_id}</p>}
              </div>

              <div>
                <label className="block font-medium mb-1">Fecha de ingreso</label>
                <input type="date" name="hire_date" className={stylesInput} value={(form as any).hire_date || ''} onChange={handleChange} />
              </div>

              <div>
                <label className="block font-medium mb-1">Fecha de terminación</label>
                <input type="date" name="termination_date" className={stylesInput} value={(form as any).termination_date || ''} onChange={handleChange} />
              </div>

              <div>
                <label className="block font-medium mb-1">Manager</label>
                <select name="manager_id" value={(form as any).manager_id || ''} onChange={handleChange} className={stylesInput}>
                  <option value="">Sin manager</option>
                  {managers && managers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Activo</label>
                <select name="active" value={(form as any).active || '1'} onChange={handleChange} className={stylesInput}>
                  <option value="1">Sí</option>
                  <option value="0">No</option>
                </select>
              </div>

            </div>
          </fieldset>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/workers")}
              className="bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 px-6 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting || Object.keys(errors).length > 0}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
            >
              {submitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </ContentBody>
  );
}
