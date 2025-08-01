"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, NotebookTabsIcon } from "lucide-react";
/* Importacion de componenetes propios */
import { ContentBody, ContentTable, ContentTrasition } from "@/components/containers/containers";
import { PanelLateral } from "@/components/modal/modals";
import { Calendario } from "@/components/ui/calender";
import { Btn_data } from "@/components/buttons/buttons";
import { Table_1, Table_3 } from "@/components/tables/table";
/* impórtaciones de jsons */
import Projects from "@/data/Projects.json";
import staff from "@/data/staff.json"
import oi from "@/data/OI_Staff.json"
export default function Project() {
    // estados
    const [isEdith, setIsEdith] = useState(false)
    const [isOpenPanel, setIsPanelOpen] = useState(false)
    const [isWorker, setWorker] = useState<string | null>(null)
    const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([])
    const [selectWorker, setSelectWorker] = useState<string[]>([])
    const searchParams = useSearchParams();

    const id = searchParams.get("id");
    const route = useRouter()
    const Proyecto = Projects.proyectos.find((p) => p.id == id)
    if (!Proyecto) {
        return <div className="p-6 text-red-600">Proyecto no encontrado</div>;
    }

    /* eventos */
    const handleClick = () => {
        route.push("/dashboard/projects/")
    }
    const handleClickEdith = () => {

        setIsEdith(!isEdith)
        if (isOpenPanel) {
            setIsPanelOpen(!isOpenPanel)
        }
    }
    const handleClickSave = () => {
        if (isOpenPanel) {
            setIsPanelOpen(!isOpenPanel)
        }
        if (isEdith) {
            setIsEdith(!isEdith)
        }
    }
    const togglePanel = () => {
        setIsPanelOpen(!isOpenPanel)
    }
    return (
        <>
            <ContentTrasition
                IspanelOpen={isOpenPanel ? togglePanel : undefined}
                body={
                    <>
                        <ContentBody
                            title={`Proyecto: ${Proyecto?.titulo}`}
                            btnReg={
                                <Btn_data
                                    text="Regresar"
                                    icon={<ArrowLeft />}
                                    styles={`mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white`}
                                    Onclick={handleClick}
                                />
                            }
                            subtitle="Detalles del Proyecto"
                            contentSubtitleComponent={
                                <>
                                    <div className="p-4">
                                        <div className="flex flex-col sm:flex-row flex-wrap gap-4">


                                            {/* Columna 1 - Información del Proyecto */}
                                            <div className="flex-1 min-w-[200px] space-y-3">
                                                <div>
                                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Orden Interna</h3>
                                                    <p className="text-md font-medium text-gray-900 dark:text-white">{Proyecto.ordenInterna}</p>
                                                </div>

                                                <div>
                                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Nombre del Proyecto</h3>
                                                    <p className="text-md font-medium text-gray-900 dark:text-white">{Proyecto.nombre}</p>
                                                </div>
                                            </div>

                                            {/* Columna 2 */}
                                            <div className="flex-1 min-w-[200px] space-y-3">
                                                <div>
                                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Cliente</h3>
                                                    <p className="text-md font-medium text-gray-900 dark:text-white">{Proyecto.cliente}</p>
                                                </div>

                                                <div>
                                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Descripción</h3>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{Proyecto.descripcion}</p>
                                                </div>
                                            </div>

                                            {/* Columna 3 */}
                                            <div className="flex-1 min-w-[200px] space-y-3">
                                                <div>
                                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Estatus</h3>
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                        En proceso
                                                    </span>
                                                </div>

                                                <div>
                                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Departamento</h3>
                                                    <p className="text-md font-medium text-gray-900 dark:text-white capitalize">{Proyecto.departamento}</p>
                                                </div>

                                                <div>
                                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Responsable</h3>
                                                    <p className="text-md font-medium text-gray-900 dark:text-white">{Proyecto.responsable}</p>
                                                </div>
                                            </div>

                                            {/* Columna 4 - Fechas */}
                                            <div className=" ">

                                                <div className=" dark:bg-gray-700 p-2 rounded-md">
                                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Fecha Inicio</h3>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{Proyecto.fechaIn}</p>
                                                </div>

                                                <div className=" dark:bg-gray-700 p-2 rounded-md">
                                                    <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Fecha Fin</h3>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{Proyecto.fechaFn}</p>
                                                </div>
                                            </div>
                                            <div className=" flex-1  flex items-center justify-center pr-5">
                                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-500 text-white text-3xl font-bold border-2 border-gray-200 dark:border-gray-600">
                                                    {Proyecto.nombre?.charAt(0).toUpperCase() || 'P'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            }
                        >
                            <>
                                <Table_3
                                    headers={["Empleado", "Especialidad", "Nivel", "Tiempo", "Estatus", "Esquema", "Horas"]}
                                    rows={selectWorker.map(id => {
                                        const worker = staff.staff.find(p => p.id === id);
                                        return worker ? [
                                            worker.consultor,
                                            worker.especialidad,
                                            worker.nivel,
                                            "Tiempo", // Ajustar según necesidad
                                            worker.estatus,
                                            worker.esquema,
                                            "Horas" // Ajustar según necesidad
                                        ] : [];
                                    })}
                                />
                                <div className="flex justify-end pr-1 pt-2.5">
                                    <Btn_data
                                        text={isEdith ? "Cancelar" : "Editar"}
                                        icon={isEdith ? "" : <Edit />}
                                        styles={`
                                mb-2 whitespace-nowrap rounded-lg border border-gray-400 px-4 py-2 text-sm font-medium
                                ${isEdith
                                                ? 'bg-red-500 text-white hover:bg-red-400 hover:text-white'
                                                : 'bg-transparent hover:bg-blue-400 hover:text-white'
                                            }
                                `}
                                        Onclick={handleClickEdith}
                                    />
                                    {
                                        isEdith && (
                                            <Btn_data
                                                text={"Guardar"}
                                                styles={"mb-2 whitespace-nowrap rounded-lg border border-gray-400 px-4 py-2 text-sm font-medium bg-blue-500 text-white ml-3 hover:bg-blue-400 hover:text-white"}
                                                Onclick={handleClickSave}
                                            />
                                        )
                                    }
                                </div>


                            </>
                        </ContentBody>
                        <ContentTable
                            Body={
                                <>
                                    {/* Esto solo se cargara cuando le den edith mientras la informacion no se solicita */}
                                    {isEdith && (
                                        <Table_1
                                            headers={["Seleccion", "Consultor", "Especialidad", "Nivel", "Estatus", "Esquema", "Disponibilidad"]}
                                            rows={staff.staff.map((p) => [
                                                <input
                                                    type="checkbox"
                                                    key={`checkbox-${p.id}`}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    /* logica de la seleccion */
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectWorker([...selectWorker, p.id])
                                                        } else {
                                                            setSelectWorker(selectWorker.filter(id => id !== p.id))
                                                        }
                                                    }}
                                                />,
                                                , p.consultor, p.especialidad, p.nivel, p.estatus, p.esquema,
                                                <Btn_data
                                                    key={p.id}
                                                    styles="text-black"
                                                    text="Detalles"
                                                    icon={<NotebookTabsIcon />}
                                                    Onclick={
                                                        () => {
                                                            setWorker(p.id)
                                                            setIsPanelOpen(true)
                                                        }
                                                    }
                                                />
                                            ]
                                            )
                                            }
                                        />
                                    )}
                                </>

                            }
                        />
                    </>
                }
                panel={
                    <PanelLateral
                        title="Disponibilidad"
                        Open={isOpenPanel}
                        close={togglePanel}
                        content={
                            <>
                                <div>
                                    <Calendario
                                        modoEdicion={false}
                                        finesSeleccionables={false}
                                        diasSeleccionados={diasSeleccionados}
                                        setDiasSeleccionados={setDiasSeleccionados}
                                    />
                                    {
                                        isWorker && oi.find(user => user.id_usuario == isWorker)?.ordenes_internas?.length ? (
                                            <>
                                                <div className="mt-4">
                                                    <Table_1
                                                        headers={["OI", "Empresa", "Fechas"]}
                                                        rows={oi.find(user => user.id_usuario == isWorker)!.ordenes_internas.map((orden) => [
                                                            orden.OI, orden.titulo, `${orden.fechaIn} - ${orden.fechaFn}`
                                                        ])}
                                                    />
                                                </div>
                                            </>
                                        ) :
                                            (
                                                <p>no tiene ningun proyecto asignado</p>
                                            )
                                    }
                                </div>
                            </>
                        }
                    />
                }
            />

        </>
    );
}
