"use client";

import { Btn_data } from "@/components/buttons/buttons"; // Eliminado: no usado
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react"; // Eliminado: no usado
import { useRouter } from "next/navigation"; // Eliminado: no usado
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
        router.push("/dashboard/client")
    }
    return (
        <ContentBody title="Nuevo cliente"
            btnReg={
                <Btn_data
                    icon={<ArrowLeft />}
                    text={"Regresar"}
                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                    Onclick={handleClickRoute}
                />
            }>
            <div className="m-1">
                <h2 className="text-2xl font-bold mb-6 ml-4">Alta de cliente</h2>
                <form className="space-y-10 ml-4 mr-4">

                    {/* Sección: Datos personales */}
                    <fieldset className="border border-gray-400 rounded-xl p-4" >
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                            Informacion de la empresa
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="nombre" className="block font-medium mb-1">
                                    Nombre
                                </label>
                                <input type="text" id="nombre" name="nombre" className={stylesInput} />
                            </div>

                            <div>
                                <label htmlFor="razon" className="block font-medium mb-1">
                                    Razon social
                                </label>
                                <input type="text" id="razon" name="razon" className={stylesInput} />
                            </div>
                            <div>
                                <label htmlFor="correo" className="block font-medium mb-1">
                                    Correo electrónico
                                </label>
                                <input type="email" id="correo" name="correo" className={stylesInput} />
                            </div>
                            <div>
                                <label htmlFor="telefono" className="block font-medium mb-1">
                                    Numero telefonico
                                </label>
                                <input type="number" id="telefono" name="telefono" placeholder="+528334652691" className={stylesInput} />
                            </div>

                            <div className="col-span-2  ">
                                <label htmlFor="departamento" className="block font-medium mb-1">
                                    Ubicacion
                                </label>
                                <input type="text" className={stylesInput} />
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
