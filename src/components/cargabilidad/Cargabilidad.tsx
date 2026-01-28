"use client";

import { useRouter } from "next/navigation";
import { useWorkers } from "@/hooks/useWorkers";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { Btn_data } from "../buttons/buttons";
import { ChartColumn } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { buildApiUrl } from "@/config/api";

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
    const { data: workers, loading } = useWorkers();
    const [workSchedules, setWorkSchedules] = useState<Map<number, any>>(new Map());
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

    // Cargar work schedules para obtener las horas
    useEffect(() => {
        const loadWorkSchedules = async () => {
            if (!workers || workers.length === 0) return;
            
            setLoadingSchedules(true);
            const scheduleMap = new Map<number, any>();
            const uniqueSchemeIds = new Set(workers.map(w => w.scheme_id).filter(Boolean));
            
            for (const schemeId of uniqueSchemeIds) {
                try {
                    const res = await fetch(buildApiUrl(`/work-schedule/${schemeId}`));
                    if (res.ok) {
                        const schedule = await res.json();
                        scheduleMap.set(Number(schemeId), schedule);
                    }
                } catch (err) {
                    console.error(`Error cargando schedule ${schemeId}:`, err);
                }
            }
            
            setWorkSchedules(scheduleMap);
            setLoadingSchedules(false);
        };
        
        if (workers && workers.length > 0) {
            loadWorkSchedules();
        }
    }, [workers]);

    // Función para calcular horas semanales
    const calculateWeeklyHours = (schemeId?: number | null): string => {
        if (!schemeId) return 'N/A';
        
        const schedule = workSchedules.get(schemeId);
        if (!schedule?.hours || !schedule?.working_days) return 'N/A';

        const hoursMatch = String(schedule.hours).trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
        if (!hoursMatch) return 'N/A';
        
        const startH = parseInt(hoursMatch[1], 10);
        const startM = parseInt(hoursMatch[2], 10);
        const endH = parseInt(hoursMatch[3], 10);
        const endM = parseInt(hoursMatch[4], 10);

        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;
        let diff = Math.abs(endTotal - startTotal);
        diff = Math.min(diff, 24 * 60 - diff);
        const dailyHours = diff / 60;

        const workingDays = schedule.working_days
            .split(',')
            .map((d: string) => d.trim())
            .filter((d: string) => d.length > 0);
        const daysCount = workingDays.length;

        const weeklyHours = dailyHours * daysCount;
        return Number.isInteger(weeklyHours) ? String(weeklyHours) : weeklyHours.toFixed(2);
    };

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

    // Transformar datos de workers a formato de la tabla
    const data: StaffItem[] = useMemo(() => {
        if (!workers || workers.length === 0) return [];
        
        return workers.map((worker) => ({
            id: String(worker.id),
            consultor: worker.name || 'N/A',
            especialidad: worker.roleName || 'N/A',
            nivel: worker.levelName || 'N/A',
            departamento: worker.departmentName || 'N/A',
            esquema: worker.schemeName || 'N/A',
            tiempo: calculateWeeklyHours(worker.scheme_id),
            estatus: worker.status ? 'Activo' : 'Inactivo',
        }));
    }, [workers, workSchedules]);

    const actions = { edit: false, add: false, export: false, delete: true };
    
    const handleClick = () => {
        router.push("/dashboard/cargabilidad/resumen");
    };

    if (loading || loadingSchedules) {
        return (
            <ContentBody title="Cargabilidad">
                <div style={{ padding: 20, textAlign: 'center' }}>Cargando...</div>
            </ContentBody>
        );
    }

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
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
            />
        </ContentBody>
    );
}
