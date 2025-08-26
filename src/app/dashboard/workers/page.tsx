"use client";

import { ContentBody } from "@/components/containers/containers";
import { useMemo } from "react";
import staf from "@/data/staff.json";
import { DataTable } from "@/components/tables/table_master"; // <-- importa tu DataTable
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

export default function Workers() {
    // Configura columnas para DataTable
    const columns = useMemo<MRT_ColumnDef<StaffItem>[]>(
        () => [
            { accessorKey: "id", header: "ID", enableEditing: false },
            { accessorKey: "consultor", header: "Nombre" },
            { accessorKey: "especialidad", header: "Especialidad" },
            { accessorKey: "nivel", header: "Nivel" },
            { accessorKey: "departamento", header: "Departamento" },
            { accessorKey: "esquema", header: "Esquema" },
            { accessorKey: "tiempo", header: "Tiempo" },
            { accessorKey: "estatus", header: "Estatus" },
        ],
        []
    );

    // Datos del JSON
    const data: StaffItem[] = Array.isArray(staf.staff) ? staf.staff : [];

    return (
        <>
            <ContentBody title="Trabajadores">
                {/* Aquí renderizas el DataTable */}
                <DataTable<StaffItem> data={data} columns={columns} ModalAdd={<h1>hola</h1>} title_add="Trabajador" actions={{ edit: true }} />
            </ContentBody>
        </>
    );
}
