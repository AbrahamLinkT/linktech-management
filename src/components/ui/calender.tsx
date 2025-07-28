import React, { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { isWeekend } from "date-fns";
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
import { Pencil } from "lucide-react";

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

interface OrdenInterna {
    OI: string;
    titulo: string;
    nombre: string;
    fechaIn: string;
    fechaFn: string;
}

interface Calendario2Props {
    idUsuario: string | null;
    ordenesInternas: OrdenInterna[];
    Table_info: React.ReactNode
}
// CALENDARIO 2
export default function Calendario2({ idUsuario, ordenesInternas, Table_info }: Calendario2Props) {
    const [range, setRange] = useState<DateRange | undefined>();
    const [horas, setHoras] = useState("0");
    const [edith, setEdith] = useState(false);
    const [ordenInternaOI, setOrdenInternaOI] = useState<string>(
        ordenesInternas.length > 0 ? ordenesInternas[0].OI : ""
    );
    const handleClick = () => {
        setEdith(!edith);
    };

    const [horasPorDia, setHorasPorDia] = useState<Record<string, number>>({});

    const diasHabiles = range?.from && range.to
        ? Array.from(
            { length: (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24) + 1 },
            (_, i) => {
                const date = new Date(range.from!.getTime());
                date.setDate(date.getDate() + i);
                return date;
            }
        ).filter((date) => !isWeekend(date))
        : [];

    const aplicarHorasATodos = () => {
        const nuevasHoras: Record<string, number> = {};
        diasHabiles.forEach((dia) => {
            const clave = dia.toISOString().split("T")[0];
            nuevasHoras[clave] = Math.min(8, parseInt(horas) || 0);
        });
        setHorasPorDia(nuevasHoras);
    };

    const actualizarHorasIndividual = (fecha: string, valor: number) => {
        setHorasPorDia((prev) => ({
            ...prev,
            [fecha]: Math.min(8, Math.max(0, valor)),
        }));
    };

    return (
        <>
            <div hidden>
                <p className="text-sm text-blue-500 mb-2">
                    ID del usuario: <strong>{idUsuario}</strong>
                </p>
            </div>

            {/* Calendario */}
            <div>
                <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={setRange}
                    disabled={isWeekend}
                    showOutsideDays
                    showWeekNumber
                    className="border rounded-md p-2"
                    locale={es}
                />
            </div>
            {/* Botón editar (solo se muestra si no está en modo edición) */}
            {!edith && (
                <>
                    <div className="flex justify-end mt-1.5 mb-3">
                        <button
                            className="flex items-center gap-1 cursor-pointer border rounded px-2 py-1 bg-gray-100 text-sky-400 hover:bg-sky-500 hover:text-white"
                            onClick={handleClick}
                        >
                            <span className="ml-1.5">Editar</span>
                            <Pencil />
                        </button>
                    </div>
                    {Table_info}
                </>
            )}

            {/* Contenido editable solo si edith es true */}
            {edith && (
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
                        <h3 className="font-semibold mb-2">Días hábiles seleccionados:</h3>
                        <ul className="max-h-78 overflow-y-auto border p-2 rounded text-sm bg-white flex flex-col gap-2">
                            {diasHabiles.length === 0 ? (
                                <li className="text-gray-400">Ninguno</li>
                            ) : (
                                diasHabiles.map((fecha, i) => {
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
                                                    const val = e.target.value;
                                                    const num = val === "" ? 0 : parseInt(val);
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
                    {/* Botones */}
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            className="rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
                            onClick={() => console.log("Guardar", { diasHabiles, horasPorDia })}
                        >
                            Guardar
                        </button>
                        <button
                            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                            onClick={() => setEdith(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </>
            )}
        </>
    );
}
