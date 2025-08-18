"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { useParams } from "next/navigation";

export default function EditPropuesta() {
    const stylesInput = `
    w-full border border-gray-600 rounded px-3 py-2 
    hover:border-blue-600 
    focus:border-blue-500 
    focus:ring-2 focus:ring-blue-300 
    focus:outline-none
  `;

    const router = useRouter();
    const params = useParams();
    const idNum = Number(params.id);


    type Persona = {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };

    // Estados para inputs
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");

    useEffect(() => {
        if (!idNum || isNaN(idNum)) return;
    // Buscar por id exacto, no por índice
    const dataExistente: Persona[] = JSON.parse(localStorage.getItem("personas") || "[]");
    let persona = dataExistente.find((p: Persona) => Number(p.id) === idNum);
        if (!persona) {
            // Si no está en localStorage, buscar en los datos base
            const base = [
                { id: 1, firstName: "Luis", lastName: "Hernández", email: "luis@mail.com" },
                { id: 2, firstName: "Ana", lastName: "Gómez", email: "ana@mail.com" },
                { id: 3, firstName: "Carlos", lastName: "Pérez", email: "carlos@mail.com" },
                { id: 4, firstName: "María", lastName: "López", email: "maria@mail.com" },
            ];
            persona = base.find((p) => Number(p.id) === idNum);
        }
        if (persona) {
            setNombre(persona.firstName || "");
            setApellido(persona.lastName || "");
            setCorreo(persona.email || "");
        }
    }, [idNum]);

    const handleClickRoute = () => {
        router.push("/dashboard/tabla");
    };

    const handleGuardar = () => {
        if (!nombre || !apellido || !correo) {
            alert("Todos los campos son obligatorios");
            return;
        }
        const dataExistente: Persona[] = JSON.parse(localStorage.getItem("personas") || "[]");
        const nuevosDatos = dataExistente.map((p: Persona) =>
            p.id === idNum
                ? { ...p, firstName: nombre, lastName: apellido, email: correo }
                : p
        );
        localStorage.setItem("personas", JSON.stringify(nuevosDatos));
        router.push("/dashboard/tabla");
        router.refresh();
    };

    return (
        <ContentBody
            title="Editar"
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
                <h2 className="text-2xl font-bold mb-6 ml-4">Editar Usuario</h2>
                <form
                    className="space-y-10 ml-4 mr-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleGuardar();
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

                    {/* Botón guardar */}
                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </ContentBody>
    );
}
