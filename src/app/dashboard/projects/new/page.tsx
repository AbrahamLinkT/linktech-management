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
        router.push("/dashboard/projects")
    }
    return (
        <ContentBody title="Nuevo proyecto"
            btnReg={
                <Btn_data
                    icon={<ArrowLeft />}
                    text={"Regresar"}
                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                    Onclick={handleClickRoute}
                />
            }>
            <div className="m-1">
                <h2 className="text-2xl font-bold mb-6 ml-4">Alta de Proyecto</h2>
                <form className="space-y-10 ml-4 mr-4">

                    {/* Sección: Datos personales */}
                    <fieldset className="border border-gray-400 rounded-xl p-4" >
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                            Datos del proyecto
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="nombre" className="block font-medium mb-1">
                                    Nombre del proyecto
                                </label>
                                <input type="text" id="nombre" name="nombre" className={stylesInput} />
                            </div>

                            <div>
                                <label htmlFor="orden_interna" className="block font-medium mb-1">
                                    Orden interna
                                </label>
                                <input type="text" id="orden_interna" name="orden_interna" className={stylesInput} />
                            </div>
                            <div>
                                <label htmlFor="correo" className="block font-medium mb-1">
                                    Empresa
                                </label>
                                <div className="flex items-center gap-4">
                                    <select name="empresa" id="empresa" className={stylesInput}>
                                        <option value="">Seleccione su opción</option>
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
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
                                    Descripcion
                                </label>
                                <input type="text" className={stylesInput} />
                            </div>
                            <div>
                                <label htmlFor="fecha_inicio" className="block font-medium mb-1">
                                    Fecha de inicio
                                </label>
                                <input type="date" id="fecha_inicio" name="fecha_inicio" className={stylesInput} />
                            </div>
                            <div>
                                <label htmlFor="fecha_fin" className="block font-medium mb-1">
                                    Fecha de fin
                                </label>
                                <input type="date" id="fecha_fin" name="fecha_fin" className={stylesInput} />
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
