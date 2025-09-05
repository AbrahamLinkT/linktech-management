"use client";


import { useRouter } from "next/navigation";
import staf from "@/data/staff.json";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { Btn_data } from "../buttons/buttons";
import { ChartColumn } from "lucide-react";

interface StaffItem {
    id: string;
    consultor: string;
    especialidad: string;
    nivel: string;
    departamento: string;
    esquema: string;
    tiempo: string;
    estatus: string;
}

export default function CargabilidadComponent() {
    const router = useRouter();

    // Columnas para DataTable
    const columns = [
        //{ accessorKey: "id", header: "ID", enableEditing: false },
        { accessorKey: "consultor", header: "Consultor" },
        { accessorKey: "especialidad", header: "Especialidad" },
        { accessorKey: "nivel", header: "Nivel" },
        { accessorKey: "departamento", header: "Departamento" },
        { accessorKey: "esquema", header: "Esquema" },
        { accessorKey: "tiempo", header: "Tiempo" },
        { accessorKey: "estatus", header: "Estatus" },
    ] as MRT_ColumnDef<StaffItem>[];

    // Datos del JSON
    const data: StaffItem[] = Array.isArray(staf.staff) ? staf.staff : [];
    const actions = { edit: false, add: false, export: false, delete: true }
    const handleClick = () => {
        router.push("/dashboard/cargabilidad/resumen");
    };
    return (
        <ContentBody title="Cargabilidad"
            btnReg={
                <Btn_data
                    text="Resumen"
                    icon={<ChartColumn />}
                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium hover:bg-blue-400 hover:text-white"
                    Onclick={handleClick}
                />
            }
        >
            <DataTable<StaffItem> data={data} columns={columns}
                menu={true}
                actions={actions}
                edit={true}
            />
        </ContentBody>
    );
}
