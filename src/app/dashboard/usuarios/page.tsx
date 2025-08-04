"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import user from '@/data/usuarios.json';
import { SearchWorkers } from '@/components/filters/filters';
import { Table_1 } from '@/components/tables/table';
import { ContentBody, ContentTable } from '@/components/containers/containers';
import { PanelLateral } from '@/components/modal/modals';


export default function UsersComponent() {

    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const router = useRouter();

    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
    };
  return(
    <div className="relative flex">
                <div className={`transition-all duration-300 ${isPanelOpen ? 'w-[calc(100%-25%)] pr-4' : 'w-full pr-4'}`}>
                    <ContentBody title="Usuarios">
                        <ContentTable
                            header={
                              <div className="flex flex-col md:flex-row md:items-center gap-4 w-full justify-between">
                                <div className="flex-1">
                                  <SearchWorkers />
                                </div>
                              </div>
                            }
                            Body={
                                <Table_1
                                    headers={["Nombre", "Correo", "Rol", "Estatus"]}
                                    rows={user.usuarios.map((u) => [
                                        u.nombre_empleado,
                                        u.correo,
                                        u.rol,
                                        u.estatus
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