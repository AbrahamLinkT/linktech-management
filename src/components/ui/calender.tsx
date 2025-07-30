import React, { useState } from "react";
import "react-day-picker/dist/style.css";
import { getWeek, isToday } from "date-fns";
import { es } from "date-fns/locale";
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


type CalendarioProps = {
    renderDia?: (fecha: Date) => React.ReactNode;
    modoEdicion?: boolean;
    finesSeleccionables?: boolean;
    diasSeleccionados: string[]; // array de fechas en formato "yyyy-MM-dd"
    setDiasSeleccionados: (dias: string[]) => void;
};

export function Calendario({
    renderDia,
    modoEdicion = false,
    finesSeleccionables = false,
    diasSeleccionados,
    setDiasSeleccionados,
}: CalendarioProps) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const startDate = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const endDate = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });

    const toggleDiaSeleccionado = (fecha: Date) => {
        if (!modoEdicion) return; // Si no está en modo edición, no hacer nada

        const fechaStr = format(fecha, "yyyy-MM-dd");
        if (diasSeleccionados.includes(fechaStr)) {
            setDiasSeleccionados(diasSeleccionados.filter((f) => f !== fechaStr));
        } else {
            setDiasSeleccionados([...diasSeleccionados, fechaStr]);
        }
    };

    const rows: JSX.Element[] = [];
    let day = startDate;

    while (day <= endDate) {
        const weekDays: JSX.Element[] = [];
        const weekNumber = getWeek(day, { weekStartsOn: 0 });

        weekDays.push(
            <div
                key={`week-${weekNumber}`}
                className="border h-16 text-[10px] text-center font-semibold flex items-center justify-center bg-gray-200"
            >
                {weekNumber}
            </div>
        );

        for (let i = 0; i < 7; i++) {
            const diaActual = new Date(day); // copia independiente
            const dayStr = format(diaActual, "yyyy-MM-dd");
            const isWeekend = diaActual.getDay() === 0 || diaActual.getDay() === 6;
            const isCurrentDay = isToday(diaActual);
            const estaSeleccionado = diasSeleccionados.includes(dayStr);
            const puedeSeleccionarDia = modoEdicion && (!isWeekend || finesSeleccionables);

            const baseClass = isSameMonth(diaActual, currentDate)
                ? isWeekend
                    ? "bg-blue-200 text-black"
                    : "bg-white"
                : "bg-gray-50 text-gray-400";

            const todayClass = isCurrentDay
                ? "border-2 border-blue-600 font-bold text-blue-700 bg-blue-100"
                : "";

            const claseSeleccionado = estaSeleccionado ? "bg-green-300 border-green-500" : "";
            const hoverClass = modoEdicion ? "hover:bg-green-100 cursor-pointer" : "";

            weekDays.push(
                <div
                    key={dayStr}
                    onClick={() => puedeSeleccionarDia && toggleDiaSeleccionado(diaActual)}
                    className={`border p-1 h-16 text-xs text-center flex flex-col items-center justify-start transition-all
            ${baseClass} ${todayClass} ${claseSeleccionado} ${hoverClass}`}
                    style={{ userSelect: "none" }}
                >
                    <div className="font-semibold">{format(diaActual, "d")}</div>
                    <div className="text-[10px] mt-1 leading-tight">{renderDia?.(diaActual)}</div>
                </div>
            );

            day = addDays(day, 1);
        }

        rows.push(
            <div key={`row-${weekNumber}`} className="grid grid-cols-8">
                {weekDays}
            </div>
        );
    }

    return (
        <div className="w-full border rounded-lg shadow-sm overflow-hidden bg-white">
            <div className="flex items-center justify-between px-3 py-2 border-b bg-gray-50 text-sm">
                <button
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className="text-black hover:text-blue-600"
                >
                    ← Anterior
                </button>
                <h2 className="text-base font-bold">
                    {format(currentDate, "MMMM yyyy", { locale: es }).toUpperCase()}
                </h2>
                <button
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className="text-black hover:text-blue-600"
                >
                    Siguiente →
                </button>
            </div>

            <div className="grid grid-cols-8 text-center text-xs font-medium text-gray-600 border-b">
                <div className="bg-gray-200 py-1 text-[10px] font-semibold">Sem</div>
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <div key={day} className="py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="divide-y divide-gray-300">{rows}</div>
        </div>
    );
}

