"use client"
import { useRef, useState } from "react";

export default function correo() {
    return (
        <div>
            <FormularioCorreo />
        </div>
    );
}

// components/FormularioCorreo.tsx

import { SendHorizontal, Image as ImageIcon, FileText, X } from "lucide-react";
import Image from "next/image";


export function FormularioCorreo() {
    const [para, setPara] = useState("");
    const [asunto, setAsunto] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [archivos, setArchivos] = useState<File[]>([]);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!para || !asunto || !mensaje) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        console.log({
            de: "example@tuapp.com",
            para,
            asunto,
            mensaje,
            archivos,
        });

        alert("Mensaje preparado.");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const nuevosArchivos = Array.from(e.target.files);
            setArchivos((prev) => [...prev, ...nuevosArchivos]);
        }
    };

    const eliminarArchivo = (index: number) => {
        setArchivos((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto mt-5 bg-white rounded border shadow p-4 space-y-4 "
        >
            {/* Enviar */}
            <div className="flex justify-between items-center">
                <button
                    type="submit"
                    className="bg-blue-600 text-white font-semibold px-3 py-2 rounded hover:bg-blue-700 flex gap-2"
                >
                    <SendHorizontal />
                    Enviar
                </button>
            </div>

            {/* Campo Para */}
            <div className="flex items-center gap-2 relative">
                <label className="text-sm font-medium w-12">Para:</label>
                <input
                    type="email"
                    value={para}
                    onChange={(e) => setPara(e.target.value)}
                    className="flex-1 border-b border-gray-400 outline-none py-1 px-2 text-gray-700 focus:border-blue-500"
                    placeholder="correo@destinatario.com"
                />
            </div>

            {/* Asunto */}
            <div className="flex items-center gap-2">
                <label htmlFor="asunto" className="text-sm font-medium w-12">
                    Asunto:
                </label>
                <input
                    type="text"
                    value={asunto}
                    onChange={(e) => setAsunto(e.target.value)}
                    className="w-full border-b border-gray-400 outline-none py-1 px-2 text-gray-700 focus:border-blue-500"
                    placeholder="Agregar un asunto"
                />
            </div>

            {/* Descripción */}
            <div>
                <textarea
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="w-full min-h-[200px] text-gray-800 p-2 resize-none outline-none"
                    placeholder="Escriba su mensaje..."
                />
            </div>

            {/* Adjuntar archivos */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adjuntar archivos:
                </label>

                {/* Botón para abrir el input */}
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="bg-gray-100 border border-gray-300 px-3 py-2 rounded hover:bg-gray-200 text-sm text-gray-800 flex items-center gap-2"
                >
                    <ImageIcon className="w-4 h-4" />
                    Adjuntar archivos
                </button>

                {/* Input oculto */}
                <input
                    type="file"
                    ref={inputRef}
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileChange}
                    className="hidden"
                />

                {/* Previsualización */}
                <div className="mt-4 flex flex-wrap gap-2">
                    {archivos.map((archivo, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded border w-fit max-w-[250px]"
                        >
                            {archivo.type.startsWith("image/") ? (
                                <Image
                                    src={URL.createObjectURL(archivo)}
                                    alt="preview"
                                    width={40}
                                    height={40}
                                    unoptimized
                                    className="object-cover rounded"
                                />
                            ) : (
                                <FileText className="w-6 h-6 text-gray-600" />
                            )}

                            <span className="truncate flex-1">{archivo.name}</span>

                            <button
                                type="button"
                                onClick={() => eliminarArchivo(index)}
                                className="text-red-500 hover:text-red-700 self-center"
                                title="Eliminar archivo"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </form>
    );
}
