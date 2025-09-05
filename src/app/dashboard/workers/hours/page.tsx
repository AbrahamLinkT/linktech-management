"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { staff } from "@/data/staff_calender.json";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";

type RowHoras = {
    id: string;
    dia: string;
    "01-08-2020": string;
    "02-08-2020": string;
    "03-08-2020": string;
    "04-08-2020": string;
    "05-08-2020": string;
};

export default function HoursPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const router = useRouter();
    const handleClick = () => {
        router.back();
    };
    const user = staff.find((member) => member.id_consultor === id);

    // ====== Datos de ejemplo para TODOS los días ======
    const data: RowHoras[] = [
        {
            id: "1",
            dia: "Lunes",
            "01-08-2020": "8h",
            "02-08-2020": "7h",
            "03-08-2020": "8h",
            "04-08-2020": "6h",
            "05-08-2020": "8h",
        },
        {
            id: "2",
            dia: "Martes",
            "01-08-2020": "8h",
            "02-08-2020": "8h",
            "03-08-2020": "7h",
            "04-08-2020": "8h",
            "05-08-2020": "6h",
        },
        {
            id: "3",
            dia: "Miércoles",
            "01-08-2020": "7h",
            "02-08-2020": "6h",
            "03-08-2020": "8h",
            "04-08-2020": "8h",
            "05-08-2020": "7h",
        },
        {
            id: "4",
            dia: "Jueves",
            "01-08-2020": "8h",
            "02-08-2020": "7h",
            "03-08-2020": "6h",
            "04-08-2020": "8h",
            "05-08-2020": "8h",
        },
        {
            id: "5",
            dia: "Viernes",
            "01-08-2020": "6h",
            "02-08-2020": "8h",
            "03-08-2020": "7h",
            "04-08-2020": "7h",
            "05-08-2020": "6h",
        }
    ];

    const columns: MRT_ColumnDef<RowHoras>[] = [
        { accessorKey: "dia", header: "Día de la Semana" },
        { accessorKey: "01-08-2020", header: "01-08-2020" },
        { accessorKey: "02-08-2020", header: "02-08-2020" },
        { accessorKey: "03-08-2020", header: "03-08-2020" },
        { accessorKey: "04-08-2020", header: "04-08-2020" },
        { accessorKey: "05-08-2020", header: "05-08-2020" },
    ];

    return (
        <ContentBody
            title={`Calendario de trabajo - ${user?.consultor}`}
            subtitle="Datos del usuario"
            contentSubtitleComponent={
                <div className="pl-4 pb-3 flex gap-8">
                    <div >
                        <p>Nombre: {user?.consultor}</p>
                        <p>Horas trabajadas: {user?.horas}</p>
                    </div>
                    <div>
                        <p>Correo: {user?.esquema}</p>
                        <p>Teléfono: {user?.estatus}</p>
                    </div>
                </div>
            }
            btnReg={
                <Btn_data
                    text="Regresar"
                    icon={<ArrowLeft />}
                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium hover:bg-blue-400 hover:text-white"
                    Onclick={handleClick}
                />
            }
        >
            <DataTable<RowHoras> data={data} columns={columns} menu={false} />
        </ContentBody>
    );
}
