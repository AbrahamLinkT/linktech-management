"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, UserPlus } from "lucide-react";
/* Importacion de componenetes propios */
import { ContentBody } from "@/components/containers/containers";
import { Btn_data } from "@/components/buttons/buttons";
/* impórtaciones de jsons */
import Projects from "@/data/Projects.json";
import staff from "@/data/staff.json"
import { DataTable } from "@/components/tables/table_master";



export default function Project() {

    // estados
    const [isEdith, setIsEdith] = useState(false);
    const [selectWorker, setSelectWorker] = useState<string[]>([]);
    const [tempSelectWorker, setTempSelectWorker] = useState<string[]>([]);
    const [activePanel, setActivePanel] = useState<"none" | "details" | "editHours">("none");


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



    return (
        <>
            <ContentBody
                title={`Proyecto: ${Proyecto?.titulo}`}
                btnReg={
                    <Btn_data
                        text="Regresar"
                        icon={<ArrowLeft />}
                        styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium hover:bg-blue-400 hover:text-white"
                        Onclick={handleClick}
                    />
                }
                subtitle="Detalles del Proyecto"
                contentSubtitleComponent={
                    <>
                        <div className="p-4">
                            {/* Aquí puedes dejar la info del proyecto como antes */}
                        </div>
                    </>
                }
            >
                <div className="mt-4">
                    <DataTable
                        data={selectWorker.map(id => {
                            const worker = staff.staff.find(p => p.id === id);
                            return worker
                                ? {
                                    id: worker.id,
                                    consultor: worker.consultor,
                                    especialidad: worker.especialidad,
                                    nivel: worker.nivel,
                                    tiempo: worker.tiempo,
                                    estatus: worker.estatus,
                                    esquema: worker.esquema,
                                    horas: "Horas",
                                }
                                : { id };
                        })}
                        columns={[
                            { accessorKey: "consultor", header: "Empleado" },
                            { accessorKey: "especialidad", header: "Especialidad" },
                            { accessorKey: "nivel", header: "Nivel" },
                            { accessorKey: "tiempo", header: "Tiempo" },
                            { accessorKey: "estatus", header: "Estatus" },
                            { accessorKey: "esquema", header: "Esquema" },
                            { accessorKey: "horas", header: "Horas" },
                        ]}
                        title_add="Agregar Trabajador"
                        ModalAdd={null} // Por ahora no mostramos modal de agregar
                        urlRoute="/dashboard" // Ruta a la que quieres redireccionar si usas modal de confirmación
                    />
                </div>

                <div className="flex justify-end pr-1 pt-2.5">
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

                    {activePanel !== "editHours" && (
                        <Btn_data
                            text={isEdith ? "Cancelar" : "Agregar"}
                            icon={isEdith ? "" : <UserPlus />}
                            styles={`
          mb-2 whitespace-nowrap rounded-lg border border-gray-400 px-4 py-2 text-sm font-medium ml-3
          ${isEdith ? "bg-red-500 text-white hover:bg-red-400" : "bg-transparent hover:bg-blue-400 hover:text-white"}
        `}
                            Onclick={handleClickEdith}
                        />
                    )}

                    {isEdith && (
                        <Btn_data
                            text="Guardar"
                            styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 px-4 py-2 text-sm font-medium bg-blue-500 text-white ml-3 hover:bg-blue-400 hover:text-white"
                            Onclick={handleClickSave}
                        />
                    )}
                </div>
            </ContentBody>

        </>
    );
}
