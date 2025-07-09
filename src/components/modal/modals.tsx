import { Btn_data } from "../buttons/buttons";
import { RefObject } from "react";
import Asignados from "@/data/ProyectosAsignados.json"
import Projects from "@/data/Projects.json"
import horasData from "@/data/HorasAsignadas.json" assert { type: "json" };

/* estructura  */
type HorasPorFecha = { [fecha: string]: number };

type RegistroDeHoras = {
    consultor?: string;
    trabajador?: string;
    horas: HorasPorFecha;
    dias: string[];
};

type UsuariosPorOrden = {
    [userId: string]: RegistroDeHoras[];
};

type OrdenInterna = {
    [ordenInterna: string]: UsuariosPorOrden[];
};

type HorasAsignadas = {
    OI: OrdenInterna[];
};

const Horas: HorasAsignadas = horasData;

export function DetailsWorkers({ id, n, close, dialogRef, }: { id: string | null; n: string | null; close: () => void; dialogRef: RefObject<HTMLDialogElement>; }) {


    const asignacionesUsuario = id
        ? Asignados.ProyectosAsignados.find((user) => user.id_usuario === id)
        : null;

    /* recorrer los proyecotos asignados por el usuario */
    const ProyectosAsignados = asignacionesUsuario ?
        Projects.proyectos.filter((projecto) =>
            asignacionesUsuario.ordenes_internas.includes(projecto.ordenInterna)
        ) : []
    /* evento para obtener las horas asignaadas filtrando por el proyecto que tenemos asignado  */
    const handleClick = (orden: string) => {
        if (!id) {
            console.log("No hay ID de usuario");
            return;
        }

        const ordenObj = Horas.OI.find((item) => orden in item);

        if (!ordenObj) {
            console.log("No se encontró la orden interna");
            return;
        }

        const usuariosPorOrden = ordenObj[orden];
        const usuarios = usuariosPorOrden[0];
        const horasDelUsuario = usuarios[id];

        if (!horasDelUsuario) {
            console.log("No hay horas asignadas para este usuario en esta orden interna");
            return;
        }
        console.log("orden interna", orden);

        console.log("Horas asignadas del usuario:", horasDelUsuario);
    };

    /* final */

    const renderContent = () => {
        switch (n) {
            case "proyectos":
                return (
                    <div className="text-left space-y-2">
                        <h2 className="text-xl font-semibold mb-2 text-center">
                            Proyectos asignados
                        </h2>
                        <p className=" text-center text-gray-400"> si deseas ver los dias asignados en el proyecto da click ensima del proyecto seleccionado</p>

                        {ProyectosAsignados.length > 0 ? (

                            <SimpleTable
                                headers={["Orden Interna", "Proyecto", "Estado", "Fecha Inicio", "Fecha Final", "Horas"]}
                                rows={ProyectosAsignados.map((p) => [
                                    p.ordenInterna, p.titulo, p.estatus, p.fechaIn, p.fechaFn, ""
                                ])}
                                onClickRow={(row) => {
                                    const ordenInterna = row[0];

                                    handleClick(ordenInterna)
                                }}

                            />
                        ) : (
                            <p>No se encontraron proyectos asignados para este usuario.</p>
                        )}

                    </div>
                );

            case "Dias":
                return (
                    <div className="text-left space-y-2">
                        <h2 className="text-xl font-semibold mb-2 text-center">
                            Proyectos asignados
                        </h2>
                        <p className=" text-center text-gray-400"> si deseas ver los dias asignados en el proyecto da click ensima del proyecto seleccionado</p>

                        {ProyectosAsignados.length > 0 ? (

                            <SimpleTable
                                headers={["Orden Interna", "Proyecto", "Estado", "Fecha Inicio", "Fecha Final", "Horas"]}
                                rows={ProyectosAsignados.map((p) => [
                                    p.ordenInterna, p.titulo, p.estatus, p.fechaIn, p.fechaFn, ""
                                ])}
                            />
                        ) : (
                            <p>No se encontraron proyectos asignados para este usuario.</p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };


    return (
        <dialog
            ref={dialogRef}
            className="rounded-xl p-6 shadow-lg backdrop:bg-black/40 
                w-[90%] min-w-[300px] max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl
                text-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        >
            {renderContent()}
            <Btn_data Onclick={close} text="cerrar" />
        </dialog>
    );
}

/* componente  */
type SimpleTableProps = {
    headers: string[];
    rows: string[][];
    onClickRow?: (row: string[]) => void
};

export const SimpleTable: React.FC<SimpleTableProps> = ({ headers, rows, onClickRow }) => {
    return (
        <div className="relative max-h-[750px] min-h-[100px] w-full overflow-y-auto rounded-none [scrollbar-width:thin">
            <table className="table w-full min-w-max border-collapse">
                <thead className="table-header">
                    <tr className="table-row">
                        {headers.map((header, index) => (
                            <th key={index} className="table-head">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table-body">
                    {rows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="table-row cursor-pointer hover:bg-gray-100 "
                            onClick={() => onClickRow?.(row)}
                        >
                            {row.map((cell, colIndex) => (
                                <td key={colIndex} className="table-cell ">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export function workersDetails() {
    return (
        <>
            <h2>
                detalles de trabajador
            </h2>
        </>
    )
}