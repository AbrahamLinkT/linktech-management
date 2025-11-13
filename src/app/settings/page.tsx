"use client";

import { UserProfile } from "@clerk/nextjs";
import { Box, Typography } from "@mui/material";

export default function SettingsPage() {
  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
        Configuración de cuenta
      </Typography>
      <UserProfile path="/settings" routing="path" />
    </Box>
  );
}
