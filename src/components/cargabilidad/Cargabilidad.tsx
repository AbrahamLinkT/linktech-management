"use client";

import { useRouter } from "next/navigation";
import { useWorkers } from "@/hooks/useWorkers";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { Btn_data } from "../buttons/buttons";
import { ChartColumn, Download } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { buildApiUrl } from "@/config/api";
import * as XLSX from 'xlsx';

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
    const { data: workers, loading, schemes } = useWorkers();
    const [workSchedules, setWorkSchedules] = useState<Map<number, any>>(new Map());
    const [loadingSchedules, setLoadingSchedules] = useState(true);
    const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})
    
    // Log inicial
    console.log('🎯 CARGABILIDAD RENDER - Workers:', workers?.length, 'Loading:', loading, 'SchedulesLoading:', loadingSchedules, 'SchedulesMap size:', workSchedules.size);
    
    // Debug - ver scheme_ids
    if (workers && workers.length > 0) {
        const schemeIds = workers.map(w => w.scheme_id).filter(Boolean);
        console.log('🔍 Scheme IDs en workers:', schemeIds);
    }

    // Cargar work schedules para obtener las horas
    useEffect(() => {
        console.log('📦 Cargando work schedules desde hook...', schemes?.length, 'schemes');
        
        if (!schemes || schemes.length === 0) {
            console.log('⚠️ Sin schemes disponibles');
            setWorkSchedules(new Map());
            setLoadingSchedules(false);
            return;
        }
        
        console.log('🔍 Schemes IDs:', schemes.map((s: any) => s.id));
        
        // Crear mapa de scheme_id -> schedule
        const scheduleMap = new Map<number, any>();
        schemes.forEach((scheme: any) => {
            const schemeId = Number(scheme.id);
            scheduleMap.set(schemeId, scheme);
            console.log(`✅ Scheme ${schemeId}:`, scheme);
        });
        
        console.log('✅ Work schedules desde hook. Mapa:', Array.from(scheduleMap.entries()));
        setWorkSchedules(scheduleMap);
        setLoadingSchedules(false);
    }, [schemes])
    
    // Efecto para debuggear cambios en workSchedules
    useEffect(() => {
        console.log('💾 WORKSCHEDULES ACTUALIZADO - Size:', workSchedules.size, 'Keys:', Array.from(workSchedules.keys()));
        workSchedules.forEach((schedule, key) => {
            console.log(`   [${key}]:`, schedule);
        });
    }, [workSchedules]);

    // Función para calcular horas totales del esquema
    const calculateDailyHours = (schemeId?: number | null): string => {
        console.log(`🔍 calculateDailyHours ENTRADA - schemeId:`, schemeId, 'scheduleMap size:', workSchedules.size);
        
        if (!schemeId) {
            console.warn('⚠️ No schemeId provided');
            return 'N/A';
        }
        
        const schedule = workSchedules.get(schemeId);
        if (!schedule) {
            const available = Array.from(workSchedules.keys());
            console.warn(`🚨 Schedule no encontrado para scheme_id: ${schemeId}. Disponibles: [${available.join(', ') || 'NINGUNO'}]`);
            return 'N/A';
        }
        
        const hours = schedule.hours;
        console.log(`✅ Schedule encontrado para scheme_id ${schemeId}. hours:`, hours);
        
        // Si hours es solo un número (ej: "8", "8.5", 8)
        const numHours = parseFloat(hours);
        if (!isNaN(numHours) && !String(hours).includes(':')) {
            console.log(`📋 Formato numérico: ${hours} -> ${numHours} horas`);
            return String(numHours);
        }
        
        // Si hours es en formato "HH:MM-HH:MM" (ej: "07:00-02:00", "08:00-18:00")
        if (typeof hours === 'string' && hours.includes(':') && hours.includes('-')) {
            const hoursMatch = String(hours).trim().match(/^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/);
            if (hoursMatch) {
                const startH = parseInt(hoursMatch[1], 10);
                const startM = parseInt(hoursMatch[2], 10);
                const endH = parseInt(hoursMatch[3], 10);
                const endM = parseInt(hoursMatch[4], 10);
                
                const startTotal = startH * 60 + startM;
                const endTotal = endH * 60 + endM;
                
                // Calcular diferencia en minutos
                let diff = endTotal - startTotal;
                
                // Si es negativo, significa que cruza medianoche (ej: 07:00 a 02:00 = 19 horas)
                if (diff < 0) {
                    diff = (24 * 60) + diff; // Agregar 24 horas en minutos
                }
                
                // Convertir minutos a horas
                const totalHours = diff / 60;
                
                const result = Number.isInteger(totalHours) ? String(totalHours) : totalHours.toFixed(1);
                console.log(`📋 Formato rango ${hours}: ${diff} minutos = ${totalHours} horas -> ${result}`);
                return result;
            }
        }
        
        console.warn(`⚠️ No se pudo calcular horas para scheme_id: ${schemeId}. Formato no reconocido: ${hours}`);
        return 'N/A';
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
        
        console.log('📊 USEMEMO - Procesando', workers.length, 'workers');
        workers.forEach((w, idx) => {
            if (idx < 3) console.log(`   Worker ${idx}:`, { id: w.id, name: w.name, scheme_id: w.scheme_id });
        });
        
        return workers.map((worker) => ({
            id: String(worker.id),
            consultor: worker.name || 'N/A',
            especialidad: worker.roleName || 'N/A',
            nivel: worker.levelName || 'N/A',
            departamento: worker.departmentName || 'N/A',
            esquema: worker.schemeName || 'N/A',
            tiempo: calculateDailyHours(worker.scheme_id),
            estatus: worker.status ? 'Activo' : 'Inactivo',
        }));
    }, [workers, workSchedules, loadingSchedules]);

    const actions = { edit: false, add: false, export: false, delete: true };
    
    const handleClick = () => {
        // Obtener IDs de workers seleccionados
        const selectedIds = Object.keys(rowSelection).filter(key => rowSelection[key]);
        
        if (selectedIds.length === 0) {
            alert('Por favor selecciona al menos un consultor');
            return;
        }
        
        // Pasar los IDs seleccionados via query params
        const idsParam = selectedIds.join(',');
        router.push(`/dashboard/cargabilidad/resumen?workers=${idsParam}`);
    };
    
    const handleExportExcel = () => {
        if (!data || data.length === 0) {
            alert('No hay datos para exportar');
            return;
        }
        
        // Preparar datos para Excel
        const excelData = data.map(row => ({
            'Consultor': row.consultor,
            'Especialidad': row.especialidad,
            'Nivel': row.nivel,
            'Departamento': row.departamento,
            'Esquema': row.esquema,
            'Tiempo': row.tiempo,
            'Estatus': row.estatus
        }));
        
        // Crear workbook y worksheet
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Cargabilidad');
        
        // Descargar archivo
        const fecha = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `Cargabilidad_${fecha}.xlsx`);
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
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Btn_data
                        text="Exportar Excel"
                        icon={<Download />}
                        styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium hover:bg-green-400 hover:text-white"
                        Onclick={handleExportExcel}
                    />
                    <Btn_data
                        text="Resumen"
                        icon={<ChartColumn />}
                        styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium hover:bg-blue-400 hover:text-white"
                        Onclick={handleClick}
                    />
                </div>
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
