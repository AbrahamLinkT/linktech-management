import { Btn_data } from "../buttons/buttons";
import React, { RefObject } from "react";

export function DialogBase({ children, dialogRef, close }: { children: (string | React.ReactNode), dialogRef: RefObject<HTMLDialogElement>, close: () => void }) {
    return (
        <>
            <dialog
                ref={dialogRef}
                className="rounded-xl p-6 shadow-lg backdrop:bg-black/40 
                w-[90%] min-w-[300px] max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-5xl
                text-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                {children}
                <Btn_data Onclick={close} text="x" />
            </dialog>
        </>
    )
}

export function ContentDialog(
    { children, title, text }:
        { children: (React.ReactNode | string), title: string, text: string }) {
    return (

        <div className="text-left space-y-2">
            <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
            <p className=" text-center text-gray-400"> {text}</p>
            {children}
        </div>

    )

}
/* panel lateral */
export function PanelLateral({ Open, close, content, title, width = "w-1/4", }: { title: string, content?: React.ReactNode, Open: boolean, close: () => void, width?: string }) {
    return (
        <div
            className={`fixed top-[64px] right-0 h-[calc(100vh-64px)] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-20 
                ${Open ? `translate-x-0 ${width}` : `translate-x-full ${width}`}`}
        >
            <div className="h-full flex flex-col border-l">
                {/*Encabezado*/}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={close}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {/*Contenido*/}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {content}
                    </div>
                </div>


            </div>
        </div>
    );
}
