"use client";

export default function Cargabilidad() {
    const handleclick = () => {
        console.log("Hola mudno")
    }
    return (
        <>
            <h2>hola mundo</h2>
            <button onClick={handleclick} className="border-2 text-2xl bg-red-400"> hoa </button>
            <button onClick={handleclick}> hoa </button>
        </>
    )
}