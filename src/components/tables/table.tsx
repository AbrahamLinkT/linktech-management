import React from "react";

// componente para tablas 
export function Table_1({ headers, hoverActive = false, rows, EventOnclick }: {
    headers: string[], rows: (string | React.ReactNode)[][],
    EventOnclick?: (row: (React.ReactNode | string)[]) => void, hoverActive?: boolean
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
                                    }`
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
export function Table_3({
    headers,
    rows,
    EventOnclick,
}: {
    headers: string[];
    rows: (string | React.ReactNode)[][];
    EventOnclick?: (index: number) => void;
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
                    {rows.map((row, index) => (
                        <tr
                            key={index}
                            className="table-row hover:bg-gray-100 cursor-pointer"
                            onClick={() => EventOnclick?.(index)} // ✅ solo pasamos el índice
                        >
                            {row.map((cell, colIndex) => (
                                <td
                                    key={colIndex}
                                    className={`table-cell ${colIndex === row.length - 1 ? "relative text-center" : ""}`}
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
