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

