"use client";

import { UserProfile, SignOutButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";

export default function SettingsPage() {
  const router = useRouter();
  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      bgcolor: 'background.default',
      p: 0,
      m: 0,
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, mb: 2 }}>
        <button
          onClick={() => router.back()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 500 }}
        >
          <ArrowBackIcon sx={{ mr: 1 }} /> Regresar
        </button>
        <SignOutButton>
          <button
            style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: 6, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: 15 }}
          >
            Cerrar sesión
          </button>
        </SignOutButton>
      </Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
        Configuración de cuenta
      </Typography>
      <Box sx={{ flex: 1, width: '100vw', height: '100%', display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
        <SignedIn>
          <UserProfile path="/settings" routing="path" appearance={{
            elements: { card: 'w-full', rootBox: 'h-full min-h-[600px]' }
          }} />
        </SignedIn>
        <SignedOut>
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>No has iniciado sesión</Typography>
            <Typography sx={{ mb: 3, color: 'text.secondary' }}>Inicia sesión para ver y editar tu perfil.</Typography>
            <SignInButton mode="redirect" redirectUrl="/settings">
              <button className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">Iniciar sesión</button>
            </SignInButton>
          </Box>
        </SignedOut>
      </Box>
    </Box>
  );
}
