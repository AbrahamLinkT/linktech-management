'use client';
import staf from "@/data/staff.json"
import { Btn_data } from "../buttons/buttons";
import { useRef, useState } from "react";
import { SearchWorkers } from "../filters/filters";
import { DetailsWorkers } from "../modal/modals";
export default function DataTable() {
  // referencia al elemento del dialogo 
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectId, setSelectId] = useState<string|null>(null)
  // abrur y cerrar modal 
  const handleClick = () => {
    dialogRef.current?.showModal();
  }
  const handleClose = () => {
    dialogRef.current?.close();
  }

  // mostrar el menu de obciens y capturar el valor 
  const toggleMenu = (id: string) => {
    setMenuOpenId(prev => (prev === id ? null : id));
  };

  const handleOption = (action: string, id: string) => {
    console.log(`Acción: ${action}, ID: ${id}`);
    setSelectedAction(action);       // guardar opción
    setMenuOpenId(null);             // cerrar menú
    setSelectId(id)
    handleClick();                   // abrir modal
  };
  return (
    <>
      <div className="p-1">
        <h2 className="mb-4 text-2xl font-bold"> Trabajadores</h2>
        <div className="mb-4 flex">

        </div>
        {/* contenedor de la tabla a mostrarde los trabajadores que se encuentren ocupados , disponible y dias de disponibiliad  */}
        <div className="py-2 px-2 overflow-hidden rounded-lg border border-gray-300 bg-white p-0 shawdow-md dark:border-slate-700 dark:bg-slate-800">
          <SearchWorkers />
          <div className="relative max-h-[550px] min-h-[100px] w-full overflow-y-auto rounded-none [scrollbar-width:thin">
            <table className="table w-full  min-w-max border-collapse">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head"> consultor</th>
                  <th className="table-head">epecialidad</th>
                  <th className="table-head">departamento</th>
                  <th className="table-head">Esquema</th>
                  <th className="table-head">TIempo</th>
                  <th className="table-head">Estatus</th>
                  <th className="table-head"></th>
                </tr>
              </thead>
              <tbody className="table-body">
                {staf.staff.map((data, index) => (
                  <tr key={index}
                    className=" table-row h-10"
                  >
                    <td className="table-cell">{data.consultor}</td>
                    <td className="table-cell">{data.especialidad}</td>
                    <td className="table-cell">{data.departamento}</td>
                    <td className="table-cell">{data.esquema}</td>
                    <td className="table-cell">{data.tiempo}</td>
                    <td className="table-cell">{data.estatus}</td>
                    <td className="table-cell relative">
                      <Btn_data text="..." Onclick={() => toggleMenu(data.id)} />
                      {menuOpenId === data.id && (
                        <div className="absolute right-0 z-50 mt-2 w-40 bg-white shadow-lg rounded border border-gray-200">
                          <button
                            onClick={() => handleOption("horas", data.id)}
                            className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                          >
                            Ver horas
                          </button>
                          <button
                            onClick={() => handleOption("editar", data.id)}
                            className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleOption("proyectos", data.id)}
                            className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                          >
                            Proyectos
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* fin de el contenedor de tabla */}
        <DetailsWorkers id={selectId} n={selectedAction} close={handleClose} dialogRef={dialogRef} />

      </div>
    </>
  )
}