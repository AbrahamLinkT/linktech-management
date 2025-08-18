// components/modal/modelEdith.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from "@mui/material";

type Person = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
};

type Props = {
    open: boolean;
    person?: Person;
    onClose: () => void;
    onSave: (updatedPerson: Person) => void;
};

export default function EditPersonModal({ open, person, onClose, onSave }: Props) {
    const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });

    useEffect(() => {
        if (person) {
            setForm({
                firstName: person.firstName,
                lastName: person.lastName,
                email: person.email,
            });
        }
    }, [person]);

    const handleChange = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!person) return;
        onSave({ id: person.id, ...form });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Editar Persona</DialogTitle>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                <TextField
                    label="Nombre"
                    value={form.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Apellido"
                    value={form.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    fullWidth
                />
                <TextField
                    label="Correo Electrónico"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleSave}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
