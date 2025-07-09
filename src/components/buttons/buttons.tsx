// components/buttons/buttons.tsx
export default function ButtonFilterWork({ showFilters, toggleFilters }: { showFilters: boolean; toggleFilters: () => void }) {
    return (
        <button
            onClick={toggleFilters}
            className="mb-2 rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
        >
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
        </button>
    );
}

export function ButtonSave() {
    /* data */
    return (
        <>
            <button className="mb-2 rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white">
                Save
            </button>
        </>
    );
}

/* boton edith */

export function ButtonEdit(){

    return(
        <>
        este es un botton
        </>
    )
}

export function Btn_data ({text, Onclick} : {text: string, Onclick: ()=> void}){

    return (
        <button onClick={Onclick} className=" rounded-lg border border-gray-400 bg-transparent px-2 py-[2px] text-sm font-medium transition  cursor-pointer hover:bg-blue-400 hover:text-white">{text}</button>
    )
}