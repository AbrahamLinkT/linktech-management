"use client";

import { ContentBody, ContentTable, ContentTrasition } from "@/components/containers/containers";
import { SearchWorkers } from "@/components/filters/filters";
import { PanelLateral } from "@/components/modal/modals";
import { Table_1 } from "@/components/tables/table";
import Calendario2 from "@/components/ui/calender";
import { useState } from "react";

export default function Disponibilidad() {
    const [isPanelOpen, setIsPanelOpen] = useState(false)
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    }
    return (
        <>
            <ContentTrasition
                IspanelOpen={isPanelOpen ? togglePanel : undefined}
                body={
                    <ContentBody
                        title="Disponibilidad de trabajadores"
                    >
                        <ContentTable
                            header={
                                <SearchWorkers />
                            }
                            Body={
                                <Table_1
                                    EventOnclick={() => setIsPanelOpen(true)}
                                    headers={["Nombre", "Apellido", "Email", "Telefono", "Disponibilidad"]}
                                    rows={[["Nombre", "Apellido", "Email", "Telefono", "Disponibilidad"]]}
                                />
                            }
                        />
                    </ContentBody>
                }
                panel={
                    <PanelLateral
                        Open={isPanelOpen}
                        close={togglePanel}
                        title="Disponibilidad del traabajador"
                        content={
                            <div>
                                <Calendario2 />
                            </div>
                        }
                    />
                }
            />
        </>
    )
}