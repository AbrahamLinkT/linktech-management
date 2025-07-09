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
                                    <th className="table-head">Orden interna</th>
                                    <th className="table-head">Titulo</th>
                                    <th className="table-head">Descripcion</th>
                                    <th className="table-head">Estatus</th>
                                    <th className="table-head">Responsable</th>
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
                                        <td className="table-cell">{data.titulo}</td>
                                        <td className="table-cell">{data.descripcion}</td>
                                        <td className="table-cell">{data.estatus}</td>
                                        <td className="table-cell">{data.responsable}</td>
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
