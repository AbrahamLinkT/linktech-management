"use client";

import { ContentBody, ContentTable, ContentTrasition } from "@/components/containers/containers";
import { SearchWorkers } from "@/components/filters/filters";
import { PanelLateral } from "@/components/modal/modals";
import { useState } from "react";
import staf from "@/data/staff.json";
import { Calendario, EditorDeHoras } from "@/components/ui/calender";
import { Table_1, Table_3 } from "@/components/tables/table";
import oi from "@/data/OI_Staff.json"
import { Pencil } from "lucide-react";
import { parseISO } from "date-fns";
import { Btn_data } from "@/components/buttons/buttons";

import { useRouter } from "next/navigation"; // si usas App Router


export default function Workers() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
    const [edith, setEdith] = useState(false);
    const [diasSeleccionadosStr, setDiasSeleccionadosStr] = useState<string[]>([]);

    // Convierte a Date[] para lo que necesites
    const diasSeleccionados = diasSeleccionadosStr.map((d) => parseISO(d));
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
        setEdith(false);
        setDiasSeleccionadosStr([]); // Limpia también al cerrar el panel
    };
    const handleClick = () => {
        setEdith(!edith);
    }
    // Función para limpiar y cerrar edición (cancelar)
    const handleCancelarEdicion = () => {
        setEdith(false);
        setDiasSeleccionadosStr([]);
    };
    // Función para guardar y limpiar selección (guardado)
    const handleGuardarEdicion = (
        horasPorDia: { [key: string]: number },
        ordenInternaOI: string
    ) => {
        console.log("Guardar horas:", horasPorDia);
        console.log("Orden Interna:", ordenInternaOI);

        setEdith(false);
        setDiasSeleccionadosStr([]); // limpia días seleccionados al guardar
    };

    const ordenesInternas = selectedWorkerId
        ? oi.find(user => user.id_usuario === selectedWorkerId)?.ordenes_internas ?? []
        : [];
    const router = useRouter()

    const handleClickRoute = () => {
        router.push("/dashboard/new_worker")
    }
    return (
        <ContentTrasition
            IspanelOpen={isPanelOpen ? togglePanel : undefined}
            body={
                <ContentBody title="Trabajadores">
                    <ContentTable
                        header={
                            <div className="flex">
                                <SearchWorkers />
                                <Btn_data
                                    text={"Nuevo Trabajador"} styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                                    Onclick={handleClickRoute}
                                />
                            </div>
                        }
                        Body={
                            <Table_3
                                headers={["Consultor", "Especialidad", "Departamento", "Esquema", "Status"]}
                                rows={staf.staff.map((p) => [p.consultor, p.especialidad, p.departamento, p.esquema, p.estatus])}
                                EventOnclick={(index) => {
                                    const id = staf.staff[index].id;
                                    setSelectedWorkerId(id);
                                    setIsPanelOpen(true);
                                    setEdith(false);
                                }}
                            />

                        }
                    />
                </ContentBody>
            }
            panel={
                <PanelLateral
                    Open={isPanelOpen}
                    close={togglePanel}
                    title="Disponibilidad del trabajador"
                    content={
                        <div>
                            <p>El id del trabajador es: <strong>{selectedWorkerId}</strong></p>
                            <Calendario
                                modoEdicion={edith}
                                finesSeleccionables={false}
                                diasSeleccionados={diasSeleccionadosStr}
                                setDiasSeleccionados={setDiasSeleccionadosStr}
                            />
                            {!edith && (
                                <>
                                    {selectedWorkerId && oi.find(user => user.id_usuario === selectedWorkerId)?.ordenes_internas?.length ? (
                                        <>
                                            <div className="flex justify-end mt-1.5 mb-3">
                                                <button
                                                    className="flex items-center gap-1 cursor-pointer border rounded px-2 py-1 bg-gray-100 text-sky-400 hover:bg-sky-500 hover:text-white"
                                                    onClick={handleClick}
                                                >
                                                    <span className="ml-1.5">Editar</span>
                                                    <Pencil />
                                                </button>
                                            </div>

                                            <div className="mt-4">
                                                <Table_1
                                                    headers={["OI", "Empresa", "Fechas"]}
                                                    rows={oi.find(user => user.id_usuario === selectedWorkerId)!.ordenes_internas.map((orden) => [
                                                        orden.OI,
                                                        orden.titulo,
                                                        `${orden.fechaIn} - ${orden.fechaFn}`
                                                    ])}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <p>No hay órdenes internas para este trabajador.</p>
                                    )}
                                </>
                            )}

                            {edith && (
                                <EditorDeHoras
                                    dias={diasSeleccionados}
                                    ordenesInternas={ordenesInternas}
                                    onGuardar={handleGuardarEdicion}
                                    onCancelar={handleCancelarEdicion}
                                />
                            )}

                        </div>
                    }
                />
            }
        />
    );
}

/*  return(
     <>
     <DataTable />
     </>
 ) */
