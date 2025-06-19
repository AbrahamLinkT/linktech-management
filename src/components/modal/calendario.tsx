import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { isWeekend } from "date-fns";
import { es } from "date-fns/locale";
import { format } from "date-fns";

interface Props {
    onclose: () => void;
    workerId: string;
    ordenInterna: string;
}

export default function Calendario({ onclose, workerId, ordenInterna }: Props) {
    const [range, setRange] = useState<DateRange | undefined>();
    const [horas, setHoras] = useState("0");

    // Mapa de fechas con sus horas individuales
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
            [fecha]: Math.min(8, Math.max(0, valor)), // entre 0 y 8
        }));
    };

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl rounded-lg bg-white p-6 shadow-lg">
                <h3>
                    Trabajador: <span className="font-medium">{workerId}</span>
                    | Orden Interna: <span className="font-medium">{ordenInterna}</span>
                </h3>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <DayPicker
                            mode="range"
                            selected={range}
                            onSelect={setRange}
                            disabled={isWeekend}
                            showOutsideDays
                            className="border rounded-md p-2"
                            locale={es}
                        />

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
                    </div>

                    {/* Lista de días hábiles con inputs individuales */}
                    <div className="bg-gray-100 rounded p-4 min-h-[200px] border border-gray-300">
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
                                                onChange={(e) =>
                                                    actualizarHorasIndividual(clave, parseInt(e.target.value))
                                                }
                                                className="w-16 text-center border rounded px-1 py-0.5"
                                            />
                                        </li>
                                    );
                                })
                            )}
                        </ul>

                        {/* Total de horas y campo de texto en una sola línea */}
                        <div className="flex items-center justify-between mt-4">
                            <h3 className="font-semibold">Total de horas:</h3>
                            <input
                                type="text"
                                readOnly
                                value={Object.values(horasPorDia).reduce((acc, curr) => acc + curr, 0)}
                                className="w-20 text-center border rounded px-2 py-1 bg-white"
                            />
                        </div>
                    </div>

                </div>

                {/* Botones abajo */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        className="rounded bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
                        onClick={() => console.log("Guardar", { diasHabiles, horasPorDia })}
                    >
                        Guardar
                    </button>
                    <button
                        className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
                        onClick={onclose}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
