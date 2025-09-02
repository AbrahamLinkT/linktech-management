"use client";

import { Btn_data } from "@/components/buttons/buttons"; // Eliminado: no usado
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react"; // Eliminado: no usado
import { useRouter } from "next/navigation"; // Eliminado: no usado
export default function New() {
    const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-2 
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;
    const router = useRouter()
    const handleClickRoute = () => {
        router.push("/dashboard/especialidades")
    }
    return (
        <ContentBody title="Nueva especialidad"
            btnReg={
                <Btn_data
                    icon={<ArrowLeft />}
                    text={"Regresar"}
                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                    Onclick={handleClickRoute}
                />
            }>
            <div className="m-1">
                <h2 className="text-2xl font-bold mb-6 ml-4">Especialidad</h2>
                <form className="space-y-10 ml-4 mr-4">

                    <fieldset className="border border-gray-400 rounded-xl p-4" >
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                            Datos de la especialidad
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="nombre" className="block font-medium mb-1">
                                    Nombre
                                </label>
                                <input type="text" id="nombre" name="nombre" className={stylesInput} />
                            </div>

                            <div>
                                <label htmlFor="nombreCorto" className="block font-medium mb-1">
                                    Nombre corto
                                </label>
                                <input type="text" id="nombreCorto" name="nombreCorto" className={stylesInput} />
                            </div>
                            <div>
                                <label htmlFor="descripcion" className="block font-medium mb-1">
                                    Descripción
                                </label>
                                <input type="text" id="descripcion" name="descripcion" className={stylesInput} />
                            </div>

                            <div className="">
                                <label htmlFor="nivel" className="block font-medium mb-1">
                                    Nivel
                                </label>
                                <input type="text" id="nivel" name="nivel" className={stylesInput} />
                            </div>
                            <div className="">
                                <label htmlFor="abreviacionNivel" className="block font-medium mb-1">
                                    Abreviacion de nivel
                                </label>
                                <input type="text" id="abreviacionNivel" name="abreviacionNivel" className={stylesInput} />
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
