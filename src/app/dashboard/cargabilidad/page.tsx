"use client";
import { useState } from 'react';
import staf from "@/data/staff.json";
import { SearchWorkers } from "@/components/filters/filters";
import { Table_1 } from "@/components/tables/table";
import { ContentBody, ContentTable } from "@/components/containers/containers";
import { PanelLateral } from '@/components/modal/modals';

export default function Cargabilidad() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <div className="relative flex">
            {/* Contenido principal */}
            <div className={`transition-all duration-300 ${isPanelOpen ? 'w-[calc(100%-25%)] pr-4' : 'w-full pr-4'}`}>
                <ContentBody title="Cargabilidad">
                    <ContentTable
                        header={<SearchWorkers />}
                        Body={
                            <Table_1
                                headers={["Consultor", "Especialidad", "Departamento", "Esquema", "Tiempo", "Estatus", ""]}
                                rows={staf.staff.map((p) => [
                                    p.consultor,
                                    p.especialidad,
                                    p.departamento,
                                    p.esquema,
                                    p.tiempo,
                                    p.estatus,
                                    <button
                                        key={p.consultor}
                                        onClick={togglePanel}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        {isPanelOpen ? "Ocultar" : "Mostrar"}
                                    </button>
                                ])}
                            />
                        }
                    />
                </ContentBody>
            </div>

            {/* Panel lateral */}
            <PanelLateral
                title='Informacion de horas y proyectos'
                Open={isPanelOpen}
                close={togglePanel}
            />



        </div>
    );
}