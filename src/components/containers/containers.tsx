import { CardResumProps } from "@/constants"
import React from "react"

// contenedores
export function ContentBody({ children, title, subtitle, contentSubtitleComponent, ContentBtn, btnReg }: { title?: string, btnReg?: React.ReactNode, children?: React.ReactNode, subtitle?: string, contentSubtitleComponent?: React.ReactNode, ContentBtn?: React.ReactNode }) {
    const contentTitle = <h2 className="mb-8 text-2xl font-bold">{title}</h2>
    const ContentSubtitle = <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 pl-3 pt-2">{subtitle}</h2>
    return (
        <div className="p-1">
            {btnReg ? (
                <div className="flex justify-between">
                    <div>{contentTitle}</div>
                    <div className="col-end-1">{btnReg}</div>
                </div>
            ) : (
                contentTitle
            )}
            {subtitle && (
                <div className="py-2 px-2 overflow-hidden rounded-lg border border-gray-300 bg-white p-0 shawdow-md dark:border-slate-700 dark:bg-slate-800 mb-2.5">
                    {ContentSubtitle}
                    {contentSubtitleComponent}
                </div>
            )}
            {ContentBtn}
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
            <div className="p-1 py-1 relative max-h-[550px] min-h-[100px] w-full overflow-x-auto overflow-y-auto rounded-none [scrollbar-width:thin]">

                {Body}
            </div>
        </>
    )
}


export function ContentTrasition({ IspanelOpen, body, panel }: { IspanelOpen?: () => void, body?: React.ReactNode, panel?: React.ReactNode }) {
    return (
        <div className="relative flex">
            <div className={`transition-all duration-300 ${IspanelOpen ? 'w-[calc(100%-25%)] pr-4' : 'w-full pr-4'}`}>
                {body}
            </div>
            {panel}
        </div>
    )
}


export function CardResum({ titulo, valor, porcentaje, icono, color }: CardResumProps) {
    const bgColor = `bg-${color}-500/20 dark:bg-${color}-600/20`;
    const textColor = `text-${color}-500 dark:text-${color}-600`;
    const borderColor = `border-${color}-500 dark:border-${color}-600`;

    return (
        <div className="card">
            <div className="card-header">
                <div className={`w-fit rounded-lg p-2 transition-colors ${bgColor} ${textColor}`}>
                    {icono}
                </div>
                <p className="card-title">{titulo}</p>
            </div>
            <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">{valor}</p>
                <span className={`flex w-fit items-center gap-x-2 rounded-full border px-2 py-1 font-medium ${textColor} ${borderColor}`}>
                    {parseFloat(porcentaje) >= 0 ? "↑" : "↓"} {porcentaje}
                </span>
            </div>
        </div>
    );
}
