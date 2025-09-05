"use client";
import React, { useMemo, useState } from "react";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";

interface Asueto {
    empleado: string;
    fechaInicio: string;
    fechaFin: string;
    descripcion: string;
    tiempo: string;
}

const asuetosIniciales: Asueto[] = [
    {
        empleado: "Abraham Castañeda",
        fechaInicio: "2025-11-16",
        fechaFin: "2025-11-16",
        descripcion: "Independencia de MX",
        tiempo: "Completo",
    },
];

export default function AsuetosPage() {
    const [asuetos] = useState<Asueto[]>(asuetosIniciales);

    // Formatear fechas
    const formatDate = (date: string) => {
        const [y, m, d] = date.split("-");
        return `${d}/${m}/${y}`;
    };

    // Columnas para DataTable
    const columns = useMemo<MRT_ColumnDef<Asueto & { id: string }>[]>(() => [
        //{ accessorKey: "id", header: "ID", enableEditing: false },
        { accessorKey: "empleado", header: "Empleado", size: 200 },
        { accessorKey: "fechaInicio", header: "Fecha inicio", size: 200 },
        { accessorKey: "fechaFin", header: "Fecha fin", size: 170 },
        { accessorKey: "descripcion", header: "Descripción", size: 250 },
        { accessorKey: "tiempo", header: "Tiempo", size: 250 },
    ], []);

    // Datos con id y fechas formateadas
    const data = asuetos.map((a, idx) => ({
        ...a,
        id: idx.toString(),
        fechaInicio: formatDate(a.fechaInicio),
        fechaFin: formatDate(a.fechaFin),
        tiempo: a.tiempo === "Completo" ? "Completo" : "Medio día",
    }));
    const actions = { edit: true, add: true, export: true, delete: true }

    return (
        <ContentBody title="Asuetos">
            <DataTable
                data={data}
                columns={columns}
                menu={true}
                actions={actions}
                urlRouteAdd="/dashboard/asuetos/new"
                urlRouteEdit="/dashboard/asuetos/edit?id="
            />
        </ContentBody>
    );
}
