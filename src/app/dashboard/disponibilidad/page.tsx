"use client";

import { ContentBody, ContentTable, ContentTrasition } from "@/components/containers/containers";
import { SearchWorkers } from "@/components/filters/filters";
import { PanelLateral } from "@/components/modal/modals";
import { Table_1, Table_3 } from "@/components/tables/table";
import Calendario2 from "@/components/ui/calender";
import { useState } from "react";
import staf from "@/data/staff.json";
import oi from "@/data/OI_Staff.json"
export default function Disponibilidad() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <ContentTrasition
            IspanelOpen={isPanelOpen ? togglePanel : undefined}
            body={
                <ContentBody title="Disponibilidad de trabajadores">
                    <ContentTable
                        header={<SearchWorkers />}
                        Body={
                            <Table_3
                                headers={["Consultor", "Especialidad", "Departamento", "Esquema", "Status"]}
                                rows={staf.staff.map((p) => [p.consultor, p.especialidad, p.departamento, p.esquema, p.estatus])}
                                EventOnclick={(index) => {
                                    const id = staf.staff[index].id;
                                    setSelectedWorkerId(id);
                                    setIsPanelOpen(true);
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
                            <Calendario2
                                idUsuario={selectedWorkerId}
                                ordenesInternas={
                                    selectedWorkerId
                                        ? oi.find((user) => user.id_usuario === selectedWorkerId)?.ordenes_internas ?? []
                                        : []
                                }
                                Table_info={selectedWorkerId && oi.find(user => user.id_usuario === selectedWorkerId)?.ordenes_internas?.length ? (
                                    <Table_1
                                        headers={["OI", "Empresa", "Fechas"]}
                                        rows={oi.find(user => user.id_usuario === selectedWorkerId)!.ordenes_internas.map((orden) => [
                                            orden.OI,
                                            orden.titulo,
                                            `${orden.fechaIn} - ${orden.fechaFn}`
                                        ])}
                                    />
                                ) : (
                                    <p>No hay órdenes internas para este trabajador.</p>
                                )}
                            />
                        </div>
                    }
                />
            }
        />
    );
}
