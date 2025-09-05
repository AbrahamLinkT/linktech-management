"use client";

import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowSelectionState,
} from "material-react-table";
import { Box, Typography, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

// ---- Tipos ----
type ProyeccionRow = {
  consultor: string;
  departamento: string;
  tipoEmpleado: string;
  esquema: string;
  tiempo: string;
  modulo: string;
  nivel: string;
  horas: string[]; // índice 0..14 (3 semanas * 5 días)
  fechaLibre: string;
};

// ---- Datos de cabeceras por semana ----
const semanas = [
  { nombre: "Semana 1", dias: ["Lunes 1", "Martes 2", "Miércoles 3", "Jueves 4", "Viernes 5"] },
  { nombre: "Semana 2", dias: ["Lunes 8", "Martes 9", "Miércoles 10", "Jueves 11", "Viernes 12"] },
  { nombre: "Semana 3", dias: ["Lunes 15", "Martes 16", "Miércoles 17", "Jueves 18", "Viernes 19"] },
];

// Encabezado minimalista: SOLO título arriba (sin opciones abajo)
function TitleOnlyHeader({ title }: { title: string }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", p: 0.5 }}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, textAlign: "center", lineHeight: 1.1 }}
        title={title}
      >
        {title}
      </Typography>
    </Box>
  );
}

