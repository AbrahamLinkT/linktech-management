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
        router.push("/dashboard/usuarios")
    }
    return (
        <ContentBody title="Nuevo usuario"
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
                    <fieldset className="border border-gray-400 rounded-xl p-4">
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4">Seleccion de usuario</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="usuario" className="block font-medium mb-1">
                                    Usuario
                                </label>
                                <select name="usuario" id="usuario" className={stylesInput}>
                                    <option value="">Selecciona un usuario</option>
                                    <option value="mr">Miriam</option>
                                    <option value="sg">Santiago</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="acciones" className="block font-medium mb-1">
                                    Tipo de Acciones
                                </label>
                                <select name="acciones" id="acciones" className={stylesInput}>
                                    <option value="">Selecciona la accion</option>
                                    <option value="indefinido">Administrador</option>
                                    <option value="temporal">Consultor</option>
                                    <option value="prácticas">Cliente</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="estatus" className="block font-medium mb-1">
                                    Estatus
                                </label>
                                <select name="estatus" id="estatus" className={stylesInput}>
                                    <option value="">Selecciona la opción</option>
                                    <option value="asimilado">Activo</option>
                                    <option value="indeterminado">Inactivo</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="departamento" className="block font-medium mb-1">
                                    Rol
                                </label>
                                <select name="departamento" id="departamento" className={stylesInput}>
                                    <option value="">Selecciona la opción</option>
                                    <option value="delivery">Visitante</option>
                                    <option value="cobranza">Admin</option>
                                    <option value="rh">PM</option>
                                    <option value="programador">Delivery</option>
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
