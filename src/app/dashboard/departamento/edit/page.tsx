"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Edit() {
    const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-2 
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;
    const router = useRouter()
    const handleClickRoute = () => {
        router.push("/dashboard/departamento")
    }
    return (
        <ContentBody title="Editar"
            btnReg={
                <Btn_data
                    icon={<ArrowLeft />}
                    text={"Regresar"}
                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                    Onclick={handleClickRoute}
                />
            }>
            <div className="m-1">
                <h2 className="text-2xl font-bold mb-6 ml-4">Departamento</h2>
                <form className="space-y-10 ml-4 mr-4">
                    <fieldset className="border border-gray-400 rounded-xl p-4" >
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                            Datos del departamento
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="departamento" className="block font-medium mb-1">
                                    Departamento
                                </label>
                                <input type="text" id="departamento" name="departamento" className={stylesInput} defaultValue="Finanzas" />
                            </div>

                            <div>
                                <label htmlFor="responsable" className="block font-medium mb-1">Responsable</label>
                                <div className="flex items-center gap-4">
                                    <select name="responsable" id="responsable" className={stylesInput} defaultValue={"jz"}>
                                        <option value="">Seleccione su opción</option>
                                        <option value="jz">Jazmin</option>
                                        <option value="inactivo">Sergio</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="responsable_aprobacion" className="block font-medium mb-1">Responsable de aprovacion</label>
                                <div className="flex items-center gap-4">
                                    <select name="responsable_aprobacion" id="responsable_aprobacion" className={stylesInput} defaultValue={"sr"}>
                                        <option value="">Seleccione su opción</option>
                                        <option value="jz">Jazmin</option>
                                        <option value="sr">Sergio</option>
                                    </select>
                                </div>
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
