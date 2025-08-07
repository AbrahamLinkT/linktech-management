import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface ModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    body?: any;
}

export default function Modal({
    isOpen,
    onConfirm,
    onCancel,
    body = "",
}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className="bg-white p-6 rounded-xl shadow-xl w-[95%] max-w-2xl text-center border border-gray-300"
            >
                <div className="flex flex-col items-center gap-4">

                    {/*<p className="text-gray-700">{message}</p>*/}
                    {body}

                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            onClick={onCancel}
                            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
