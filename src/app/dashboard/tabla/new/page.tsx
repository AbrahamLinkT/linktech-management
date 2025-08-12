"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewPropuesta() {
    const stylesInput = `
    w-full border border-gray-600 rounded px-3 py-2 
    hover:border-blue-600 
    focus:border-blue-500 
    focus:ring-2 focus:ring-blue-300 
    focus:outline-none
  `;

    const router = useRouter();

    // Estados para inputs
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");

    const handleClickRoute = () => {
        router.push("/dashboard/tabla");
    };

    const handleAgregar = () => {
        if (!nombre || !apellido || !correo) {
            alert("Todos los campos son obligatorios");
            return;
        }

        // Obtener datos existentes
        const dataExistente = JSON.parse(localStorage.getItem("personas") || "[]");

        // Crear nuevo registro con ID único
        const nuevo = {
            id: Date.now(),
            firstName: nombre,
            lastName: apellido,
            email: correo,
        };

        // Guardar en localStorage
        localStorage.setItem("personas", JSON.stringify([...dataExistente, nuevo]));

        // Regresar a la tabla
        router.push("/dashboard/tabla");
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
                <h2 className="text-2xl font-bold mb-6 ml-4">Alta de Usuario</h2>
                <form
                    className="space-y-10 ml-4 mr-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleAgregar();
                    }}
                >
                    <fieldset className="border border-gray-400 rounded-xl p-4">
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                            Datos personales
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="nombre" className="block font-medium mb-1">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className={stylesInput}
                                />
                            </div>

                            <div>
                                <label htmlFor="apellido" className="block font-medium mb-1">
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    id="apellido"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    className={stylesInput}
                                />
                            </div>

                            <div>
                                <label htmlFor="correo" className="block font-medium mb-1">
                                    Correo
                                </label>
                                <input
                                    type="email"
                                    id="correo"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    placeholder="example@gmail.com"
                                    className={stylesInput}
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Botón agregar */}
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        </ContentBody>
    );
}
