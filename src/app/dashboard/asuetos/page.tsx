"use client";
import React, { useMemo, useState } from "react";
import { ContentBody } from "@/components/containers/containers";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { useAutoLoadAsuetos, type AsuetoResponse, useAsuetos } from "@/hooks/useAsuetos";
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
    const { asuetos, isLoading: asuetoLoading, error: asuetoError, refetch } = useAutoLoadAsuetos();
    
    // Cargar empleados para mostrar nombres
    const { employees, isLoading: employeeLoading } = useAutoLoadEmployees();

    // Hook para eliminar asuetos
    const { deleteAsueto } = useAsuetos();

    // Estado para la selección de filas
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

    // Debug: Log cuando cambia la selección
    const handleRowSelectionChange = (updater: Record<string, boolean> | ((old: Record<string, boolean>) => Record<string, boolean>)) => {
        const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
        console.log('Row selection changed:', newSelection);
        console.log('Selected asueto IDs:', Object.keys(newSelection).filter(id => newSelection[id]));
        setRowSelection(newSelection);
    };

    // Función para manejar la eliminación de asuetos
    const handleDelete = async (ids: string[]) => {
        if (!ids.length) {
            alert('No hay asuetos seleccionados para eliminar');
            return;
        }

        const confirmMessage = ids.length === 1 
            ? '¿Estás seguro de que deseas eliminar este asueto?' 
            : `¿Estás seguro de que deseas eliminar ${ids.length} asuetos?`;

        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            console.log('🗑️ Eliminando asuetos con IDs:', ids);
            
            // Eliminar cada asueto individualmente
            const deletePromises = ids.map(id => deleteAsueto(id));
            const results = await Promise.all(deletePromises);
            
            // Verificar si todas las eliminaciones fueron exitosas
            const failedDeletions = results.filter(result => !result.success);
            
            if (failedDeletions.length === 0) {
                console.log('✅ Todos los asuetos eliminados exitosamente');
                alert(`${ids.length === 1 ? 'Asueto eliminado' : `${ids.length} asuetos eliminados`} exitosamente`);
                
                // Limpiar selección y recargar datos
                setRowSelection({});
                await refetch();
            } else {
                console.error('❌ Algunas eliminaciones fallaron:', failedDeletions);
                alert(`Error al eliminar ${failedDeletions.length} asueto(s). Algunos pueden haber sido eliminados exitosamente.`);
                
                // Recargar datos para reflejar los cambios
                setRowSelection({});
                await refetch();
            }
        } catch (error) {
            console.error('❌ Error eliminando asuetos:', error);
            alert('Error al eliminar los asuetos. Por favor intenta de nuevo.');
        }
    };

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
        const transformedData = asuetos.map((asueto, idx) => {
            const empleadoName = employeeMap.get(asueto.employee_id);
            if (!empleadoName) {
                console.warn(`⚠️ No se encontró empleado para employee_id: ${asueto.employee_id}`);
            }
            
            const transformedItem = {
                ...asueto,
                id: asueto.id ? asueto.id.toString() : idx.toString(), // Asegurar que el ID sea string
                empleado: empleadoName || `ID: ${asueto.employee_id}`,
                fechaInicio: formatDate(asueto.startDate),
                fechaFin: formatDate(asueto.endDate),
            };
            
            console.log('📋 Transformed asueto item:', transformedItem);
            return transformedItem;
        });
        
        console.log('📊 Final transformed data:', transformedData);
        return transformedData;
    }, [asuetos, employeeMap]);

    const actions = { edit: true, add: true, export: true, delete: true };

    // Mostrar loading si cualquiera de las cargas está en progreso
    if (asuetoLoading || employeeLoading) {
        return (
            <ProtectedRoute requiredPermission="asuetos">
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
            <ProtectedRoute requiredPermission="asuetos">
                <ContentBody title="Asuetos">
                <div className="flex justify-center items-center h-40">
                    <p className="text-red-500">Error al cargar asuetos: {asuetoError}</p>
                </div>
            </ContentBody>
        );
    }

    return (
        <ProtectedRoute requiredPermission="asuetos">
            <ContentBody title="Asuetos">
            <DataTable
                data={data}
                columns={columns}
                menu={true}
                actions={actions}
                urlRouteAdd="/dashboard/asuetos/new"
                urlRouteEdit="/dashboard/asuetos/edit?id="
                rowSelection={rowSelection}
                onRowSelectionChange={handleRowSelectionChange}
                onDelete={handleDelete}
            />
            </ContentBody>
        </ProtectedRoute>
    );
}
