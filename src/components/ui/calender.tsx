import { useState } from "react";
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    format,
    isSameMonth,
} from "date-fns";

type Registro = {
    fecha: string;
    horas: number;
    orden: string;
};

/* calendario para las horas asignadas por el usuario */
export function CalendarioHoras({ registros }: { registros: Registro[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const horasPorFecha = registros.reduce((acc, reg) => {
        const fecha = reg.fecha;
        if (!acc[fecha]) acc[fecha] = [];
        acc[fecha].push({ horas: reg.horas, orden: reg.orden });
        return acc;
    }, {} as Record<string, { horas: number; orden: string }[]>);

    const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });

    const days: JSX.Element[] = [];
    let day = startDate;

    while (day <= endDate) {
        const dayStr = format(day, "yyyy-MM-dd");
        const isWeekend = day.getDay() === 0 || day.getDay() === 6; // Domingo o sábado

        const baseClass = isSameMonth(day, currentDate)
            ? isWeekend
                ? "bg-gray-200 text-gray-500" // Fin de semana del mes actual
                : "bg-white"
            : "bg-gray-100 text-gray-400"; // Días fuera del mes

        days.push(
            <div
                key={dayStr}
                className={`border p-2 h-24 text-sm text-center ${baseClass}`}
            >
                <div className="font-semibold">{format(day, "d")}</div>
                <div className="text-xs text-blue-600 space-y-1">
                    {horasPorFecha[dayStr]?.map((item, idx) => (
                        <div key={idx}>
                            <span className="font-semibold">OI: {item.orden}</span> - {item.horas}h
                        </div>
                    ))}
                </div>
            </div>
        );
        day = addDays(day, 1);
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                    ← Anterior
                </button>
                <h2 className="text-lg font-bold">{format(currentDate, "MMMM yyyy")}</h2>
                <button onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                    Siguiente →
                </button>
            </div>

            <div className="grid grid-cols-7 text-center font-medium text-gray-700 mb-2">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-300 rounded overflow-hidden">
                {days}
            </div>
        </div>
    );
}
