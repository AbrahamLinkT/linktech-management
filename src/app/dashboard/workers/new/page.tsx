"use client";

import { Btn_data } from "@/components/buttons/buttons"; // Eliminado: no usado
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react"; // Eliminado: no usado
import { useRouter } from "next/navigation"; // Eliminado: no usado
export default function NewWorker() {
    const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-2 
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;
    const router = useRouter() // Eliminado: no usado
    const handleClickRoute = () => {
        router.push("/dashboard/workers")
    }
    return (
        <ContentBody title="Nuevo trabajador"
            btnReg={
                <Btn_data
                    icon={<ArrowLeft />}
                    text={"Regresar"}
                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                    Onclick={handleClickRoute}
                />
            }>
            <div className="m-1">
                <h2 className="text-2xl font-bold mb-6 ml-4">Alta de Usuario</h2>
                <form className="space-y-10 ml-4 mr-4">

                    {/* Sección: Datos personales */}
                    <fieldset className="border border-gray-400 rounded-xl p-4" >
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                            Datos personales
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="nombre" className="block font-medium mb-1">
                                    Nombre
                                </label>
                                <input type="text" id="nombre" name="nombre" className={stylesInput} />
                            </div>

                            <div>
                                <label htmlFor="correo" className="block font-medium mb-1">
                                    Correo electrónico
                                </label>
                                <input type="email" id="correo" name="correo" className={stylesInput} />
                            </div>
                            <div>
                                <label htmlFor="correo" className="block font-medium mb-1">
                                    Numero telefonico
                                </label>
                                <input type="number" id="number" name="number" placeholder="+528334652691" className={stylesInput} />
                            </div>
                            <div>
                                <label htmlFor="status" className="block font-medium mb-1">Status</label>
                                <div className="flex items-center gap-4">
                                    <select name="status" id="status" className={stylesInput}>
                                        <option value="">Seleccione su opción</option>
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="departamento" className="block font-medium mb-1">
                                    Ubicacion
                                </label>
                                <input type="text" className={stylesInput} />
                            </div>
                        </div>
                    </fieldset>
                    {/* Sección: Información laboral */}
                    <fieldset className="border border-gray-400 rounded-xl p-4">
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4">Información laboral</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="nivel" className="block font-medium mb-1">
                                    Nivel
                                </label>
                                <select name="nivel" id="nivel" className={stylesInput}>
                                    <option value="">Selecciona una opción</option>
                                    <option value="jr">Junior</option>
                                    <option value="sn">Senior</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="contrato" className="block font-medium mb-1">
                                    Tipo de contrato
                                </label>
                                <select name="contrato" id="contrato" className={stylesInput}>
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
                                <select name="esquema" id="esquema" className={stylesInput}>
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
                                <select name="departamento" id="departamento" className={stylesInput}>
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
                                                 focus:ring-2 focus:ring-blue-300 focus:outline-none"                                />
                            </div>
                        </div>
                    </fieldset>

                    Botón de guardar
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
