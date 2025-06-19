import { workersAssigentdInTheProject } from "@/constants/index";
import staff from "@/data/staff.json"
import TableOfSelectedWorkers from "@/components/tables/PersonnelSelection";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react"
import Calendario from "@/components/modal/calendario"

/* agregar estado para actualizar la tabla a modificar  */
export default function TableWorkers({ OI }: { OI: string }) {
    const assignments = workersAssigentdInTheProject.filter((a) => a.ordenInterna === OI);
    const assignedStaffIds = assignments.map((a) => a.id_consultor);
    const assignedStaff = staff.staff.filter((person) => assignedStaffIds.includes(person.id));

    const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
    const [showEdit, setShowEdit] = useState(false)
    const [selectedWorker, setSelectedWorker] = useState<{ id: string; OI: string } | null>(null);

    const selectedStaff = staff.staff.filter((person) => selectedStaffIds.includes(person.id));

    const allAssigned = [...assignedStaff, ...selectedStaff].filter(
        (v, i, a) => a.findIndex((t) => t.id === v.id) === i, // evitar duplicados
    );

    /* data para mostrar modal */
    const handleEdit = (id: string) => {
        setSelectedWorker({ id, OI });
        setShowEdit(true);
    };
    /* elimnar al usuario seleccionado  */
    const handleDelet = (id: string) => {
        console.log("usuario eliminado", id);
        setSelectedStaffIds((prev) => prev.filter((i) => i !== id))

    }
    /* actualizacion de estado pora mostrar modal */
    return (
        <>
            <div className="p-1">
                <div className="overflow-hidden rounded-xl border border-gray-300 bg-white p-0 shadow-md dark:border-slate-700 dark:bg-slate-800">
                    <div className="relative max-h-[350px] min-h-[100px] w-full overflow-y-auto rounded-none [scrollbar-width:thin]">
                        <table className="table w-full min-w-max border-collapse">
                            <thead className="table-header bg-sky-300">
                                <tr className="table-row">
                                    <th className="table-head">Empleado</th>
                                    <th className="table-head">Especialidad</th>
                                    <th className="table-head">Nivel</th>
                                    <th className="table-head">Tiempo</th>
                                    <th className="table-head">Total hrs</th>
                                    <th className="table-head"></th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {allAssigned.map((person, index) => (
                                    <tr
                                        key={index}
                                        className="table-row h-10"
                                    >
                                        <td className="table-cell">{person.consultor}</td>
                                        <td className="table-cell">{person.especialidad}</td>
                                        <td className="table-cell">{person.nivel}</td>
                                        <td className="table-cell">{person.departamento}</td>
                                        <td className="table-cell"></td>
                                        <td className="table-cell">
                                            <div className="flex gap-4 m-0 p-0 w-3 pr-3">
                                                <button className="text-sky-400 hover:text-sky-600 cursor-pointer" onClick={() => { handleEdit(person.id) }}> <Pencil /></button>
                                                <button className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => { handleDelet(person.id) }} > <Trash2 /> </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {assignedStaff.length === 0 && (
                <TableOfSelectedWorkers
                    selectedIds={selectedStaffIds}
                    onSelectChange={setSelectedStaffIds}
                />
            )}


            {/* mostrar modal */}
            {showEdit && selectedWorker && (
                <Calendario
                    onclose={() => setShowEdit(false)}
                    workerId={selectedWorker.id}
                    ordenInterna={selectedWorker.OI}
                />
            )}
        </>
    );
}
