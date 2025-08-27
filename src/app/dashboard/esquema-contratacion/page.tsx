"use client";
import React, { useMemo, useState } from "react";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master"; // tu DataTable
import { type MRT_ColumnDef } from "material-react-table";

interface Esquema {
    nombreCorto: string;
    descripcion: string;
    numeroHoras: number;
}

const esquemasIniciales: Esquema[] = [
    { nombreCorto: "Honorarios", descripcion: "Pago por servicios profesionales", numeroHoras: 40 },
    { nombreCorto: "Asimilados", descripcion: "Pago bajo régimen de asimilados", numeroHoras: 30 },
];

export default function EsquemaContratacionPage() {
    const [esquemas] = useState<Esquema[]>(esquemasIniciales);

    // Configura columnas para DataTable
    const columns = useMemo<MRT_ColumnDef<Esquema & { id: string }>[]>(() => [
        //{ accessorKey: "id", header: "ID", enableEditing: false },
        { accessorKey: "nombreCorto", header: "Nombre corto", size: 200 },
        { accessorKey: "descripcion", header: "Descripción", size: 300 },
        { accessorKey: "numeroHoras", header: "Número de horas", size: 150 },
    ], []);

    // Datos con ID (obligatorio para DataTable)
    const data = esquemas.map((e, idx) => ({ ...e, id: idx.toString() }));
    const actions = { edit: true, add: true, export: true, delete: true }

    return (
        <ContentBody title="Esquema contractual">
            <DataTable
                data={data}
                columns={columns}
                menu={true}
                actions={actions}
            />
        </ContentBody>
    );
}
