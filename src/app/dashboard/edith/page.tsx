"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";

export default function EditWorker() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id ?? null;

    const stylesInput = `
    w-full border border-gray-600 rounded px-3 py-2 
    hover:border-blue-600 
    focus:border-blue-500 
    focus:ring-2 focus:ring-blue-300 
    focus:outline-none
  `;

    // Simulación: cargar datos de trabajador por id
    // Aquí deberías hacer fetch o acceder a un store real
    const [workerData, setWorkerData] = useState({
        nombre: "",
        correo: "",
        telefono: "",
        status: "",
        ubicacion: "",
        nivel: "",
        contrato: "",
        esquema: "",
        departamento: "",
        descripcion: "",
    });

    useEffect(() => {
        if (id) {
            // Simular fetch - reemplaza con tu lógica real
            // Ejemplo: si id === "3" llenamos algunos campos
            if (id === "3") {
                setWorkerData({
                    nombre: "Carlos",
                    correo: "carlos@mail.com",
                    telefono: "+521234567890",
                    status: "activo",
                    ubicacion: "Oficina Central",
                    nivel: "sn",
                    contrato: "indefinido",
                    esquema: "asimilado",
                    departamento: "programador",
                    descripcion: "Programador senior en el equipo de desarrollo.",
                });
            } else {
                // Si no hay datos, limpiar
                setWorkerData({
                    nombre: "",
                    correo: "",
                    telefono: "",
                    status: "",
                    ubicacion: "",
                    nivel: "",
                    contrato: "",
                    esquema: "",
                    departamento: "",
                    descripcion: "",
                });
            }
        }
    }, [id]);

    const handleClickRoute = () => {
        router.push("/dashboard/workers");
    };

    return (
        <ContentBody
            title={`Editar trabajador: ID ${id}`}
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
                <h2 className="text-2xl font-bold mb-6 ml-4">Edición de Usuario</h2>
                <form className="space-y-10 ml-4 mr-4">
                    {/* Sección: Datos personales */}
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
                                    name="nombre"
                                    className={stylesInput}
                                    value={workerData.nombre}
                                    onChange={(e) =>
                                        setWorkerData((w) => ({ ...w, nombre: e.target.value }))
                                    }
                                />
                            </div>

                            <div>
                                <label htmlFor="correo" className="block font-medium mb-1">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    id="correo"
                                    name="correo"
                                    className={stylesInput}
                                    value={workerData.correo}
                                    onChange={(e) =>
                                        setWorkerData((w) => ({ ...w, correo: e.target.value }))
                                    }
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="telefono"
                                    className="block font-medium mb-1"
                                >
                                    Número telefónico
                                </label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    placeholder="+528334652691"
                                    className={stylesInput}
                                    value={workerData.telefono}
                                    onChange={(e) =>
                                        setWorkerData((w) => ({ ...w, telefono: e.target.value }))
                                    }
                                />
                            </div>
                            <div>
                                <label htmlFor="status" className="block font-medium mb-1">
                                    Status
                                </label>
                                <div className="flex items-center gap-4">
                                    <select
                                        name="status"
                                        id="status"
                                        className={stylesInput}
                                        value={workerData.status}
                                        onChange={(e) =>
                                            setWorkerData((w) => ({ ...w, status: e.target.value }))
                                        }
                                    >
                                        <option value="">Seleccione su opción</option>
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label
                                    htmlFor="ubicacion"
                                    className="block font-medium mb-1"
                                >
                                    Ubicación
                                </label>
                                <input
                                    type="text"
                                    id="ubicacion"
                                    className={stylesInput}
                                    value={workerData.ubicacion}
                                    onChange={(e) =>
                                        setWorkerData((w) => ({ ...w, ubicacion: e.target.value }))
                                    }
                                />
                            </div>
                        </div>
                    </fieldset>

                    {/* Sección: Información laboral */}
                    <fieldset className="border border-gray-400 rounded-xl p-4">
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4">
                            Información laboral
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="nivel" className="block font-medium mb-1">
                                    Nivel
                                </label>
                                <select
                                    name="nivel"
                                    id="nivel"
                                    className={stylesInput}
                                    value={workerData.nivel}
                                    onChange={(e) =>
                                        setWorkerData((w) => ({ ...w, nivel: e.target.value }))
                                    }
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="jr">Junior</option>
                                    <option value="sn">Senior</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="contrato" className="block font-medium mb-1">
                                    Tipo de contrato
                                </label>
                                <select
                                    name="contrato"
                                    id="contrato"
                                    className={stylesInput}
                                    value={workerData.contrato}
                                    onChange={(e) =>
                                        setWorkerData((w) => ({ ...w, contrato: e.target.value }))
                                    }
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="indefinido">Indefinido</option>
                                    <option value="temporal">Temporal</option>
                                    <option value="prácticas">Prácticas</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="esquema" className="block font-medium mb-1">
                                    Esquema
                                </label>
                                <select
                                    name="esquema"
                                    id="esquema"
                                    className={stylesInput}
                                    value={workerData.esquema}
                                    onChange={(e) =>
                                        setWorkerData((w) => ({ ...w, esquema: e.target.value }))
                                    }
                                >
                                    <option value="">Selecciona la opción</option>
                                    <option value="asimilado">Asimilado</option>
                                    <option value="indeterminado">Indeterminado</option>
                                    <option value="proveedor_PF">Proveedor PF</option>
                                    <option value="proveedor_PM">Proveedor PM</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="departamento" className="block font-medium mb-1">
                                    Departamento
                                </label>
                                <select
                                    name="departamento"
                                    id="departamento"
                                    className={stylesInput}
                                    value={workerData.departamento}
                                    onChange={(e) =>
                                        setWorkerData((w) => ({ ...w, departamento: e.target.value }))
                                    }
                                >
                                    <option value="">Selecciona la opción</option>
                                    <option value="delivery">Delivery</option>
                                    <option value="cobranza">Cobranza</option>
                                    <option value="rh">RH</option>
                                    <option value="programador">Programador</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="descripcion" className="block font-medium mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    rows={3}
                                    className="w-full h-[70px] resize-none border border-gray-600 rounded px-3 py-2 
                           hover:border-blue-600 focus:border-blue-500 
                           focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                    value={workerData.descripcion}
                                    onChange={(e) =>
                                        setWorkerData((w) => ({ ...w, descripcion: e.target.value }))
                                    }
                                />
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        </ContentBody>
    );
}
