"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { Btn_data } from "@/components/buttons/buttons";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation"; // Eliminado: no usado
import { Box, Button, Typography } from "@mui/material";

interface Solicitud {
  id: string;
  consultor: string;
  departamento: string;
  modulo: string;
  proyecto: string;
  fechas: string;
  horas: string;
  solicitante: string;
}

export default function SolicitudHoras() {
  // Estado para selección de filas
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  
  // Definir columnas
  const columns = useMemo<MRT_ColumnDef<Solicitud>[]>(
    () => [
      { accessorKey: "consultor", header: "Consultor", size: 200 },
      { accessorKey: "departamento", header: "Departamento", size: 120 },
      { accessorKey: "modulo", header: "Módulo", size: 120 },
      { accessorKey: "proyecto", header: "Proyecto-OI", size: 150 },
      { accessorKey: "fechas", header: "Fechas", size: 200 },
      { accessorKey: "horas", header: "Horas por día", size: 150 },
      { accessorKey: "solicitante", header: "Solicitante", size: 180 },
    ],
    []
  );

  // Datos estáticos (envueltos en useMemo)
  const data: Solicitud[] = useMemo(() => [
    {
      id: "1",
      consultor: "Diego Carranza",
      departamento: "FI",
      modulo: "FI",
      proyecto: "",
      fechas: "20/08/25 - 15/10/25",
      horas: "8 horas",
      solicitante: "Mario Alvarez",
    },
    {
      id: "2",
      consultor: "Esteban Gutiérrez",
      departamento: "MM",
      modulo: "MM",
      proyecto: "",
      fechas: "20/08/25 - 10/09/25",
      horas: "8 horas",
      solicitante: "Luis Martinez",
    },
  ], []);

  // --- Estado para el modal ---
  const [openModal, setOpenModal] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState<Solicitud | null>(null);
  const [rangoHoras, setRangoHoras] = useState({ desde: "", hasta: "", cantidad: 0 });
  const handleGuardarHoras = () => { // aqui se pone la logica para guardar horas
    console.log("Guardando horas:", registroSeleccionado, rangoHoras);
    setOpenModal(false);
    setRegistroSeleccionado(null);
  };

  // Manejar selección de filas
  useEffect(() => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    if (selectedIds.length === 1) {
      const registro = data.find(item => item.id === selectedIds[0]);
      if (registro) {
        // Convertir la fecha de "DD/MM/YY - DD/MM/YY" a formato "YYYY-MM-DD"
        const [desdeStr, hastaStr] = registro.fechas.split(" - ");
        const parseDate = (str: string) => {
          const [d, m, y] = str.split("/").map(Number);
          return `20${y.toString().padStart(2, "0")}-${m.toString().padStart(2,"0")}-${d.toString().padStart(2,"0")}`;
        };

        setRegistroSeleccionado(registro);
        setRangoHoras({
          desde: parseDate(desdeStr),
          hasta: parseDate(hastaStr),
          cantidad: Number(registro.horas.split(" ")[0])
        });
        setOpenModal(true);
        
        // Limpiar selección para evitar loops
        setRowSelection({});
      }
    }
  }, [rowSelection, data]);

  const actions = { edit: false, add: false, export: false, delete: false, cancel: true, accept: true };
  const router = useRouter() // Eliminado: no usado
  const handleClickRoute = () => {
    router.push("/dashboard/proyeccion")
  }
  return (
    <ContentBody title="Solicitud de horas pendientes"
      btnReg={
        <Btn_data
          icon={<ArrowLeft />}
          text={"Regresar"}
          styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
          Onclick={handleClickRoute}
        />
      }>
      <DataTable<Solicitud>
        data={data}
        columns={columns}
        menu={true}
        actions={actions}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
      />

      {/* Modal para cambiar horas */}
      {openModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.25)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: 3,
              p: 4,
              minWidth: 320,
              boxShadow: 6,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Solicitud
            </Typography>
            {registroSeleccionado && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2"><b>Consultor:</b> {registroSeleccionado.consultor}</Typography>
                <Typography variant="body2"><b>Departamento:</b> {registroSeleccionado.departamento}</Typography>
                <Typography variant="body2"><b>Módulo:</b> {registroSeleccionado.modulo}</Typography>
                <Typography variant="body2"><b>Proyecto:</b> {registroSeleccionado.proyecto}</Typography>
                <Typography variant="body2"><b>Solicitante:</b> {registroSeleccionado.solicitante}</Typography>
              </Box>
            )}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", m: 2 }}>
              <Typography variant="body2">Desde:</Typography>
              <input
                type="date"
                value={rangoHoras.desde}
                onChange={e => setRangoHoras(r => ({ ...r, desde: e.target.value }))}
                style={{ width: 140, padding: 4 }}
              />
              <Typography variant="body2">Hasta:</Typography>
              <input
                type="date"
                value={rangoHoras.hasta}
                onChange={e => setRangoHoras(r => ({ ...r, hasta: e.target.value }))}
                style={{ width: 140, padding: 4 }}
              />
              <Typography variant="body2">Cantidad de horas:</Typography>
              <input
                type="number"
                min={0}
                max={24}
                value={rangoHoras.cantidad}
                onChange={e => setRangoHoras(r => ({ ...r, cantidad: Number(e.target.value) }))}
                style={{ width: 80, padding: 4 }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleGuardarHoras}>
                Guardar
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setOpenModal(false);
                  setRegistroSeleccionado(null);
                }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      
    </ContentBody>
  );
}
