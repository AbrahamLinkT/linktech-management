'use client';
import staf from "@/data/staff.json"
import { Btn_data, Btn_list } from "../buttons/buttons";
import { useRef, useState } from "react";
import { SearchWorkers } from "../filters/filters";
import { DialogBase } from "../modal/modals";
import { Table_1 } from "../tables/table";
import { ContentBody, ContentTable } from "../containers/containers";
import { LogicaSwtich } from "../modal/logica";
export default function DataTable() {
  // referencia al elemento del dialogo 
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectId, setSelectId] = useState<string | null>(null)
  // abrur y cerrar modal 
  const handleClick = () => {
    dialogRef.current?.showModal();
  }
  const handleClose = () => {
    dialogRef.current?.close();
  }

  // mostrar el menu de opciones y capturar el valor 
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
      <ContentBody
        title="Trabajadores">
        <ContentTable
          header={<SearchWorkers />}
          Body={
            <Table_1
              headers={["Consultor", "Especialidad", "Departamento", "Esquema", "Tiempo", "Estatus", ""]}
              rows={staf.staff.map((p) => [p.consultor, p.especialidad, p.departamento, p.esquema, p.tiempo, p.estatus,
              <>
                <Btn_data text="..." Onclick={() => toggleMenu(p.id)} />
                {menuOpenId === p.id && (

                  <Btn_list
                    items={[
                      {
                        text: "Horas",
                        onClick: () => handleOption("horas", p.id),
                      },
                      {
                        text: "Proyectos",
                        onClick: () => handleOption("proyectos", p.id),
                      },
                    ]}
                  />

                )}
              </>
              ])}
            />
          }
        />

      </ContentBody>

      {/* fin de el contenedor de tabla */}

      {/* Modal*/}
      <DialogBase
        close={handleClose}
        dialogRef={dialogRef}>
        <LogicaSwtich
          id={selectId}
          n={selectedAction}
        />
      </DialogBase>
    </>
  )
}