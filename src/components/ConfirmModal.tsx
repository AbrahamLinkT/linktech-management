import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface ConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message?: string;
}

export default function ConfirmModal({
    isOpen,
    onConfirm,
    onCancel,
    message = "¿Estás seguro de que deseas salir?",
}: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md text-center border border-gray-300"
            >
                <div className="flex flex-col items-center gap-4">
                    {/* Ícono con animación */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity, repeatType: "loop" }}
                    >
                        <AlertTriangle className="text-yellow-500 w-12 h-12" />
                    </motion.div>

                    <h2 className="text-xl font-semibold">Advertencia</h2>
                    <p className="text-gray-700">{message}</p>

                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={onCancel}
                            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
