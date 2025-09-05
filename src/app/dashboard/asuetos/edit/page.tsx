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
        router.push("/dashboard/asuetos")
    }

    const date = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fecha = new Date(e.target.value);
        const dia = fecha.getDay(); // 0 = domingo, 6 = sábado
        if (dia === 0 || dia === 6) {
            alert("No se permiten sábados ni domingos");
            e.target.value = ""; // limpia el input
        }
    }
    return (
        <ContentBody title="Editar asueto"
            btnReg={
                <Btn_data
                    icon={<ArrowLeft />}
                    text={"Regresar"}
                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                    Onclick={handleClickRoute}
                />
            }>
            <div className="m-1">
                <h2 className="text-2xl font-bold mb-6 ml-4">Editar días de asueto</h2>
                <form className="space-y-10 ml-4 mr-4">

                    <fieldset className="border border-gray-400 rounded-xl p-4" >
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                            Asignacion de dia asueto
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="nombre" className="block font-medium mb-1">
                                    Empleado
                                </label>
                                <div className="flex items-center gap-4">
                                    <select name="empleado" id="empleado" className={stylesInput}>
                                        <option value="">Seleccione empleado</option>
                                        <option value="activo">Jazmin</option>
                                        <option value="inactivo">Ivan</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="correo" className="block font-medium mb-1">
                                    Fecha inicio
                                </label>
                                <input type="date" id="fechaInicio" name="fechaInicio"
                                    className={stylesInput}
                                    onChange={date} />
                            </div>
                            <div>
                                <label htmlFor="correo" className="block font-medium mb-1">
                                    Fecha final
                                </label>
                                <input type="date" id="fechaFinal" name="fechaFinal" className={stylesInput} onChange={date} />
                            </div>
                            <div>
                                <label htmlFor="tiempo" className="block font-medium mb-1">Tiempo</label>
                                <div className="flex items-center gap-4">
                                    <select name="tiempo" id="tiempo" className={stylesInput}>
                                        <option value="">Seleccione su opción</option>
                                        <option value="activo">completo</option>
                                        <option value="inactivo">medio tiempo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="descripcion" className="block font-medium mb-1">
                                    Descripcion
                                </label>
                                <input type="text" id="descripcion" name="descripcion" className={stylesInput} />
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
