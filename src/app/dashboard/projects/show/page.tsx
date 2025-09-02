"use client";
import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
/* Importacion de componenetes propios */
import { ContentBody } from "@/components/containers/containers";
import { Btn_data } from "@/components/buttons/buttons";
/* impórtaciones de jsons */
import Projects from "@/data/Projects.json";
import staff from "@/data/staff_horas.json"
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";


interface StaffItem {
    id: string;
    consultor: string;
    especialidad: string;
    nivel: string;
    departamento: string;
    esquema: string;
    horas: string;
    estatus: string;

}
export default function Project() {

    // =============== Estados ================

    // =============== ID PROYECTO ================
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const route = useRouter();
    const Proyecto = Projects.proyectos.find((p) => p.id == id);

    // =============== MANEJO DE LOGICA DE LA TABLA PRINCIPAL ================
    const columns = useMemo<MRT_ColumnDef<StaffItem>[]>(
        () => [
            { accessorKey: "consultor", header: "Empleado" },
            { accessorKey: "especialidad", header: "Especialidad" },
            { accessorKey: "departamento", header: "Departamento" },
            { accessorKey: "nivel", header: "Nivel" },
            { accessorKey: "estatus", header: "Estatus" },
            { accessorKey: "esquema", header: "Esquema" },
            { accessorKey: "fecha-inicio", header: "Fecha Inicio" },
            { accessorKey: "fecha-fin", header: "Fecha Fin" },
            { accessorKey: "horas", header: "Horas" },
        ], []);

    const data: StaffItem[] = Array.isArray(staff.staff) ? staff.staff : [];
    // =============== VALIDACION DE PROYECTO ================
    if (!Proyecto) {
        return <div className="p-6 text-red-600">Proyecto no encontrado</div>;
    }

    // =============== REDIRECCCIONAMIENTO ================
    const handleClick = () => {
        route.push("/dashboard/projects/");
    };

    // =============== MANEJO DE CAMBIOS DE TRABAJADORES ================


    const actions = { edit: true, delete: true, add: true };

    return (
        <>
            <ContentBody
                title={`${Proyecto?.titulo}`}
                btnReg={
                    <Btn_data
                        text="Regresar"
                        icon={<ArrowLeft />}
                        styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium hover:bg-blue-400 hover:text-white"
                        Onclick={handleClick}
                    />
                }
                subtitle={Proyecto?.nombre}
                contentSubtitleComponent={
                    <div className="pl-4 grid grid-cols-1 md:grid-cols-3 gap-4 w-full ">
                        {/* Col 1 - Fila 1 */}
                        <div className="">
                            <h2>Descripción: </h2>
                            <p>{Proyecto?.descripcion}</p>
                        </div>

                        {/* Col 2 - Fila 1 */}
                        <div className="flex gap-8">
                            <h2>Fecha de Inicio: </h2>
                            <p>{Proyecto?.fechaIn}</p>
                        </div>

                        {/* Col 3 - Fila 1 y 2 (ocupa las dos filas) */}
                        <div className="pr-3 bg-gray-400 md:row-span-2 flex items-center justify-center">
                            <h2>LOGOTIPO</h2>
                        </div>

                        {/* Col 1 - Fila 2 */}
                        <div className="flex gap-8">
                            <h2>Orden interna: </h2>
                            <p>{Proyecto?.ordenInterna}</p>
                            <h2>Responsable: </h2>
                            <p>{Proyecto?.responsable}</p>
                        </div>

                        {/* Col 2 - Fila 2 */}
                        <div className=" flex gap-8">
                            <h2>Fecha de Fin: </h2>
                            <p>{Proyecto?.fechaFn}</p>
                        </div>
                    </div>
                }
            >
                <DataTable
                    menu={true}
                    columns={columns}
                    data={data}
                    actions={actions}
                    edit={true}
                    urlRoute="/dashboard/proyeccion/date?id="
                    title_add="Agregar Trabajador"
                    ModalAdd={<h1>Aqui va el modal de agregar</h1>}
                />


            </ContentBody>

        </>
    );
}
