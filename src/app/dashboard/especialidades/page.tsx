"use client";
import React, { useMemo, useState } from "react";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";

interface Especialidad {
    nombreCorto: string;
    detalle: string;
    nivel: string;
}

const especialidadesIniciales: Especialidad[] = [
    { nombreCorto: "SD", detalle: "Software Developer", nivel: "Senior" },
    { nombreCorto: "QA", detalle: "Quality Assurance", nivel: "Junior" },
];

export default function EspecialidadesPage() {
    const [especialidades] = useState<Especialidad[]>(especialidadesIniciales);

    // Columnas para DataTable
    const columns = useMemo<MRT_ColumnDef<Especialidad & { id: string }>[]>(() => [
        //{ accessorKey: "id", header: "ID", enableEditing: false },
        { accessorKey: "nombreCorto", header: "Nombre corto", size: 200 },
        { accessorKey: "detalle", header: "Detalle", size: 300 },
        { accessorKey: "nivel", header: "Nivel", size: 150 },
    ], []);

    // Datos con ID
    const data = especialidades.map((e, idx) => ({ ...e, id: idx.toString() }));
    const actions = { edit: true, add: true, export: true, delete: true }

    return (
        <ContentBody title="Especialidades">
            <DataTable
                data={data}
                columns={columns}
                menu={true}
                actions={actions}
            />
        </ContentBody>
    );
}