function ProyeccionTablePage() {
  const [vistaError, setVistaError] = useState('');
  // Estado para modal de cambiar vista
  const [openVistaModal, setOpenVistaModal] = useState(false);
  const [vistaTipo, setVistaTipo] = useState<'fechas' | 'semanas'>('semanas');
  const [vistaRango, setVistaRango] = useState({ desde: '', hasta: '' });
  const [vistaSemanas, setVistaSemanas] = useState(3); // cantidad de semanas a mostrar

  // Función para cambiar la cantidad de semanas
  const handleGuardarVista = () => {
    setVistaError('');
    if (vistaTipo === 'semanas') {
      const num = parseInt(vistaRango.desde);
      if (!isNaN(num) && num > 0 && num <= 10) {
        setVistaSemanas(num);
        setOpenVistaModal(false);
      }
    } else {
      // Calcular semanas completas entre las fechas
      if (vistaRango.desde && vistaRango.hasta) {
        const desde = new Date(vistaRango.desde);
        const hasta = new Date(vistaRango.hasta);
        if (!isNaN(desde.getTime()) && !isNaN(hasta.getTime()) && hasta > desde) {
          const diffMs = hasta.getTime() - desde.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
          const semanas = Math.max(1, Math.floor(diffDays / 7));
          if (diffDays < 7) {
            setVistaError('El rango de fechas debe ser al menos de una semana.');
            return;
          }
          setVistaSemanas(semanas);
          setOpenVistaModal(false);
        } else {
          setVistaError('Fechas inválidas.');
        }
      } else {
        setVistaError('Debes seleccionar ambas fechas.');
      }
    }
  };
  // ---- Datos de ejemplo ----
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  // Estado para modal de cambiar horas
  const [openModal, setOpenModal] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState<number | null>(null);
  const [rangoHoras, setRangoHoras] = useState({ desde: '', hasta: '', cantidad: '' });
  const [registroSeleccionado, setRegistroSeleccionado] = useState<ProyeccionRow | null>(null);

  const [tableData, setTableData] = useState<ProyeccionRow[]>([
    {
      consultor: "Ana Martínez",
      departamento: "Finanzas",
      tipoEmpleado: "Tiempo completo",
      esquema: "Presencial",
      tiempo: "40/sem",
      modulo: "SAP",
      nivel: "Senior",
      horas: ["8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8"],
      fechaLibre: "15-09-25",
    },
    {
      consultor: "Luis Gómez",
      departamento: "TI",
      tipoEmpleado: "Medio tiempo",
      esquema: "Remoto",
      tiempo: "20/sem",
      modulo: "Oracle",
      nivel: "Junior",
      horas: ["4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4", "4"],
      fechaLibre: "22-09-25",
    },
    {
      consultor: "María López",
      departamento: "Recursos Humanos",
      tipoEmpleado: "Tiempo completo",
      esquema: "Híbrido",
      tiempo: "40/sem",
      modulo: "PeopleSoft",
      nivel: "Pleno",
      horas: ["8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8"],
      fechaLibre: "18-09-25",
    },
    {
      consultor: "Carlos Ruiz",
      departamento: "Operaciones",
      tipoEmpleado: "Consultor externo",
      esquema: "Remoto",
      tiempo: "30/sem",
      modulo: "SAP",
      nivel: "Senior",
      horas: ["6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6", "6"],
      fechaLibre: "25-09-25",
    },
    {
      consultor: "Sofía Torres",
      departamento: "Marketing",
      tipoEmpleado: "Tiempo completo",
      esquema: "Presencial",
      tiempo: "40/sem",
      modulo: "HubSpot",
      nivel: "Junior",
      horas: ["8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8", "8"],
      fechaLibre: "29-09-25",
    },
  ]);

  // Función para abrir el modal y seleccionar el día
  const handleAbrirModal = (diaIdx: number) => {
    setDiaSeleccionado(diaIdx);
    setOpenModal(true);
  };

  // Función para abrir el modal desde el botón (con selección de registro)
  const handleAbrirModalDesdeBoton = () => {
    // Buscar el primer registro seleccionado
    const selectedIndex = Object.keys(rowSelection)[0];
    if (selectedIndex !== undefined) {
      setRegistroSeleccionado(tableData[parseInt(selectedIndex)]);
      setOpenModal(true);
    }
  };

  // Función para guardar el rango de horas
  const diasInfo = [
    { inicial: "Lun", fecha: "01/08/25" },
    { inicial: "Mar", fecha: "02/08/25" },
    { inicial: "Mie", fecha: "03/08/25" },
    { inicial: "Jue", fecha: "04/08/25" },
    { inicial: "Vie", fecha: "05/08/25" },
    { inicial: "Lun", fecha: "08/08/25" },
    { inicial: "Mar", fecha: "09/08/25" },
    { inicial: "Mie", fecha: "10/08/25" },
    { inicial: "Jue", fecha: "11/08/25" },
    { inicial: "Vie", fecha: "12/08/25" },
    { inicial: "Lun", fecha: "15/08/25" },
    { inicial: "Mar", fecha: "16/08/25" },
    { inicial: "Mie", fecha: "17/08/25" },
    { inicial: "Jue", fecha: "18/08/25" },
    { inicial: "Vie", fecha: "19/08/25" },
  ];

  const parseFecha = (f: string) => {
    // Espera formato dd/mm/yy o yyyy-mm-dd
    if (!f) return null;
    if (f.includes("-")) {
      // yyyy-mm-dd
      return new Date(f);
    }
    const [d, m, y] = f.split("/");
    return new Date(`20${y.length === 2 ? y : y.slice(-2)}` + `-${m}-${d}`);
  };

  const handleGuardarHoras = () => {
    if (registroSeleccionado) {
      setTableData((prev) =>
        prev.map((row) => {
          if (row === registroSeleccionado) {
            const nuevasHoras = [...row.horas];
            // Mapear fechas de columnas a índices
            const desdeDate = parseFecha(rangoHoras.desde);
            const hastaDate = parseFecha(rangoHoras.hasta);
            for (let i = 0; i < diasInfo.length; i++) {
              const colDate = parseFecha(diasInfo[i].fecha);
              if (
                desdeDate && hastaDate &&
                colDate &&
                colDate >= desdeDate &&
                colDate <= hastaDate
              ) {
                nuevasHoras[i] = `${rangoHoras.cantidad}*`;
              }
            }
            return { ...row, horas: nuevasHoras };
          }
          return row;
        })
      );
      setRegistroSeleccionado(null);
    } else if (diaSeleccionado !== null) {
      setTableData((prev) =>
        prev.map((row) => {
          const nuevasHoras = [...row.horas];
          nuevasHoras[diaSeleccionado] = `${rangoHoras.cantidad}*`;
          return { ...row, horas: nuevasHoras };
        })
      );
    }
    setOpenModal(false);
    setRangoHoras({ desde: '', hasta: '', cantidad: '' });
    setDiaSeleccionado(null);
  };

  // ---- Columnas (con grupos por semana) ----
  const columns = useMemo<MRT_ColumnDef<ProyeccionRow>[]>(() => {
    const baseCols: MRT_ColumnDef<ProyeccionRow>[] = [
      {
        accessorKey: "consultor",
        header: "Consultor",
        size: 120,
        Header: () => <TitleOnlyHeader title="Consultor" />,
      },
      {
        accessorKey: "departamento",
        header: "Departamento",
        size: 120,
        Header: () => <TitleOnlyHeader title="Departamento" />,
      },
      {
        accessorKey: "tipoEmpleado",
        header: "Tipo de empleado",
        size: 140,
        Header: () => <TitleOnlyHeader title="Tipo de empleado" />,
      },
      {
        accessorKey: "esquema",
        header: "Esquema",
        size: 120,
        Header: () => <TitleOnlyHeader title="Esquema" />,
      },
      {
        accessorKey: "tiempo",
        header: "Tiempo",
        size: 120,
        Header: () => <TitleOnlyHeader title="Tiempo" />,
      },
      {
        accessorKey: "modulo",
        header: "Módulo",
        size: 120,
        Header: () => <TitleOnlyHeader title="Módulo" />,
      },
      {
        accessorKey: "nivel",
        header: "Nivel",
        size: 120,
        Header: () => <TitleOnlyHeader title="Nivel" />,
      },
    ];

      // Utilidad para obtener inicial y fecha corta
      const diasInfo = [
        { inicial: "Lun", fecha: "01/08/25" },
        { inicial: "Mar", fecha: "02/08/25" },
        { inicial: "Mie", fecha: "03/08/25" },
        { inicial: "Jue", fecha: "04/08/25" },
        { inicial: "Vie", fecha: "05/08/25" },
        { inicial: "Lun", fecha: "08/08/25" },
        { inicial: "Mar", fecha: "09/08/25" },
        { inicial: "Mie", fecha: "10/08/25" },
        { inicial: "Jue", fecha: "11/08/25" },
        { inicial: "Vie", fecha: "12/08/25" },
        { inicial: "Lun", fecha: "15/08/25" },
        { inicial: "Mar", fecha: "16/08/25" },
        { inicial: "Mie", fecha: "17/08/25" },
        { inicial: "Jue", fecha: "18/08/25" },
        { inicial: "Vie", fecha: "19/08/25" },
      ];

    const semanaGroups: MRT_ColumnDef<ProyeccionRow>[] = semanas.map((semana, sIdx) => ({
      header: semana.nombre,
      columns: semana.dias.map((dia, dIdx) => {
        const idx = sIdx * 5 + dIdx;
        const info = diasInfo[idx];
        return {
          id: `horas_${idx}`,
          header: dia,
          size: 80,
          accessorFn: (row) => row.horas?.[idx] ?? "",
          muiTableHeadCellProps: {
            sx: {
              bgcolor: "#b6c6f7",
              color: "#222",
              fontWeight: 600,
              textAlign: "center",
            },
          },
          Header: () => (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1 }}>{info.inicial}</Typography>
              <Typography variant="caption" sx={{ fontWeight: 400, lineHeight: 1 }}>{info.fecha}</Typography>
            </Box>
          ),
          enableColumnActions: false,
          enableColumnOrdering: false,
          Cell: ({ cell, column }) => {
            const value = cell.getValue<string>();
            const idx = parseInt(column.id?.replace('horas_', '') ?? '0');
            return (
              <Box
                sx={{
                  bgcolor: value ? "#e3e8fd" : "#fff",
                  color: "#222",
                  fontWeight: 500,
                  textAlign: "center",
                  borderRadius: 2,
                  py: 2,
                  px: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 40,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  '&:hover': { bgcolor: '#d1e0fa' },
                }}
                onClick={() => handleAbrirModal(idx)}
                title="Cambiar horas"
              >
                {value}
              </Box>
            );
          },
        } as MRT_ColumnDef<ProyeccionRow>;
      }),
    }));

    const tailCol: MRT_ColumnDef<ProyeccionRow> = {
      accessorKey: "fechaLibre",
      header: "Próxima fecha libre",
      size: 160,
      muiTableHeadCellProps: {
        sx: {
          bgcolor: "#4afc7c",
          color: "#222",
          fontWeight: 700,
          textAlign: "center",
        },
      },
      Header: () => <TitleOnlyHeader title="Próxima fecha libre" />,
      Cell: ({ cell }) => (
        <Box
          sx={{
            bgcolor: "#4afc7c",
            color: "#222",
            fontWeight: 700,
            textAlign: "center",
            borderRadius: 1,
            py: 0.5,
          }}
        >
          {cell.getValue<string>()}
        </Box>
      ),
    };

    return [...baseCols, ...semanaGroups, tailCol];
  }, []);

  return (
    <Box sx={{ p: 4, bgcolor: "#f7f8fa", minHeight: "100vh" }}>
      <Typography variant="h5" sx={{ mr: "auto", mb: 2 }}>
        Proyección
      </Typography>

      <MaterialReactTable
        columns={columns.slice(0, 7).concat(columns.slice(7, 7 + vistaSemanas))}
        data={tableData}
        enableFilters={true}
        enableColumnActions={true}
        enableHiding={true}
        enableSorting={false}
        enableRowSelection
        enableColumnResizing
        enableColumnOrdering
        enablePagination
        enableDensityToggle
        enableFullScreenToggle
        muiTableContainerProps={{
          sx: { borderRadius: 3, boxShadow: "none", background: "#fff" },
        }}
        muiTableHeadCellProps={{
          sx: {
            textAlign: "center",
            fontWeight: 500,
            fontSize: 14,
            py: 0.5,
          },
        }}
        muiTableBodyCellProps={{ sx: { textAlign: "center", fontSize: 15 } }}
        onRowSelectionChange={setRowSelection}
        state={{ rowSelection }}
        initialState={{
          columnVisibility: {
            consultor: true,
            departamento: true,
            tiempo: true,
            modulo: true,
            tipoEmpleado: false,
            esquema: false,
            nivel: false,
            fechaLibre: false,
          },
          columnPinning: {
            left: ["consultor", "departamento", "tiempo", "modulo"],
          },
        }}
        renderTopToolbarCustomActions={() => (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<VisibilityIcon />}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
              onClick={() => setOpenVistaModal(true)}
            >
              Cambiar vista
            </Button>
            <Button
              variant="contained"
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 500 }}
              onClick={handleAbrirModalDesdeBoton}
              disabled={Object.keys(rowSelection).length === 0}
            >
              Cambiar horas
            </Button>
          </Box>
        )}
      />

      {/* Modal para cambiar vista */}
      {openVistaModal && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.25)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 3,
              p: 4,
              minWidth: 320,
              boxShadow: 6,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Cambiar cantidad de semanas o rango de fechas
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button
                variant={vistaTipo === 'semanas' ? 'contained' : 'outlined'}
                onClick={() => setVistaTipo('semanas')}
              >Por semanas</Button>
              <Button
                variant={vistaTipo === 'fechas' ? 'contained' : 'outlined'}
                onClick={() => setVistaTipo('fechas')}
              >Por fechas</Button>
            </Box>
            {vistaTipo === 'semanas' ? (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography>Cantidad de semanas:</Typography>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={vistaRango.desde}
                  onChange={e => setVistaRango(r => ({ ...r, desde: e.target.value }))}
                  style={{ width: 80, padding: 4 }}
                />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography>Desde:</Typography>
                <input
                  type="date"
                  value={vistaRango.desde}
                  onChange={e => setVistaRango(r => ({ ...r, desde: e.target.value }))}
                  style={{ width: 140, padding: 4 }}
                />
                <Typography>Hasta:</Typography>
                <input
                  type="date"
                  value={vistaRango.hasta}
                  onChange={e => setVistaRango(r => ({ ...r, hasta: e.target.value }))}
                  style={{ width: 140, padding: 4 }}
                />
              </Box>
            )}
            {vistaError && (
              <Typography color="error" sx={{ mt: 1 }}>{vistaError}</Typography>
            )}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleGuardarVista}>
                Guardar
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => { setOpenVistaModal(false); setVistaError(''); }}>
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {/* Modal para cambiar horas */}
      {openModal && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.25)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: 3,
              p: 4,
              minWidth: 320,
              boxShadow: 6,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              Cambiar horas
            </Typography>
            {registroSeleccionado && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2"><b>Consultor:</b> {registroSeleccionado.consultor}</Typography>
                <Typography variant="body2"><b>Departamento:</b> {registroSeleccionado.departamento}</Typography>
                <Typography variant="body2"><b>Tipo Empleado:</b> {registroSeleccionado.tipoEmpleado}</Typography>
                <Typography variant="body2"><b>Esquema:</b> {registroSeleccionado.esquema}</Typography>
                <Typography variant="body2"><b>Módulo:</b> {registroSeleccionado.modulo}</Typography>
                <Typography variant="body2"><b>Nivel:</b> {registroSeleccionado.nivel}</Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', m: 2 }}>
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
                onChange={e => setRangoHoras(r => ({ ...r, cantidad: e.target.value }))}
                style={{ width: 80, padding: 4 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleGuardarHoras}>
                Guardar
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => { setOpenModal(false); setRegistroSeleccionado(null); }}>
                Cancelar
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default ProyeccionTablePage;
