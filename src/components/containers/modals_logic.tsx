import { TextField } from "@mui/material";

export function Adduser() {
    return (
        <>
            <form>
                <TextField label="Nombre" fullWidth sx={{ mb: 2 }} />
                <TextField label="Email" fullWidth sx={{ mb: 2 }} />
                <TextField label="Teléfono" fullWidth />
            </form>
        </>
    )
}