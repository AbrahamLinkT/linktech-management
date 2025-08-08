"use client";

import { Table_3 } from "@/components/tables/table";
import React, { useState } from "react";
import { Search } from "lucide-react";



const headers = [
    "Consultor", "Departamento", "Tipo de Empleado", "Esquema", "Tiempo", "Módulo", "Nivel", "Ubicación", "sin info", "Estatus contratación", "Orden Interna Linkplace / Ticket DC", "Proyecto Linkplace", "Facturable", "Responsable de proyecto", "17-feb-25"
];

const rowsOriginal = [
    ["BLANCO PEREZ HECTOR ALEJANDRO", "", "", "", "", "", "", "", "", "", "IC202502", "PV - SV - Doal - Cash Flow", "Fact", "Yayoy Gómez", ""],
    ["GOMEZ MARTINEZ YAYOY MONSERRAT", "Servicios", "Interno", "Asimilado", "FT", "PM", "", "MTY", "1", "", "IC202502", "PV - SV - Doal - Cash Flow", "No Fact", "Yayoy Gómez", ""],
    ["HERNANDEZ MACIAS RAFAEL", "Servicios", "Interno", "Asimilado", "FT", "FI", "", "CDMX", "1", "", "IC202502", "PV - SV - Doal - Cash Flow", "Fact", "Yayoy Gómez", ""],
    ["RAMIREZ MORENO JAIME", "Servicios", "Interno", "Asimilado", "OD", "FI", "", "", "1", "Baja Proyecto", "IC202502", "PV - SV - Doal - Cash Flow", "No Fact", "Yayoy Gómez", ""],
    ["BLANCAS VELAZQUEZ ARMANDO", "Servicios", "Interno", "Asimilado", "FT", "FICO", "", "", "1", "Delivery", "NN202205", "SV - Galletas Dondé - Implementación S/4 HANA", "Fact", "Yayoy Gómez", "4"],
    ["GOMEZ MARTINEZ YAYOY MONSERRAT", "Servicios", "Interno", "Asimilado", "FT", "PM", "", "MTY", "1", "", "NN202205", "SV - Galletas Dondé - Implementación S/4 HANA", "Fact", "Yayoy Gómez", "1"],
];

export default function Proyeccion() {
    // Filtros de columnas
    const [visibleCols, setVisibleCols] = useState<string[]>(headers);
    const [showColFilters, setShowColFilters] = useState(false);
    // Búsqueda
    const [search, setSearch] = useState("");
    // Paginación
    const [page, setPage] = useState(1);
    const pageSize = 10;

    // Filtrar filas por búsqueda y columnas visibles
    const filteredRows = rowsOriginal.filter(row => {
        if (!search.trim()) return true;
        // Buscar en las columnas visibles
        return headers
            .map((col, idx) => visibleCols.includes(col) ? row[idx] : "")
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase());
    });

    // Paginación
    const total = filteredRows.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIdx = (page - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, total);
    const paginatedRows = filteredRows.slice(startIdx, endIdx).map(row =>
        headers
            .map((col, idx) => visibleCols.includes(col) ? row[idx] : null)
            .filter(cell => cell !== null)
    );

    // Cambiar de página y evitar salir de rango
    const goToPage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    // Resetear a la primera página si cambia el filtro o búsqueda
    // Extraer dependencias a variables para cumplir con lint
    const visibleColsKey = visibleCols.join(",");
    React.useEffect(() => { setPage(1); }, [search, visibleColsKey, total]);

    // Filtro de columnas
    const FiltroColumnas = () => (
        <div style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "0.5rem 1rem 0.5rem 1rem",
            marginBottom: "1rem",
            background: "#fafbfc",
            display: "inline-block"
        }}>
            <div style={{ fontWeight: "bold", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Mostrar columnas:</div>
            <div style={{ display: "flex", gap: "1rem" }}>
                {headers.map(col => (
                    <label key={col} style={{ display: "flex", alignItems: "center", fontSize: "0.95rem" }}>
                        <input
                            type="checkbox"
                            checked={visibleCols.includes(col)}
                            onChange={() => setVisibleCols(prev =>
                                prev.includes(col) ? prev.filter(k => k !== col) : [...prev, col]
                            )}
                            style={{ marginRight: "0.3em" }}
                        />
                        {col}
                    </label>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Proyección</h1>
            <div className="bg-[#f6f8fa] rounded-xl p-4 border border-gray-200">
                <div className="flex flex-wrap items-center gap-3 mb-2 justify-between">
                    <div className="flex gap-2 items-center">
                        <form
                            onSubmit={e => { e.preventDefault(); }}
                            className="flex items-center gap-2"
                        >
                            <input
                                type="text"
                                placeholder="Buscar"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="rounded-lg border border-gray-400 bg-white px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                                style={{ minWidth: 180 }}
                            />
                            <button
                                type="submit"
                                className="rounded-lg border border-gray-400 bg-white px-3 py-2 text-sm font-medium flex items-center gap-1 hover:bg-blue-400 hover:text-white"
                                tabIndex={-1}
                            >
                                <Search size={18} className="mr-1" />
                                Buscar
                            </button>
                        </form>
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            type="button"
                            onClick={() => setShowColFilters(v => !v)}
                            className={
                                `rounded-lg border border-gray-400 bg-white px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white` +
                                (showColFilters ? ' bg-blue-100 text-blue-700' : '')
                            }
                        >
                            Filtrar columnas
                        </button>
                        {showColFilters && <FiltroColumnas />}
                    </div>
                </div>
                <Table_3
                    headers={headers.filter(col => visibleCols.includes(col))}
                    rows={paginatedRows}
                    sortable={false}
                    selectable={false}
                />
                <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-600">
                        Mostrando {total === 0 ? 0 : startIdx + 1}-{endIdx} de {total}
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            className="rounded border border-gray-300 px-3 py-1 text-sm font-medium bg-white hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => goToPage(page - 1)}
                            disabled={page === 1}
                        >Anterior</button>
                        <span className="text-sm px-2">{page} / {totalPages}</span>
                        <button
                            type="button"
                            className="rounded border border-gray-300 px-3 py-1 text-sm font-medium bg-white hover:bg-gray-100 disabled:opacity-50"
                            onClick={() => goToPage(page + 1)}
                            disabled={page === totalPages}
                        >Siguiente</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
