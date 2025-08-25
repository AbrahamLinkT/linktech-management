"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody, ContentTable, ContentTrasition } from "@/components/containers/containers";
import { SearchWorkers } from "@/components/filters/filters";
import { PanelLateral } from "@/components/modal/modals";
import ConfirmModal from "@/components/ConfirmModal";
import { Table_3 } from "@/components/tables/table";
import Modal from "@/components/Modal";
import { Edit, Archive, Trash2, Eye } from "lucide-react";

import Proj from "@/data/Projects.json";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Eliminado: importación no usada
export default function Projects_orin() {

    const [isModalOpen, setIsModalOpen] = useState(false);/*ESTE SE USA PARA EL MODAL POP UP */
    const [isPanelOpen, setIstPanelOpen] = useState(false);
    const [isProyect, setIsProyect] = useState<string | null>(null) // Eliminado: variable no usada
    const [showModal, setShowModal] = useState(false);/*ESTE SE USA PARA EL PANEL LATERAL */
    const [warningMessage, setWarningMessage] = useState(""); /*ESTE WARNINGMESSAGE SE UTILIZA PARA DIFERENCIAR ENTRE ARCHIVAR O BORRAR EN LA ETIQUETA */

    const router = useRouter()

    const togglePanel = () => {
        setIstPanelOpen(!isPanelOpen)
    }

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }
    const handleClick = (msg: string) => {
        setWarningMessage(msg);
        setShowModal(true);
    };
    // confirmacion de redireccionamiento
    const handleConfirm = () => {
        router.push(`/dashboard/projects/project?id=${isProyect}`)
        setShowModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
    };


    const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-1
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;
    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onConfirm={toggleModal}
                onCancel={toggleModal}
                body={
                    <>
                        <div>
                            <form action="">
                                {/* seccion de informacion del cliente */}
                                <fieldset className="border border-gray-400 rounded-xl p-4 mb-1">
                                    <legend className="text-lg font-semibold px-2 ml-2 mt-4">
                                        Proyecto
                                    </legend>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="OI" className="block font-medium mb-1">OI</label>
                                            <input type="text" className={stylesInput} id="OI" name="OI" />
                                        </div>
                                        <div>
                                            <label htmlFor="Empresa" className="block font-medium mb-1">Empresa</label>
                                            <input type="text" className={stylesInput} name="Empresa" id="Empresa" />
                                        </div>
                                        <div>
                                            <label htmlFor="proyecto" className="block font-medium mb-1">Proyecto</label>
                                            <input type="text" className={stylesInput} name="proyecto" id="proyecto" />
                                        </div>

                                        {/* Cliente como opción */}
                                        <div>
                                            <label htmlFor="cliente" className="block font-medium mb-1">Cliente</label>
                                            <select id="cliente" name="cliente" className={stylesInput}>
                                                <option value="">Selecciona un cliente</option>
                                                <option value="cliente1">Cliente 1</option>
                                                <option value="cliente2">Cliente 2</option>
                                                <option value="cliente3">Cliente 3</option>
                                            </select>
                                        </div>

                                        {/* Fecha inicio como calendario */}
                                        <div>
                                            <label htmlFor="fechIn" className="block font-medium mb-1">Fecha Inicio</label>
                                            <input type="date" className={stylesInput} name="fechIn" id="fechIn" />
                                        </div>

                                        {/* Fecha final como calendario */}
                                        <div>
                                            <label htmlFor="fechFn" className="block font-medium mb-1">Fecha Final</label>
                                            <input type="date" className={stylesInput} name="fechFn" id="fechFn" />
                                        </div>

                                        {/* Responsable como opción */}
                                        <div>
                                            <label htmlFor="responsable" className="block font-medium mb-1">Responsable</label>
                                            <select id="responsable" name="responsable" className={stylesInput}>
                                                <option value="">Selecciona un responsable</option>
                                                <option value="juan">Juan Pérez</option>
                                                <option value="ana">Ana García</option>
                                                <option value="luis">Luis Martínez</option>
                                            </select>
                                        </div>

                                        <div className="col-span-2">
                                            <label htmlFor="descripcion" className="block font-medium mb-1">Descripción</label>
                                            <textarea
                                                name="descripcion"
                                                id="descripcion"
                                                placeholder="Ej. Descripción detallada del proyecto..."
                                                className="w-full border border-gray-600 
                        resize-none rounded px-3 py-1
                        hover:border-blue-600 
                        focus:border-blue-500 
                        focus:ring-2 focus:ring-blue-300 
                        focus:outline-none"
                                            ></textarea>
                                        </div>
                                    </div>
                                </fieldset>

                            </form>
                        </div>
                    </>

                }
            >

            </Modal>


            <ContentTrasition
                IspanelOpen={isPanelOpen ? togglePanel : undefined}
                body={
                    <ContentBody
                        title="Proyectos">
                        <ContentTable
                            header={
                                <div className="flex">
                                    <SearchWorkers />
                                    <Btn_data
                                        text={"Nuevo Proyecto"} styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                                        Onclick={toggleModal}
                                    />
                                </div>
                            }
                            Body={
                                <>
                                    <Table_3
                                        headers={["Orden Interna", "Empresa", "Cliente", "Descripcion", "Fechas", "Estatus", "Responsable", "Acciones"]}
                                        rows={Proj.proyectos.map((p) => [p.ordenInterna, p.titulo, p.cliente, p.descripcion, `${p.fechaIn} - ${p.fechaFn}`, p.estatus, p.responsable,
                                        <div className="flex gap-2 justify-center" key={p.id}>
                                            <button className="p-1 rounded hover:bg-blue-100" title="Editar" onClick={() => {
                                                toggleModal();
                                            }}>
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-1 rounded hover:bg-yellow-100" title="Archivar" onClick={() => {
                                                const id = p.id;
                                                setIsProyect(id)
                                                handleClick("archivar")
                                            }}>
                                                <Archive size={18} />
                                            </button>
                                            <button className="p-1 rounded hover:bg-red-100" title="Borrar" onClick={() => {
                                                const id = p.id;
                                                setIsProyect(id)
                                                handleClick("eliminar")
                                            }}>
                                                <Trash2 size={18} />
                                            </button>
                                            <button className="p-1 rounded hover:bg-yellow-100" title="Archivar" onClick={() => {
                                                const id = p.id;
                                                setIsProyect(id)
                                                handleClick("archivar")
                                            }}>
                                                <Eye size={18} />
                                            </button>
                                        </div>,])}
                                        selectable={false}
                                    />
                                    <ConfirmModal
                                        isOpen={showModal}
                                        onConfirm={handleConfirm}
                                        onCancel={handleCancel}
                                        message={`¿Seguro que quieres ${warningMessage} ${isProyect} este proyecto?`}
                                    />
                                </>

                            }
                        />
                    </ContentBody>
                }

                /* panel lateral */
                panel={
                    <PanelLateral
                        Open={isPanelOpen}
                        close={togglePanel}
                        title="Creacion de nuevo proyecto"
                        content={
                            <>
                                <div>
                                    <form action="">
                                        {/* seccion de informacion del cliente */}
                                        <fieldset className="border border-gray-400 rounded-xl p-4 mb-1">
                                            <legend className="text-lg font-semibold px-2 ml-2 mt-4">
                                                Proyecto
                                            </legend>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="OI" className="block font-medium mb-1">OI</label>
                                                    <input type="text" className={stylesInput} id="OI" name="OI" />
                                                </div>
                                                <div>
                                                    <label htmlFor="Empresa" className="block font-medium mb-1">Empresa</label>
                                                    <input type="text" className={stylesInput} name="Empresa" id="Empresa" />
                                                </div>
                                                <div>
                                                    <label htmlFor="proyecto" className="block font-medium mb-1">Proyecto</label>
                                                    <input type="text" className={stylesInput} name="proyecto" id="proyecto" />
                                                </div>
                                                (feat: update dependencies and add new features)

                                                {/* Cliente como opción */}
                                                <div>
                                                    <label htmlFor="cliente" className="block font-medium mb-1">Cliente</label>
                                                    <select id="cliente" name="cliente" className={stylesInput}>
                                                        <option value="">Selecciona un cliente</option>
                                                        <option value="cliente1">Cliente 1</option>
                                                        <option value="cliente2">Cliente 2</option>
                                                        <option value="cliente3">Cliente 3</option>
                                                    </select>
                                                </div>

                                                {/* Fecha inicio como calendario */}
                                                <div>
                                                    <label htmlFor="fechIn" className="block font-medium mb-1">Fecha Inicio</label>
                                                    <input type="date" className={stylesInput} name="fechIn" id="fechIn" />
                                                </div>

                                                {/* Fecha final como calendario */}
                                                <div>
                                                    <label htmlFor="fechFn" className="block font-medium mb-1">Fecha Final</label>
                                                    <input type="date" className={stylesInput} name="fechFn" id="fechFn" />
                                                </div>

                                                {/* Responsable como opción */}
                                                <div>
                                                    <label htmlFor="responsable" className="block font-medium mb-1">Responsable</label>
                                                    <select id="responsable" name="responsable" className={stylesInput}>
                                                        <option value="">Selecciona un responsable</option>
                                                        <option value="juan">Juan Pérez</option>
                                                        <option value="ana">Ana García</option>
                                                        <option value="luis">Luis Martínez</option>
                                                    </select>
                                                </div>

                                                <div className="col-span-2">
                                                    <label htmlFor="descripcion" className="block font-medium mb-1">Descripción</label>
                                                    <textarea
                                                        name="descripcion"
                                                        id="descripcion"
                                                        placeholder="Ej. Descripción detallada del proyecto..."
                                                        className="w-full border border-gray-600 
                resize-none rounded px-3 py-1
                hover:border-blue-600 
                focus:border-blue-500 
                focus:ring-2 focus:ring-blue-300 
                focus:outline-none"
                                                    ></textarea>
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
                            </>

                        }
                    />
                }

            /></>
        /* final de trasition */
    );
}
