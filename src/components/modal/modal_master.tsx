"use client";
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from "@mui/material";

type ModalEditProps<T extends { id: string }> = {
    open: boolean;
    onClose: () => void;
    rowData: T | null;
    onSave: (updated: T) => void;
};

export function ModalEdit<T extends { id: string }>({
    open,
    onClose,
    rowData,
    onSave,
}: ModalEditProps<T>) {
    const [formData, setFormData] = useState<T | null>(rowData);

    useEffect(() => {
        setFormData(rowData);
    }, [rowData]);

    if (!formData) return null;

    const handleChange = (key: keyof T, value: string) => {
        setFormData((prev) =>
            prev ? { ...prev, [key]: value } : prev
        );
    };

    const handleSave = () => {
        if (formData) {
            onSave(formData);
            onClose();
        }
    };

    // Detectamos si pasamos de 5 campos
    const entries = Object.entries(formData).filter(([key]) => key !== "id");
    const isTwoColumns = entries.length > 5;

    // Función para detectar si un campo es fecha
    const isDateField = (key: string, value: unknown) => {
        if (key.toLowerCase().includes("fecha")) return true;

        if (typeof value !== "string") return false;

        // Regex estrictas para formatos de fecha comunes
        const regexISO = /^\d{4}[-/]\d{2}[-/]\d{2}$/; // YYYY-MM-DD o YYYY/MM/DD
        const regexDMY = /^\d{2}[-/]\d{2}[-/]\d{4}$/; // DD-MM-YYYY o DD/MM/YYYY

        return regexISO.test(value) || regexDMY.test(value);
    };

    // 🟢 Función para normalizar la fecha al formato válido para input[type="date"]
    const normalizeDate = (value: string) => {
        if (!value) return "";

        // Caso rango "2025/08/23 - 2025/08/25" → tomar la primera fecha
        if (value.includes("-") && value.includes("/")) {
            const firstDate = value.split("-")[0].trim();
            return firstDate.replace(/\//g, "-"); // "2025-08-23"
        }

        // Caso "2025/12/23" → convertir "/" a "-"
        if (/^\d{4}\/\d{2}\/\d{2}$/.test(value)) {
            return value.replace(/\//g, "-"); // "2025-12-23"
        }

        return value;
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Editar Registro</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: isTwoColumns ? "1fr 1fr" : "1fr",
                        gap: 2,
                        mt: 1,
                    }}
                >
                    {entries.map(([key, value]) => (
                        <TextField
                            key={key}
                            label={key}
                            type={isDateField(key, value) ? "date" : "text"}
                            value={
                                isDateField(key, value)
                                    ? normalizeDate(String(value))
                                    : String(value)
                            }
                            onChange={(e) => handleChange(key as keyof T, e.target.value)}
                            fullWidth
                            InputLabelProps={
                                isDateField(key, value) ? { shrink: true } : undefined
                            }
                        />
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="error">
                    Cancelar
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}


// -------------------- MODAL ADD --------------------

type ModalProps = {
    open: boolean;
    title?: string;
    onClose: () => void;
    onSave: () => void;
    children: React.ReactNode;
    saveText?: string;
};

export function ModalGen({ open, title, onClose, onSave, children, saveText = "Guardar" }: ModalProps) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            {title && <DialogTitle>{title}</DialogTitle>}
            <DialogContent>{children}</DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="error">Cancelar</Button>
                <Button onClick={onSave} variant="contained" color="primary">{saveText}</Button>
            </DialogActions>
        </Dialog>
    );
}

// ---------------- MODAL REDIRECT -------------
type ModalRoutePops = {
    open: boolean;
    title?: string;
    onclose: () => void
    onRoute: () => void
    children: React.ReactNode
}

export function ModalRoute({ open, title, onclose, onRoute, children }: ModalRoutePops) {
    return (
        <>
            <Dialog open={open} onClose={onclose} maxWidth="sm" fullWidth>
                {title && <DialogTitle>{title} </DialogTitle>}
                <DialogContent>{children}</DialogContent>
                <DialogActions>
                    <Button onClick={onclose} variant="outlined" color="error">Cancelar</Button>
                    <Button onClick={onRoute} variant="contained" color="primary">Aceptar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

// ---------------- MODAL Add consultor -------------
