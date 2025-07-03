"use client";

import { X } from "lucide-react";
import { Project } from "@/constants/index";
import { useRouter } from "next/navigation"; // <--- ojo aquí

interface Props {
    project: Project;
    onClose: () => void;
}

export function ProjectDetailsModal({ project, onClose }: Props) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/dashboard/project?id=${project.id}`);
    };

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-slate-800">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-slate-600"
                >
                    <X className="h-5 w-5 text-gray-700 dark:text-white" />
                </button>

                <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Detalles del Proyecto</h2>

                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-200">
                    <p>
                        <strong>Orden Interna:</strong> {project.ordenInterna}
                    </p>
                    <p>
                        <strong>Nombre del proyecto:</strong> {project.titulo}
                    </p>
                    <p>
                        <strong>Nombre:</strong> {project.nombre}
                    </p>
                    <p>
                        <strong>Cliente:</strong> {project.cliente}
                    </p>
                    <p>
                        <strong>Departamento:</strong> {project.departamento}
                    </p>
                    <p>
                        <strong>Descripción:</strong> {project.descripcion}
                    </p>
                    <p>
                        <strong>Estatus:</strong> {project.estatus}
                    </p>
                    <p>
                        <strong>Responsable:</strong> {project.responsable}
                    </p>
                    <p>
                        <strong>Fechas:</strong> {project.fechaIn} → {project.fechaFn}
                    </p>
                </div>

                <div className="col-span-full mt-4 flex justify-end px-1.5">
                    <button
                        onClick={handleClick}
                        className="rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                    >
                        Ver más detalles
                    </button>
                </div>
            </div>
        </div>
    );
}
