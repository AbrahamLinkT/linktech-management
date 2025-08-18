"use client"
import { overviewData, tarjetas } from '@/constants';
import { Footer } from '@/layouts/footer';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from '@/hooks/use-theme';
import { CardResum } from '@/components/containers/containers';

export default function Analisis() {
    const { theme } = useTheme()

    return (
        <>
            <div className="flex flex-col gap-y-4">
                <h1 className="title">Inicio</h1>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {tarjetas.map((item, idx) => (
                        <CardResum key={idx} {...item} />
                    ))}
                </div>
                {/* Inicio de sección de gráficas lado a lado */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Gráfica de Ingresos */}
                    <div className="card">
                        <div className="card-header">
                            <p className="card-title">Ingresos</p>
                        </div>
                        <div className="card-body p-0">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={overviewData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip cursor={false} formatter={(value) => `$${value}`} />
                                    <XAxis dataKey="name" strokeWidth={0} stroke={theme === "light" ? "#475569" : "#94a3b8"} tickMargin={6} />
                                    <YAxis dataKey="total" strokeWidth={0} stroke={theme === "light" ? "#475569" : "#94a3b8"} tickFormatter={(value) => `$${value}`} tickMargin={6} />
                                    <Area type="monotone" dataKey="total" stroke="#22c55e" fillOpacity={1} fill="url(#colorIngresos)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Gráfica de Costos */}
                    <div className="card">
                        <div className="card-header">
                            <p className="card-title">Costos</p>
                        </div>
                        <div className="card-body p-0">
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={overviewData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorCostos" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip cursor={false} formatter={(value) => `$${value}`} />
                                    <XAxis dataKey="name" strokeWidth={0} stroke={theme === "light" ? "#475569" : "#94a3b8"} tickMargin={6} />
                                    <YAxis dataKey="total" strokeWidth={0} stroke={theme === "light" ? "#475569" : "#94a3b8"} tickFormatter={(value) => `$${value}`} tickMargin={6} />
                                    <Area type="monotone" dataKey="total" stroke="#f97316" fillOpacity={1} fill="url(#colorCostos)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>


                {/* Comienzo de top  */}
                {/* Tabla de trabajadores */}
                <div className="card">
                    <div className="card-header">
                        <p className="card-title">Trabajadores</p>
                    </div>
                    <div className="card-body p-0">
                        <div className="relative h-[400px] w-full overflow-auto">
                            <table className="table">
                                <thead className="table-header">
                                    <tr className="table-row">
                                        <th className="table-head">#</th>
                                        <th className="table-head">Nombre</th>
                                        <th className="table-head">Cargo</th>
                                        <th className="table-head">Horas trabajadas</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {[
                                        { id: 1, nombre: 'Juan Pérez', cargo: 'Desarrollador', horas: 38 },
                                        { id: 2, nombre: 'Ana Gómez', cargo: 'Diseñadora', horas: 42 },
                                        { id: 3, nombre: 'Carlos Ruiz', cargo: 'Project Manager', horas: 35 },
                                    ].map((worker) => (
                                        <tr key={worker.id} className="table-row">
                                            <td className="table-cell">{worker.id}</td>
                                            <td className="table-cell">{worker.nombre}</td>
                                            <td className="table-cell">{worker.cargo}</td>
                                            <td className="table-cell">{worker.horas}h</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* final del top */}
                <Footer />
            </div>
        </>
    )
}