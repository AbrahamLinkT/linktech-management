"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ContentBody } from "@/components/containers/containers";
import { Btn_data } from "@/components/buttons/buttons";
import { ArrowLeft } from "lucide-react";
import { useWorkers, WorkerData } from "@/hooks/useWorkers";

export default function EditWorker() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const id = idParam ? Number(idParam) : null;

  const { getWorkerById, updateWorker, levels, schemes, roles, fetchLevels, fetchSchemes, fetchRoles } = useWorkers();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "1",
    location: "",
    description: "",
    level_id: "",
    scheme_id: "",
    role_id: "",
  });

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
          level_id: worker.level_id ? String(worker.level_id) : "",
          scheme_id: worker.scheme_id ? String(worker.scheme_id) : "",
          role_id: worker.role_id ? String(worker.role_id) : "",
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      status: form.status === "1",
      location: form.location,
      description: form.description,
      level_id: form.level_id === "" ? null : Number(form.level_id),
      scheme_id: form.scheme_id === "" ? null : Number(form.scheme_id),
      role_id: form.role_id === "" ? null : Number(form.role_id),
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
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  className={stylesInput}
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  className={stylesInput}
                  value={form.phone}
                  onChange={handleChange}
                />
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
                />
              </div>
            </div>
          </fieldset>

          <fieldset className="border border-gray-400 rounded-xl p-4">
            <legend className="text-lg font-semibold px-2 ml-2 mt-4">
              Información laboral
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-medium mb-1">Nivel</label>
                <select
                  name="level_id"
                  value={form.level_id}
                  onChange={handleChange}
                  className={stylesInput}
                >
                  <option value="">Seleccione nivel</option>
                  {levels.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Esquema</label>
                <select
                  name="scheme_id"
                  value={form.scheme_id}
                  onChange={handleChange}
                  className={stylesInput}
                >
                  <option value="">Seleccione esquema</option>
                  {schemes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Rol</label>
                <select
                  name="role_id"
                  value={form.role_id}
                  onChange={handleChange}
                  className={stylesInput}
                >
                  <option value="">Seleccione rol</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
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
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
            >
              {submitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </ContentBody>
  );
}
