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

    useEffect(() => {
        // asegurar que las listas estén cargadas
        fetchLevels();
        fetchSchemes();
        fetchRoles();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
            const created = await createWorker(payload);
            if (created) {
                router.push("/dashboard/workers");
            } else {
                alert("Error al crear trabajador");
            }
        } catch (err) {
            console.error(err);
            alert("Error al crear worker");
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
                                <input type="text" name="name" className={stylesInput} value={form.name} onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Email</label>
                                <input type="email" name="email" className={stylesInput} value={form.email} onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Teléfono</label>
                                <input type="text" name="phone" className={stylesInput} value={form.phone} onChange={handleChange} />
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
                                <input type="text" name="location" className={stylesInput} value={form.location} onChange={handleChange} />
                            </div>
                        </div>
                    </fieldset>

                    {/* INFORMACIÓN LABORAL */}
                    <fieldset className="border border-gray-400 rounded-xl p-4">
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4">Información laboral</legend>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block font-medium mb-1">Nivel</label>
                                <select name="level_id" value={form.level_id} onChange={handleChange} className={stylesInput}>
                                    <option value="">Seleccione nivel</option>
                                    {levels.map(l => (
                                        <option key={l.id} value={l.id}>{l.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Esquema</label>
                                <select name="scheme_id" value={form.scheme_id} onChange={handleChange} className={stylesInput}>
                                    <option value="">Seleccione esquema</option>
                                    {schemes.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Rol</label>
                                <select name="role_id" value={form.role_id} onChange={handleChange} className={stylesInput}>
                                    <option value="">Seleccione rol</option>
                                    {roles.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </fieldset>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </ContentBody>
    );
}