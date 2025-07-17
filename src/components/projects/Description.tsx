import Projects from "@/data/Projects.json";
import TableWorkers from "@/components/projects/Workers";
import ButtonFilterWork, { ButtonSave } from "../buttons/buttons";
import { FilterStaff } from "../filters/filters";
import { useState } from "react";
/* ruta de json @/data/proyecto */
/* modificar para poder visualizar */
export default function ProjectDescription({ id }: { id: string }) {
    const [showFilters, setShowFilters] = useState(false); // Estado compartido

    const proyecto = Projects.proyectos.find((p) => p.id === id);
    if (!proyecto) {
        return <div className="p-6 text-red-600">Proyecto no encontrado</div>;
    }

    return (
        <>
            <div className="p-1">
                <h2 className="mb-4 text-2xl font-bold">{proyecto.titulo}</h2>

                <div className="rounded-xl border border-gray-300 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-slate-800">
                    <h3 className="mb-4 text-lg font-semibold text-gray-700 dark:text-white">Datos del Proyecto</h3>

                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        {/* Columna 1 */}
                        <div className="space-y-1">
                            <Item
                                label="Orden Interna"
                                value={proyecto.ordenInterna}
                            />
                            <Item
                                label="Nombre del Proyecto"
                                value={proyecto.nombre}
                            />
                            <Item
                                label="Cliente"
                                value={proyecto.cliente}
                            />
                            <Item
                                label="Descripción"
                                value={proyecto.descripcion}
                            />
                        </div>

                        {/* Columna 2 */}
                        <div className="space-y-1">
                            <Item
                                label="Estatus"
                                value="En progreso"
                            />{" "}
                            {/* Placeholder */}
                            <Item
                                label="Departamento"
                                value={proyecto.departamento}
                            />
                            <Item
                                label="Responsable"
                                value={proyecto.responsable}
                            />
                            <div className="grid grid-cols-2 rounded-md p-1">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Fecha Inicio</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{proyecto.fechaIn}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Fecha Fin</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{proyecto.fechaFn}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="m-1 flex gap-1.5 p-1">
                <ButtonFilterWork
                    showFilters={showFilters}
                    toggleFilters={() => setShowFilters((prev: boolean) => !prev)}
                />
                <ButtonSave />
            </div>
            <FilterStaff showFilters={showFilters} />
            <TableWorkers OI={proyecto.ordenInterna} />

        </>
    );
}

function Item({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col rounded-md p-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
            <span className="font-medium text-gray-900 dark:text-white">{value}</span>
        </div>
    );
}
