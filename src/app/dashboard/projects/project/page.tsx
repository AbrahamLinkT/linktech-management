"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, NotebookTabsIcon, UserPlus } from "lucide-react";
/* Importacion de componenetes propios */
import { ContentBody, ContentTable, ContentTrasition } from "@/components/containers/containers";
import { PanelLateral } from "@/components/modal/modals";
import { Calendario, EditorDeHoras } from "@/components/ui/calender";
import { Btn_data } from "@/components/buttons/buttons";
import { Table_1, Table_3 } from "@/components/tables/table";
/* impórtaciones de jsons */
import Projects from "@/data/Projects.json";
import staff from "@/data/staff.json"
import oi from "@/data/OI_Staff.json"
import { parseISO } from "date-fns";

export default function Project() {
    // estados
    const [isEdith, setIsEdith] = useState(false);
    const [isWorker, setWorker] = useState<string | null>(null);
    const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([]);
    const [selectWorker, setSelectWorker] = useState<string[]>([]);
    const [tempSelectWorker, setTempSelectWorker] = useState<string[]>([]);
    const [activePanel, setActivePanel] = useState<"none" | "details" | "editHours">("none");
    const [diasPorTrabajador, setDiasPorTrabajador] = useState<{ [id: string]: string[] }>({}); // guardar los días seleccionados por trabajador

    const transforDays = diasSeleccionados.map((d) => parseISO(d))


    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const route = useRouter();
    const Proyecto = Projects.proyectos.find((p) => p.id == id);

    if (!Proyecto) {
        return <div className="p-6 text-red-600">Proyecto no encontrado</div>;
    }

    const handleClick = () => {
        route.push("/dashboard/projects/");
    };
    // Maneja el cambio de estado para editar o agregar trabajadores
    const handleClickEdith = () => {
        const editing = !isEdith;
        setIsEdith(editing);
        if (editing) {
            setTempSelectWorker([...selectWorker]);
            setActivePanel("none"); // Asegúrate de cerrar cualquier otro panel al entrar
        } else {
            setTempSelectWorker([]);
            setActivePanel("none"); // <--- Aquí cierras el panel si estaba abierto
        }
    };

    const handleClickSave = () => {
        setSelectWorker([...tempSelectWorker]);
        setIsEdith(false);
        setTempSelectWorker([]);
    };

    // Maneja la edición de horas
    const handleEditHours = (index: number) => {
        const workerId = selectWorker[index];
        const worker = staff.staff.find(p => p.id === workerId);
        console.log("Editar horas de:", worker?.consultor, workerId);
        setWorker(workerId);
        setDiasSeleccionados(diasPorTrabajador[workerId] || []);
        setActivePanel("editHours");
    };


    return (
        <>
            <ContentTrasition
                IspanelOpen={activePanel !== "none" ? () => setActivePanel("none") : undefined}
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
                                            worker.tiempo,
                                            worker.estatus,
                                            worker.esquema,
                                            "Horas"
                                        ] : [];
                                    })}
                                    EventOnclick={activePanel === "editHours" ? handleEditHours : undefined}

                                />
                                <div className="flex justify-end pr-1 pt-2.5">
                                    {/* Mostrar botón de editar solo si no estás en modo agregar */}
                                    {!isEdith && (
                                        <Btn_data
                                            text={activePanel === "editHours" ? "Salir de edición" : "Horas"}
                                            icon={activePanel === "editHours" ? "" : <Edit />}
                                            styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 px-4 py-2 text-sm font-medium ml-3 bg-transparent hover:bg-blue-400 hover:text-white"
                                            Onclick={() => {
                                                setActivePanel(activePanel === "editHours" ? "none" : "editHours");
                                            }}
                                        />
                                    )}

                                    {/* Mostrar botón de agregar solo si no estás en modo edición de horas */}
                                    {activePanel !== "editHours" && (
                                        <Btn_data
                                            text={isEdith ? "Cancelar" : "Agregar"}
                                            icon={isEdith ? "" : <UserPlus />}
                                            styles={`
        mb-2 whitespace-nowrap rounded-lg border border-gray-400 px-4 py-2 text-sm font-medium ml-3
        ${isEdith
                                                    ? "bg-red-500 text-white hover:bg-red-400 hover:text-white"
                                                    : "bg-transparent hover:bg-blue-400 hover:text-white"}
      `}
                                            Onclick={handleClickEdith}
                                        />
                                    )}

                                    {/* Mostrar botón guardar solo si estás en modo agregar */}
                                    {isEdith && (
                                        <Btn_data
                                            text={"Guardar"}
                                            styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 px-4 py-2 text-sm font-medium bg-blue-500 text-white ml-3 hover:bg-blue-400 hover:text-white"
                                            Onclick={handleClickSave}
                                        />
                                    )}
                                </div>


                            </>
                        </ContentBody>
                        <ContentTable
                            Body={
                                isEdith && (
                                    <Table_1
                                        headers={["Seleccion", "Consultor", "Especialidad", "Nivel", "Estatus", "Esquema", "Disponibilidad"]}
                                        rows={staff.staff
                                            .filter((p) => !selectWorker.includes(p.id))
                                            .map((p) => [
                                                <input
                                                    key={p.id}
                                                    type="checkbox"
                                                    checked={tempSelectWorker.includes(p.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setTempSelectWorker([...tempSelectWorker, p.id]);
                                                        } else {
                                                            setTempSelectWorker(tempSelectWorker.filter(id => id !== p.id));
                                                        }
                                                    }}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />,
                                                p.consultor, p.especialidad, p.nivel, p.estatus, p.esquema,
                                                <Btn_data
                                                    key={p.id}
                                                    styles="text-black"
                                                    text="Detalles"
                                                    icon={<NotebookTabsIcon />}
                                                    Onclick={() => {
                                                        setWorker(p.id);
                                                        setActivePanel("details");
                                                    }}

                                                />
                                            ])}
                                    />
                                )
                            }
                        />
                    </>
                }
                panel={
                    <>
                        {
                            activePanel === "details" && (
                                <PanelLateral
                                    title="Disponibilidad"
                                    Open={true}
                                    close={() => setActivePanel("none")}
                                    content={
                                        <>
                                            <div>
                                                <Calendario
                                                    modoEdicion={false}
                                                    finesSeleccionables={false}
                                                    diasSeleccionados={[]} // se actualiza con los días seleccionados que tiene el trabajador
                                                    setDiasSeleccionados={() => { }}
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
                            )
                        }
                        {
                            activePanel === "editHours" && (
                                <PanelLateral
                                    title="Edición de horas"
                                    Open={true}
                                    close={() => {
                                        if (isWorker) {
                                            setDiasPorTrabajador(prev => ({
                                                ...prev,
                                                [isWorker]: diasSeleccionados,
                                            }));
                                        }
                                        setDiasSeleccionados([]);
                                        setActivePanel("none");
                                    }}
                                    content={
                                        <>
                                            <p>Trabajador:<strong> {isWorker}</strong></p>
                                            <Calendario
                                                modoEdicion={true}
                                                finesSeleccionables={false}
                                                diasSeleccionados={diasSeleccionados}
                                                setDiasSeleccionados={setDiasSeleccionados}
                                            />
                                            <EditorDeHoras
                                                dias={transforDays}
                                                oiFijo={Proyecto.ordenInterna}
                                                onCancelar={() => setActivePanel("none")}
                                                onGuardar={(oi) => {
                                                    console.log("Seleccionado:", oi);
                                                }}
                                            />

                                        </>
                                    }
                                />
                            )

                        }
                    </>

                }
            />

        </>
    );
}
