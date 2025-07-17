import  staff  from "@/data/staff.json";
type Props = {
    selectedIds: string[];
    onSelectChange: (ids: string[]) => void;
};
export default function TableOfSelectedWorkers({ selectedIds, onSelectChange }: Props) {
    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            onSelectChange(selectedIds.filter((i) => i !== id));
        } else {
            onSelectChange([...selectedIds, id]);
        }
    };
    return (
        <>
            <div className="p-1">
                {/* tabla */}
                <div className="overflow-hidden rounded-xl border border-gray-300 bg-white p-0 shadow-md dark:border-slate-700 dark:bg-slate-800">
                    <div className="relative max-h-[350px] min-h-[100px] w-full overflow-y-auto rounded-none [scrollbar-width:thin]">
                        <table className="table w-full min-w-max border-collapse">
                            <thead className="table-header">
                                <tr className="table-row">
                                    <th className="table-head">Seleccion</th>
                                    <th className="table-head">Consultor</th>
                                    <th className="table-head">Especialidad</th>
                                    <th className="table-head">Nivel</th>
                                    <th className="table-head">Departamento</th>
                                    <th className="table-head">Asignaciones</th>

                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {staff.staff.filter((person) => !selectedIds.includes(person.id)).map((person, index) => (
                                    <tr
                                        key={index}
                                        className="table-row h-10"
                                    >
                                        <td className="table-cell">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(person.id)}
                                                onChange={() => toggleSelect(person.id)}
                                            />{" "}
                                        </td>
                                        <td className="table-cell">{person.consultor}</td>
                                        <td className="table-cell">{person.especialidad}</td>
                                        <td className="table-cell">{person.nivel}</td>
                                        <td className="table-cell">{person.departamento}</td>
                                        <td className="table-cell"></td>
                                    
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
