"use client";
import staf from "@/data/staff.json"
import { Btn_data, Btn_list } from "../../../components/buttons/buttons";
import { useRef, useState } from "react";
import { SearchWorkers } from "../../../components/filters/filters";
import { DialogBase } from "../../../components/modal/modals";
import { Table_1 } from "../../../components/tables/table";
import { ContentBody, ContentTable } from "../../../components/containers/containers";
import { LogicaSwtich } from "../../../components/modal/logica";

export default function Cargabilidad() {
    /*
    const handleclick = () => {
        console.log("Hola mudno")
    }
    return (
        <>
            <h2>hola mundo</h2>
            <button onClick={handleclick} className="border-2 text-2xl bg-red-400"> hoa </button>
            <button onClick={handleclick}> hoa </button>
        </>
    )*/

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
        title="Cargabilidad">
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