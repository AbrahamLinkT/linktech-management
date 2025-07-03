"use client";
import { Projects } from "@/constants/index";
import { useRouter } from "next/navigation"; 
import { useEffect, useState } from "react";
import { Project } from "@/constants/index";
/* checar el centrado del modal  */
export function CreateProject({ showCreate, onClose }: { showCreate: boolean; onClose: () => void }) {
 const router = useRouter();

    const [fechIn, setFechIn] = useState("");
    const [fechFn, setFechFn] = useState("");
    const [totalHoras, setTotalHoras] = useState(0);

    // Inputs nuevos
    const [ordenInterna, setOrdenInterna] = useState("");
    const [nombre, setNombre] = useState("");
    const [cliente, setCliente] = useState("");
    const [estatus, setEstatus] = useState("Activo");
    const [departamento, setDepartamento] = useState("");
    const [responsable, setResponsable] = useState("");
    const [descripcion, setDescripcion] = useState("");

    useEffect(() => {
        if (fechIn && fechFn) {
            const diasHabiles = contarDiasHabiles(fechIn, fechFn);
            setTotalHoras(diasHabiles * 8);
        }
    }, [fechIn, fechFn]);

    const handleGuardar = () => {
        // Crear nuevo id
        const lastId = Projects[Projects.length - 1]?.id || "0";
        const newId = (parseInt(lastId) + 1).toString();

        const nuevoProyecto: Project = {
            id: newId,
            ordenInterna,
            nombre,
            descripcion,
            cliente,
            estatus,
            departamento,
            responsable,
            fechaIn: fechIn,
            fechaFn: fechFn,
            titulo: nombre,
        };

        // Simulación de guardado (solo en memoria temporal, no persistente)
        Projects.push(nuevoProyecto);

        // Redirigir a detalle del nuevo proyecto
        router.push(`/dashboard/project?id=${newId}`);
    };

    if (!showCreate) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="relative max-h-[1000px] rounded-xl border border-gray-300 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-xl font-bold text-gray-500 hover:text-red-500"
                >
                    ×
                </button>

                <p className="mb-6 text-lg font-semibold text-gray-700 dark:text-gray-100">Crear proyecto</p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Orden interna:</label>
                        <input
                            type="text"
                            placeholder="Ej. 12345"
                            value={ordenInterna}
                            onChange={(e)=>setOrdenInterna(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre de proyecto:</label>
                        <input
                            type="text"
                            placeholder="Ej. Implementación SAP"
                            value={nombre}
                            onChange={(e)=>setNombre(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div className="col-span-2 row-span-2 row-start-2 w-full">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Descripción:</label>
                        <textarea
                            value={descripcion}
                            onChange={(e)=>setDescripcion(e.target.value)}
                            placeholder="Ej. Descripción detallada del proyecto..."
                            className="h-full w-full resize-none overflow-y-auto rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                        ></textarea>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Cliente:</label>
                        <input
                            type="text"
                            placeholder="Ej. Empresa XYZ"
                            value={cliente}
                            onChange={(e)=>setCliente(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Estatus:</label>
                        <select
                            value={estatus}
                            onChange={(e)=>setEstatus(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                        >
                            <option value="Activo">Activo</option>
                            <option value="Detenido">Detenido</option>
                            <option value="Cerrado">Cerrado</option>
                        </select>
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Departamento:</label>
                        <input
                            type="text"
                            value={departamento}
                            onChange={(e)=>setDepartamento(e.target.value)}
                            placeholder="Ej. Tecnología"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Gerente de proyecto:</label>
                        <input
                            type="text"
                            value={responsable}
                            onChange={(e)=>setResponsable(e.target.value)}
                            placeholder="Ej. Juan Pérez"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div className="sm:col-span-1 lg:col-span-1">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Fecha de inicio:</label>
                        <input
                            type="date"
                            value={fechIn}
                            onChange={(e) => setFechIn(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div className="sm:col-span-1 lg:col-start-3 lg:row-start-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Fecha fin:</label>
                        <input
                            type="date"
                            value={fechFn}
                            onChange={(e) => setFechFn(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                        />
                    </div>
                    <div className="col-start-4 row-start-3">
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Total de horas:</label>
                        <input
                            type="number"
                            min={0}
                            value={totalHoras}
                            onChange={e => setTotalHoras(Number(e.target.value))}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                        />
                    </div>

                    <div className="col-span-full mt-4 flex justify-end px-1.5">
                        <button onClick={handleGuardar} className="rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white">
                            Aceptar cambios
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function contarDiasHabiles(fechaInicio: string, fechaFin: string): number {
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);

    let totalDias = 0;

    while (start <= end) {
        const dia = start.getDay(); // 0 = domingo, 6 = sábado
        if (dia !== 0 && dia !== 6) {
            totalDias++;
        }
        start.setDate(start.getDate() + 1);
    }

    return totalDias;
}
