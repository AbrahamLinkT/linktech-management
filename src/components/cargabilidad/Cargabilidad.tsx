import { useState } from 'react';
import { useRouter } from 'next/navigation';
import staf from '@/data/staff.json';
import { SearchWorkers } from '@/components/filters/filters';
import { Table_1 } from '@/components/tables/table';
import { ContentBody, ContentTable } from '@/components/containers/containers';
import { PanelLateral } from '@/components/modal/modals';

export default function CargabilidadComponent() {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const router = useRouter();

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };

    return (
        <div className="relative flex">
            <div className={`transition-all duration-300 ${isPanelOpen ? 'w-[calc(100%-25%)] pr-4' : 'w-full pr-4'}`}>
                <ContentBody title="Cargabilidad">
                    <ContentTable
                        header={
                          <div className="flex flex-col md:flex-row md:items-center gap-4 w-full justify-between">
                            <div className="flex-1">
                              <SearchWorkers />
                            </div>
                            <div>
                              <button
                                className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 shadow transition-colors duration-200"
                                onClick={() => router.push('/dashboard/cargabilidad/resumen')}
                              >
                                Ver resumen
                              </button>
                            </div>
                          </div>
                        }
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
            <PanelLateral
                title='Informacion de horas y proyectos'
                Open={isPanelOpen}
                close={togglePanel}
            />
        </div>
    );
}
