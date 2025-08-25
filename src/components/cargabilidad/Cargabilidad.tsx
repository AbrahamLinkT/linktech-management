"use client";


import { useRouter } from "next/navigation";
import staf from "@/data/staff.json";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";

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
        { accessorKey: "id", header: "ID", enableEditing: false },
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

    return (
        <div className="w-full">
            <ContentBody title="Cargabilidad">
                <div className="mb-4 flex justify-end">
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 shadow transition-colors duration-200"
                        onClick={() => router.push("/dashboard/cargabilidad/resumen")}
                    >
                        Ver resumen
                    </button>
                </div>
                <DataTable<StaffItem> data={data} columns={columns} />
            </ContentBody>
        </div>
    );
}
