"use client"

import { ContentBody, ContentTable } from "@/components/containers/containers"
import { Table_2 } from "@/components/tables/table"
import Clientes from "@/data/clientes.json"
import { Btn_data } from "@/components/buttons/buttons"
import { SearchWorkers } from "@/components/filters/filters"
import { useState } from "react"
import { PanelLateral } from "@/components/modal/modals"
export default function Client() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [isPanelOpen2, setIsPanelOpen2] = useState(false);
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    }
    const togglePanel2 = () => {
        setIsPanelOpen2(!isPanelOpen2);
        console.log(isPanelOpen2);
    }
    const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-1
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;
    return (
        <div className="relative flex">
            <div className={`transition-all duration-300 ${isPanelOpen || isPanelOpen2 ? 'w-[calc(100%-25%)] pr-4' : 'w-full pr-4'}`}>

                <ContentBody
                    title="Clientes"
                >
                    <ContentTable
                        header={
                            <>
                                <div className="flex">
                                    <SearchWorkers />
                                    <Btn_data
                                        text={isPanelOpen ? "Ocultar panel" : "Nuevo Cliente"}
                                        styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                                        Onclick={togglePanel}
                                    />

                                </div>

                            </>
                        }
                        Body={
                            <Table_2
                                headers={["Nombre Corto", "Razon social", "Email", "telefono", "Direccion", "Contacto", "cargo"]}
                                EventOnclick={onclick => togglePanel2()}
                                rows={Clientes.map((p) => [p.nombre_corto, p.razon_social, p.detalles.email, p.detalles.telefono, p.detalles.direccion, p.detalles.contacto, p.detalles.cargo])}
                            />
                        }
                    />
                </ContentBody>
            </div>

            {/* Panel lateral */}
            <PanelLateral
                title="Creacion de nuevo cliente"
                Open={isPanelOpen}
                close={togglePanel}
                content={
                    <div >
                        <form action="">
                            {/* seccion de informacion del cliente */}

                            <fieldset className="border border-gray-400 rounded-xl p-4 mb-1">
                                <legend className="text-lg font-semibold px-2 ml-2 mt-4">
                                    Datos del cliente
                                </legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="NombreCl" className="block font-medium mb-1">Nombre</label>
                                        <input type="text" className={stylesInput} id="NombreCl" name="NombreCl" />
                                    </div>
                                    <div>
                                        <label htmlFor="contacto" className="block font-medium mb-1">Contacto</label>
                                        <input type="text" className={stylesInput} name="contacto" id="contacto" />
                                    </div>
                                    <div>
                                        <label htmlFor="cargo" className="block font-medium mb-1">Cargo</label>
                                        <input type="text" className={stylesInput} name="cargo" id="cargo" />
                                    </div>
                                </div>
                            </fieldset>
                            {/* Secion de nombre de empresa */}
                            <fieldset className="border border-gray-400 rounded-xl p-4 mb-4">
                                <legend className="text-lg font-semibold px-2 ml-2 mt-4">
                                    Datos de la compañía
                                </legend>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="nombre" className="block font-medium mb-1">
                                            Nombre Corto
                                        </label>
                                        <input type="text" id="nombre" name="nombre" className={stylesInput} />
                                    </div>

                                    <div>
                                        <label htmlFor="razon_social" className="block font-medium mb-1">
                                            Razon social
                                        </label>
                                        <input type="text" id="razon_social" name="razon_social" className={stylesInput} />
                                    </div>
                                    <div>
                                        <label htmlFor="RFC" className="block font-medium mb-1">RFC/NIT/RUC</label>
                                        <input type="text" id="RFC" name="RFC" className={stylesInput} />
                                    </div>
                                    <div>
                                        <label htmlFor="dr" className="block font-medium mb-1">
                                            Direccion
                                        </label>
                                        <input type="text" id="dr" name="dr" className={stylesInput} />
                                    </div>
                                    <div>
                                        <label htmlFor="Email" className="block font-medium mb-1" >Email</label>
                                        <input type="text" className={stylesInput} name="email" />
                                    </div>
                                    <div>
                                        <label htmlFor="telefono" className="block font-medium mb-1">Telefono</label>
                                        <input type="text" id="telefono" name="telefono" className={stylesInput} />
                                    </div>
                                </div>
                            </fieldset>
                            {/* Botón de guardar */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
                                >
                                    Registrar
                                </button>
                            </div>
                        </form>
                    </div>
                }
            />
            {/* panel lateral 2 */}
            <PanelLateral
                title="Panel lateral 2"
                Open={isPanelOpen2}
                close={togglePanel2}
            />
        </div>
    )
}