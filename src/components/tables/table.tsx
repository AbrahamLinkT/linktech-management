import React, { useMemo, useState } from "react";

// componente para tablas 
export function Table_1({ headers, hoverActive = false, rows, EventOnclick, rowActiveIndex }: {
    headers: string[], rows: (string | React.ReactNode)[][],
    EventOnclick?: (row: (React.ReactNode | string)[]) => void, hoverActive?: boolean,
    rowActiveIndex?: number
}) {
    return (
        <div className="overflow-auto">
            <table className="table w-full">
                <thead className="table-header">
                    <tr className="table-row">
                        {headers.map((header, index) => (
                            <th key={index} className="table-head">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table-body">
                    {
                        rows.map((row, index) => (
                            <tr
                                key={index}
                                className={
                                    `${hoverActive ?
                                        "table-row hover:bg-gray-100 cursor-pointer" :
                                        "table-row hover:bg-gray-100 "
                                    } ${rowActiveIndex === index ? "bg-blue-100" : ""}`
                                }
                                onClick={() => EventOnclick?.(row)}
                            >
                                {
                                    row.map((cell, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`table-cell ${colIndex === row.length - 1 ? "relative text-center" : ""}`}
                                        >
                                            {cell}
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export function Table_2({ headers, rows, EventOnclick, }: { headers: string[]; rows: (string | React.ReactNode)[][]; EventOnclick?: (row: (React.ReactNode | string)[]) => void; }) {
    return (
        <div className="w-full ">
            <table className="min-w-[1000px] w-full table-auto border-collapse">
                <thead className="table-header sticky top-0 ">
                    <tr>
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                className="table-head "
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="hover:bg-gray-100 cursor-pointer"
                            onClick={() => EventOnclick?.(row)}
                        >
                            {row.map((cell, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`px-4 py-2 border-b ${colIndex === row.length - 1 ? "text-center" : "text-left"
                                        }`}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

interface TableProps {
    headers: string[];
    rows: (string | React.ReactNode)[][];
    EventOnclick?: (index: number) => void;
    selectable?: boolean;
    sortable?: boolean;
}

export function Table_3({
    headers,
    rows,
    EventOnclick,
    selectable = true, // por defecto activado
    sortable = false,
}: TableProps) {
    const [columnWidths, setColumnWidths] = useState<number[]>(
        new Array(headers.length).fill(150)
    );
    const [selectedCell, setSelectedCell] = useState<number | null>(null); // solo fila seleccionada
    const [sortConfig, setSortConfig] = useState<{
        columnIndex: number | null;
        direction: "asc" | "desc";
    }>({ columnIndex: null, direction: "asc" });

    const startResize = (index: number, e: React.MouseEvent) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = columnWidths[index];

        const handleMouseMove = (e: MouseEvent) => {
            const newWidth = Math.max(startWidth + (e.clientX - startX), 50);
            setColumnWidths((prev) => {
                const updated = [...prev];
                updated[index] = newWidth;
                return updated;
            });
        };

        const stopResize = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", stopResize);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", stopResize);
    };

    /* logica de ordenamiento */
    const sortedRows = useMemo(() => {
        if (!sortable || sortConfig.columnIndex === null) return rows;

        const sorted = [...rows].sort((a, b) => {
            const aVal = a[sortConfig.columnIndex!];
            const bVal = b[sortConfig.columnIndex!];

            const aStr = typeof aVal === "string" ? aVal : String(aVal);
            const bStr = typeof bVal === "string" ? bVal : String(bVal);

            const aNum = parseFloat(aStr);
            const bNum = parseFloat(bStr);
            const isNumeric = !isNaN(aNum) && !isNaN(bNum);

            if (isNumeric) {
                return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
            } else {
                return sortConfig.direction === "asc"
                    ? aStr.localeCompare(bStr)
                    : bStr.localeCompare(aStr);
            }
        });

        return sorted;
    }, [rows, sortConfig, sortable]);
    return (
        <div className="overflow-auto w-full">
            <table className="table w-full border-collapse">
                <thead className="table-header">
                    <tr className="table-row">
                        {headers.map((header, index) => (
                            <th
                                key={index}
                                style={{ width: columnWidths[index] }}
                                className="table-head relative select-none cursor-pointer"
                                onClick={() => {
                                    if (!sortable) return;

                                    if (sortConfig.columnIndex === index) {
                                        setSortConfig({
                                            columnIndex: index,
                                            direction:
                                                sortConfig.direction === "asc" ? "desc" : "asc",
                                        });
                                    } else {
                                        setSortConfig({ columnIndex: index, direction: "asc" });
                                    }
                                }}
                            >
                                <div className="flex justify-between items-center pr-2">
                                    <span>{header}</span>
                                    {sortable && sortConfig.columnIndex === index && (
                                        <svg
                                            className={`w-4 h-4 ml-1 transition-transform duration-150 ${sortConfig.direction === "asc" ? "rotate-180" : ""
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19 9l-7 7-7-7"
                                            ></path>
                                        </svg>
                                    )}
                                    <div
                                        onMouseDown={(e) => startResize(index, e)}
                                        className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400"
                                    />
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="table-body">
                    {sortedRows.map((row, rowIndex) => {
                        const isSelected = selectedCell === rowIndex;

                        return (
                            <tr
                                key={rowIndex}
                                className={`table-row ${selectable ? "cursor-pointer" : ""} ${isSelected ? "bg-blue-100" : "hover:bg-gray-100"}`}
                                {...(selectable
                                    ? {
                                        onClick: () => {
                                            if (selectedCell === rowIndex) {
                                                setSelectedCell(null); // desmarca si ya está seleccionada
                                                EventOnclick?.(-1);
                                            } else {
                                                setSelectedCell(rowIndex); // selecciona nueva fila
                                                EventOnclick?.(rowIndex);
                                            }
                                        },
                                    }
                                    : {})}
                            >
                                {row.map((cell, colIndex) => (
                                    <td
                                        key={colIndex}
                                        style={{ width: columnWidths[colIndex] }}
                                        className={`table-cell ${colIndex === row.length - 1 ? "relative text-center" : ""}`}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>

            </table>
        </div>
    );
}