/* componenete de edicion de horas */
// components/EditorDeHoras.tsx

interface Orden {
    OI: string;
    titulo: string;
}

interface EditorDeHorasProps {
    dias: Date[];
    ordenesInternas: Orden[];
    onGuardar: (horasPorDia: { [key: string]: number }, ordenInternaOI: string) => void;
    onCancelar: () => void;
}

export function EditorDeHoras({ dias, ordenesInternas, onGuardar, onCancelar }: EditorDeHorasProps) {
    const [horas, setHoras] = useState("8");
    const [horasPorDia, setHorasPorDia] = useState<{ [key: string]: number }>(() =>
        Object.fromEntries(dias.map((f) => [f.toISOString().split("T")[0], 8]))
    );
    const [ordenInternaOI, setOrdenInternaOI] = useState("");

    const aplicarHorasATodos = () => {
        const num = parseInt(horas) || 0;
        const nuevas = Object.fromEntries(dias.map((f) => [f.toISOString().split("T")[0], num]));
        setHorasPorDia(nuevas);
    };

    const actualizarHorasIndividual = (clave: string, valor: number) => {
        setHorasPorDia((prev) => ({ ...prev, [clave]: valor }));
    };

    return (
        <>
            {/* Input de horas con botón "Aplicar a todos" */}
            <div className="mt-4 w-full">
                <label className="block mb-2 font-semibold">Horas</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        className="w-full rounded border px-3 py-2"
                        value={horas}
                        min={0}
                        max={8}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (+val <= 8) setHoras(val);
                        }}
                    />
                    <button
                        className="rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
                        onClick={aplicarHorasATodos}
                    >
                        Aplicar
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Máximo 8 horas por día</p>
            </div>
            {/* Selector de orden interna */}
            <div>
                <select
                    className="w-full rounded border px-3 py-2 bg-white text-blue-600 font-semibold"
                    value={ordenInternaOI}
                    onChange={(e) => setOrdenInternaOI(e.target.value)}
                >
                    <option value="" disabled>
                        Selecciona Orden Interna
                    </option>
                    {ordenesInternas.map((orden) => (
                        <option key={orden.OI} value={orden.OI}>
                            {orden.OI} - {orden.titulo}
                        </option>
                    ))}
                </select>
            </div>
            {/* Total de horas y lista */}
            <div className="flex items-center justify-between mt-4">
                <h3 className="font-semibold">Total de horas:</h3>
                <input
                    type="text"
                    readOnly
                    value={Object.values(horasPorDia).reduce((acc, curr) => acc + curr, 0)}
                    className="w-20 text-center border rounded px-2 py-1 bg-white"
                />
            </div>

            <div className="mt-1.5 bg-gray-100 rounded p-4 min-h-[200px] border border-gray-300">
                <h3 className="font-semibold mb-2">Días seleccionados:</h3>
                <ul className="max-h-78 overflow-y-auto border p-2 rounded text-sm bg-white flex flex-col gap-2">
                    {dias.length === 0 ? (
                        <li className="text-gray-400">Ninguno</li>
                    ) : (
                        dias.map((fecha, i) => {
                            const clave = fecha.toISOString().split("T")[0];
                            const valor = horasPorDia[clave] ?? 0;

                            return (
                                <li key={i} className="flex justify-between items-center">
                                    <span>{format(fecha, "EEEE dd MMMM yyyy", { locale: es })}</span>
                                    <input
                                        type="number"
                                        value={valor}
                                        min={0}
                                        max={8}
                                        onChange={(e) => {
                                            const num = parseInt(e.target.value) || 0;
                                            actualizarHorasIndividual(clave, num);
                                        }}
                                        className="w-16 text-center border rounded px-1 py-0.5"
                                    />
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>



            {/* Botones */}
            <div className="mt-6 flex justify-end gap-3">
                <button
                    className="rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
                    onClick={() => onGuardar(horasPorDia, ordenInternaOI)}
                >
                    Guardar
                </button>
                <button className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400" onClick={onCancelar}>
                    Cancelar
                </button>
            </div>
        </>
    );
}
