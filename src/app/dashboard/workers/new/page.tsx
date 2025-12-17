"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ContentBody } from "@/components/containers/containers";
import { Btn_data } from "@/components/buttons/buttons";
import { ArrowLeft } from "lucide-react";
import { useWorkers } from "@/hooks/useWorkers";

export default function NewWorker() {
    const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-2 
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;

    const router = useRouter();

    const { createWorker, levels, schemes, roles, fetchLevels, fetchSchemes, fetchRoles } = useWorkers();

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

    // validation state
    const [errors, setErrors] = useState<{ [k: string]: string }>({});
    const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
    const [submitting, setSubmitting] = useState(false);

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
        if (values.description && values.description.length > 250) errs.description = "Máximo 250 caracteres";

        // optional numeric checks for selects
        if (values.level_id && Number.isNaN(Number(values.level_id))) errs.level_id = "Nivel inválido";
        if (values.scheme_id && Number.isNaN(Number(values.scheme_id))) errs.scheme_id = "Esquema inválido";
        if (values.role_id && Number.isNaN(Number(values.role_id))) errs.role_id = "Rol inválido";

        return errs;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const updated = { ...form, [e.target.name]: e.target.value } as typeof form;
        setForm(updated);
        // validate this field
        const v = validate(updated);
        setErrors((prev) => ({ ...prev, [e.target.name]: v[e.target.name] }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const name = e.target.name;
        setTouched((t) => ({ ...t, [name]: true }));
        setErrors(validate(form));
    };

    useEffect(() => {
        // asegurar que las listas estén cargadas
        fetchLevels();
        fetchSchemes();
        fetchRoles();
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const v = validate(form);
        setErrors(v);
        setTouched({ name: true, email: true, phone: true, location: true, description: true });
        if (Object.keys(v).length > 0) return;

        const payload = {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            status: form.status === "1",
            location: form.location.trim(),
            description: form.description.trim(),
            level_id: form.level_id === "" ? null : Number(form.level_id),
            scheme_id: form.scheme_id === "" ? null : Number(form.scheme_id),
            role_id: form.role_id === "" ? null : Number(form.role_id),
        };

        setSubmitting(true);
        try {
            const created = await createWorker(payload);
            if (created) router.push("/dashboard/workers");
            else alert("Error al crear trabajador");
        } catch (err) {
            console.error(err);
            alert("Error al crear worker");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ContentBody
            title="Nuevo trabajador"
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
                <h2 className="text-2xl font-bold mb-6 ml-4">Alta de Usuario</h2>

                <form className="space-y-10 ml-4 mr-4" onSubmit={handleSubmit}>

                    {/* DATOS PERSONALES */}
                    <fieldset className="border border-gray-400 rounded-xl p-4">
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                            Datos personales
                        </legend>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block font-medium mb-1">Nombre</label>
                                <input type="text" name="name" className={stylesInput} value={form.name} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} />
                                {touched.name && errors.name && <p id="err-name" className="text-red-600 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Email</label>
                                <input type="email" name="email" className={stylesInput} value={form.email} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} />
                                {touched.email && errors.email && <p id="err-email" className="text-red-600 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Teléfono</label>
                                <input type="text" name="phone" className={stylesInput} value={form.phone} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'err-phone' : undefined} />
                                {touched.phone && errors.phone && <p id="err-phone" className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Estatus</label>
                                <select name="status" value={form.status} onChange={handleChange} className={stylesInput}>
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block font-medium mb-1">Ubicación</label>
                                <input type="text" name="location" className={stylesInput} value={form.location} onChange={handleChange} onBlur={handleBlur} aria-invalid={!!errors.location} aria-describedby={errors.location ? 'err-location' : undefined} />
                                {touched.location && errors.location && <p id="err-location" className="text-red-600 text-sm mt-1">{errors.location}</p>}
                            </div>
                        </div>
                    </fieldset>

                    {/* INFORMACIÓN LABORAL */}
                    <fieldset className="border border-gray-400 rounded-xl p-4">
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4">Información laboral</legend>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block font-medium mb-1">Nivel</label>
                                <select name="level_id" value={form.level_id} onChange={handleChange} onBlur={handleBlur} className={stylesInput} aria-invalid={!!errors.level_id} aria-describedby={errors.level_id ? 'err-level' : undefined}>
                                    <option value="">Seleccione nivel</option>
                                    {levels.map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                                {touched.level_id && errors.level_id && <p id="err-level" className="text-red-600 text-sm mt-1">{errors.level_id}</p>}
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Esquema</label>
                                <select name="scheme_id" value={form.scheme_id} onChange={handleChange} onBlur={handleBlur} className={stylesInput} aria-invalid={!!errors.scheme_id} aria-describedby={errors.scheme_id ? 'err-scheme' : undefined}>
                                    <option value="">Seleccione esquema</option>
                                    {schemes.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                                {touched.scheme_id && errors.scheme_id && <p id="err-scheme" className="text-red-600 text-sm mt-1">{errors.scheme_id}</p>}
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Rol</label>
                                <select name="role_id" value={form.role_id} onChange={handleChange} onBlur={handleBlur} className={stylesInput} aria-invalid={!!errors.role_id} aria-describedby={errors.role_id ? 'err-role' : undefined}>
                                    <option value="">Seleccione rol</option>
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                                {touched.role_id && errors.role_id && <p id="err-role" className="text-red-600 text-sm mt-1">{errors.role_id}</p>}
                            </div>

                        </div>
                    </fieldset>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || Object.keys(errors).length > 0}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
                        >
                            {submitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </ContentBody>
    );
}