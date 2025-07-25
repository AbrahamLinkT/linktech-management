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

// btn reutilizable
export function Btn_data({ text, Onclick, styles, text_color, hover_color }: { text: string, Onclick?: () => void, styles?: string, text_color?: string, hover_color?: string }) {
    const stylesDefault = text_color?.trim()
        ? `absolute top-4 right-4 text-xl font-bold ${text_color} hover:${hover_color}`
        : "absolute top-4 right-4 text-xl font-bold text-gray-500 hover:text-red-500";

    return (
        <button onClick={Onclick} className={styles?.trim() ? styles : stylesDefault}>{text}</button>
    )
}

// btn_list
type BtnListProps = {
    text: string;
    onClick: () => void;
};

export function Btn_list({ items }: { items: BtnListProps[] }) {
    return (
        <div className="absolute right-0 z-50 mt-2 w-40 bg-white shadow-lg rounded border border-gray-200">
            {items.map((item, index) => (
                <button
                    key={index}
                    onClick={item.onClick}
                    className="block w-full text-left px-4 py-2 hover:bg-blue-100"
                >
                    {item.text}
                </button>
            ))}
        </div>
    );
}
