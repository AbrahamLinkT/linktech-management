"use client";
import React, { useMemo } from "react";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { useAutoLoadAsuetos, type AsuetoResponse } from "@/hooks/useAsuetos";
import { useAutoLoadEmployees } from "@/hooks/useEmployees";

const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    try {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    } catch {
        return dateString;
    }
};

export default function AsuetosPage() {
    // Cargar asuetos desde el API
    const { asuetos, isLoading: asuetoLoading, error: asuetoError } = useAutoLoadAsuetos();
    
    // Cargar empleados para mostrar nombres
    const { employees, isLoading: employeeLoading } = useAutoLoadEmployees();

    // Crear un mapa de employee_id -> name para búsqueda rápida
    const employeeMap = useMemo(() => {
        const map = new Map<number, string>();
        console.log('🔍 Construyendo employeeMap con employees:', employees.length, 'empleados');
        employees.forEach((emp: {id: number; name: string}) => {
            map.set(emp.id, emp.name);
        });
        console.log('📊 EmployeeMap construido con', map.size, 'entradas');
        return map;
    }, [employees]);

    const columns = useMemo<MRT_ColumnDef<AsuetoResponse & { id: string; empleado: string; fechaInicio: string; fechaFin: string }>[]>(
        () => [
            {
                accessorKey: "empleado",
                header: "Empleado",
                size: 200,
            },
            {
                accessorKey: "fechaInicio",
                header: "Fecha inicio",
                size: 200,
            },
            {
                accessorKey: "fechaFin", 
                header: "Fecha fin",
                size: 170,
            },
        ],
        []
    );

    // Transformar los datos de asuetos para la tabla
    const data = useMemo(() => {
        console.log('🔄 Transformando', asuetos.length, 'asuetos para la tabla');
        return asuetos.map((asueto, idx) => {
            const empleadoName = employeeMap.get(asueto.employee_id);
            if (!empleadoName) {
                console.warn(`⚠️ No se encontró empleado para employee_id: ${asueto.employee_id}`);
            }
            
            return {
                ...asueto,
                id: asueto.id || idx.toString(),
                empleado: empleadoName || `ID: ${asueto.employee_id}`,
                fechaInicio: formatDate(asueto.startDate),
                fechaFin: formatDate(asueto.endDate),
            };
        });
    }, [asuetos, employeeMap]);

    const actions = { edit: true, add: true, export: true, delete: true };

    // Mostrar loading si cualquiera de las cargas está en progreso
    if (asuetoLoading || employeeLoading) {
        return (
            <ContentBody title="Asuetos">
                <div className="flex justify-center items-center h-40">
                    <p>Cargando asuetos...</p>
                </div>
            </ContentBody>
        );
    }

    // Mostrar error si hay algún problema
    if (asuetoError) {
        return (
            <ContentBody title="Asuetos">
                <div className="flex justify-center items-center h-40">
                    <p className="text-red-500">Error al cargar asuetos: {asuetoError}</p>
                </div>
            </ContentBody>
        );
    }

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
