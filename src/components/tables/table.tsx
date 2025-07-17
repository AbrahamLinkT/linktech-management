import React from "react";

// componente para tablas 
export function Table_1({ headers, rows, EventOnclick }: { headers: string[], rows: (string | React.ReactNode)[][], EventOnclick?: (row: (React.ReactNode | string)[]) => void }) {
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
                                className="table-row hover:bg-gray-100 cursor-pointer"
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

