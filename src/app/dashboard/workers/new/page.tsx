"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewWorker() {
    const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-2 
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;

    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        status: "",
        location: "",
        description: "",
        level_id: "",
        scheme_id: "",
        role_id: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Convertir status a boolean
        const statusBoolean = form.status === "1";

        const payload = {
            name: form.name,
            email: form.email,
            phone: form.phone,
            status: statusBoolean,
            location: form.location,
            description: form.description,
            level_id: Number(form.level_id),
            scheme_id: Number(form.scheme_id),
            role_id: Number(form.role_id),
        };

        console.log("Payload que se enviará:", payload);

        try {
            const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Error al crear el worker");
            }

            alert("Trabajador creado correctamente");
            router.push("/dashboard/workers");
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
                                <input type="text" name="name" className={stylesInput} onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Correo electrónico</label>
                                <input type="email" name="email" className={stylesInput} onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Número telefónico</label>
                                <input type="text" name="phone" className={stylesInput} onChange={handleChange} />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Status</label>
                                <select name="status" className={stylesInput} onChange={handleChange}>
                                    <option value="">Seleccione su opción</option>
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block font-medium mb-1">Ubicación</label>
                                <input type="text" name="location" className={stylesInput} onChange={handleChange} />
                            </div>
                        </div>
                    </fieldset>

                    {/* INFORMACIÓN LABORAL */}
                    <fieldset className="border border-gray-400 rounded-xl p-4">
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4">Información laboral</legend>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Nivel (level_id) */}
                            <div>
                                <label className="block font-medium mb-1">Nivel</label>
                                <select name="level_id" className={stylesInput} onChange={handleChange}>
                                    <option value="">Selecciona una opción</option>
                                    <option value="3">Junior</option>
                                    <option value="4">Senior</option>
                                </select>
                            </div>

                            {/* Departamento (role_id) */}
                            <div>
                                <label className="block font-medium mb-1">Departamento</label>
                                <select name="role_id" className={stylesInput} onChange={handleChange}>
                                    <option value="">Selecciona la opción</option>
                                    <option value="3">Delivery</option>
                                    <option value="4">Cobranza</option>
                                    <option value="5">RH</option>
                                    <option value="6">Programador</option>
                                </select>
                            </div>

                            {/* Esquema (scheme_id) */}
                            <div>
                                <label className="block font-medium mb-1">Esquema</label>
                                <select name="scheme_id" className={stylesInput} onChange={handleChange}>
                                    <option value="">Selecciona la opción</option>
                                    <option value="3">Asimilado</option>
                                    <option value="4">Indeterminado</option>
                                    <option value="5">Proveedor PF</option>
                                    <option value="6">Proveedor PM</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block font-medium mb-1">Descripción</label>
                                <textarea
                                    name="description"
                                    rows={3}
                                    className="w-full h-[70px] resize-none border border-gray-600 rounded px-3 py-2 hover:border-blue-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                    onChange={handleChange}
                                />
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