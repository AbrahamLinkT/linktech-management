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


// -------------------- MODAL EDIT --------------------
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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Editar Registro</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    {Object.entries(formData).map(([key, value]) =>
                        key !== "id" ? (
                            <TextField
                                key={key}
                                label={key}
                                value={String(value)}
                                onChange={(e) => handleChange(key as keyof T, e.target.value)}
                                fullWidth
                            />
                        ) : null
                    )}
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
