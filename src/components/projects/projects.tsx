import {  Project } from "@/constants/index";
import  Projects  from "@/data/Projects.json";
import { useState } from "react";
import { CreateProject } from "./CreateProject";
import { FilterOfProjects } from "./FilterOfProjects";
import { ProjectDetailsModal } from "../modal/ProjectDetails";
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';

export function ListProjects() {
    const [showFilters, setShowFilters] = useState(false);
    const [showCreate, setCreate] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Definir columnas para react-table
    const columns = [
        {
            accessorKey: 'ordenInterna',
            header: 'Orden Interna',
            size: 120,
            enableResizing: true,
        },
        {
            accessorKey: 'nombre',
            header: 'Nombre de proyecto',
            size: 180,
            enableResizing: true,
        },
        {
            accessorKey: 'descripcion',
            header: 'Descripción',
            size: 220,
            enableResizing: true,
        },
        {
            accessorKey: 'cliente',
            header: 'Cliente',
            size: 120,
            enableResizing: true,
        },
        {
            accessorKey: 'estatus',
            header: 'Estatus',
            size: 100,
            enableResizing: true,
        },
        {
            accessorKey: 'departamento',
            header: 'Departamento',
            size: 140,
            enableResizing: true,
        },
        {
            accessorKey: 'responsable',
            header: 'Gerente de proyecto',
            size: 160,
            enableResizing: true,
        },
        {
            accessorKey: 'fechaIn',
            header: 'Fecha de inicio',
            size: 120,
            enableResizing: true,
        },
        {
            accessorKey: 'fechaFn',
            header: 'Fecha fin',
            size: 120,
            enableResizing: true,
        },
    ] as ColumnDef<Project>[];

    const table = useReactTable({
        data: Projects.proyectos,
        columns,
        getCoreRowModel: getCoreRowModel(),
        columnResizeMode: 'onChange',
    });

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
                <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white p-0 shadow-md dark:border-slate-700 dark:bg-slate-800">
                    <div className="relative max-h-[550px] min-h-[100px] w-full overflow-y-auto rounded-none [scrollbar-width:thin]">
                        <table className="table w-full min-w-max border-collapse">
                            <thead className="table-header">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id} className="table-row">
                                        {headerGroup.headers.map(header => (
                                            <th
                                                key={header.id}
                                                className="table-head relative group"
                                                style={{ width: header.getSize() }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getCanResize() && (
                                                    <div
                                                        onMouseDown={header.getResizeHandler()}
                                                        onTouchStart={header.getResizeHandler()}
                                                        className={`absolute right-0 top-0 h-full w-2 cursor-col-resize select-none group-hover:bg-blue-200 transition`}
                                                        style={{ zIndex: 10 }}
                                                    />
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="table-body">
                                {table.getRowModel().rows.map(row => (
                                    <tr
                                        key={row.id}
                                        onClick={() => setSelectedProject(row.original)}
                                        className="table-row h-10 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-slate-700"
                                    >
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id} className="table-cell">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
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
