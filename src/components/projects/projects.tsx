import {  Project } from "@/constants/index";
import  Projects  from "@/data/Projects.json";
import { useState } from "react";
import { CreateProject } from "./CreateProject";
import { FilterOfProjects } from "./FilterOfProjects";
import { ProjectDetailsModal } from "../modal/ProjectDetails";
export function ListProjects() {
    const [showFilters, setShowFilters] = useState(false);
    const [showCreate, setCreate] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <>
            <div className="p-1">
                <h2 className="mb-4 text-2xl font-bold">Proyectos</h2>
                {/* contenedor de botones */}
                <div className="mb-4 flex">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                    >
                        {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
                    </button>

                    <button
                        onClick={() => setCreate(!showCreate)}
                        className="ml-4 rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                    >
                        Crear nuevo proyecto
                    </button>
                </div>
                {/* contenedor de modal crear proyecto */}
                <CreateProject
                    showCreate={showCreate}
                    onClose={() => setCreate(false)}
                />
                {/* contenedor de busqueda */}
                <FilterOfProjects showFilters={showFilters} />
                <div className="overflow-hidden rounded-xl border border-gray-300 bg-white p-0 shadow-md dark:border-slate-700 dark:bg-slate-800">
                    <div className="relative max-h-[550px] min-h-[100px] w-full overflow-y-auto rounded-none [scrollbar-width:thin]">
                        <table className="table w-full min-w-max border-collapse">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">Orden Interna</th>
                                    <th className="table-head">Nombre de proyecto</th>
                                    <th className="table-head">Descripción</th>
                                    <th className="table-head">Cliente</th>
                                    <th className="table-head">Estatus</th>
                                    <th className="table-head">Departamento</th>
                                    <th className="table-head">Gerente de proyecto</th>
                                    <th className="table-head">Fecha de inicio</th>
                                    <th className="table-head">Fecha fin</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {Projects.proyectos.map((data, index) => (
                                    <tr
                                        key={index}
                                        onClick={() => setSelectedProject(data)}
                                        className="table-row h-10 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
                                    >
                                        <td className="table-cell">{data.ordenInterna}</td>
                                        <td className="table-cell">{data.nombre}</td>
                                        <td className="table-cell">{data.descripcion}</td>
                                        <td className="table-cell">{data.cliente}</td>
                                        <td className="table-cell">{data.estatus}</td>
                                        <td className="table-cell">{data.departamento}</td>
                                        <td className="table-cell">{data.responsable}</td>
                                        <td className="table-cell">{data.fechaIn}</td>
                                        <td className="table-cell">{data.fechaFn}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Mostrar datos del proyecto */}
                {selectedProject && (
                    <ProjectDetailsModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </div>
        </>
    );
}
