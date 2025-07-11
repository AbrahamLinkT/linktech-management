import React from "react"

// contenedores
export function ContentBody({ children, title }: { title?: string, children?: React.ReactNode }) {
    const contentTitle = <h2 className="mb-8 text-2xl font-bold">{title}</h2>
    return (
        <div className="p-1">
            {contentTitle}
            <div className="py-2 px-2 overflow-hidden rounded-lg border border-gray-300 bg-white p-0 shawdow-md dark:border-slate-700 dark:bg-slate-800">
                {children}
            </div>
        </div>
    )
}


export function ContentTable({ header, Body }: { header?: React.ReactNode, Body: React.ReactNode }) {
    return (
        <>
            {header}
            <div className="relative max-h-[550px] min-h-[100px] w-full overflow-y-auto rounded-none [scrollbar-width:thin">
                {Body}
            </div>
        </>
    )
}