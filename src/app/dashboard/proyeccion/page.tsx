"use client";

import { ContentBody } from "@/components/containers/containers";
import { DataTable } from "@/components/tables/table_master";
import { MRT_ColumnDef } from "material-react-table";
import { useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Button, IconButton, TextField, Typography, Autocomplete } from "@mui/material";
import { useRouter } from "next/navigation";


// =================== TIPOS ===================
type RowData = {
  id: string;
  consultor: string;
  departamento: string;
  tipoEmpleado: string;
  esquema: string;
  tiempo: string;
  modulo: string;
  nivel: string;
  ubicacion: string;
  proyecto: string;
};

// =================== MOCK DATA ===================
const initialData: RowData[] = [
  {
    id: "1",
    consultor: "Ana López",
    departamento: "SAP FI",
    tipoEmpleado: "Interno",
    esquema: "Full-time",
    tiempo: "40",
    modulo: "FI",
    nivel: "Sr",
    ubicacion: "Monterrey",
    proyecto: "Implementación SAP FI – ACME",
  },
  {
    id: "2",
    consultor: "Luis Pérez",
    departamento: "SAP MM",
    tipoEmpleado: "Externo",
    esquema: "Part-time",
    tiempo: "20",
    modulo: "MM",
    nivel: "Jr",
    ubicacion: "CDMX",
    proyecto: "Optimización MM – RetailMX",
  },
  {
    id: "3",
    consultor: "María Gómez",
    departamento: "SAP HCM",
    tipoEmpleado: "Interno",
    esquema: "Full-time",
    tiempo: "40",
    modulo: "HCM",
    nivel: "Sr",
    ubicacion: "Guadalajara",
    proyecto: "Proyecto HCM – UANL",
  },
  {
    id: "4",
    consultor: "Carlos Ruiz",
    departamento: "SAP FI",
    tipoEmpleado: "Externo",
    esquema: "Part-time",
    tiempo: "20",
    modulo: "FI",
    nivel: "Jr",
    ubicacion: "CDMX",
    proyecto: "Implementación SAP FI – ACME",
  },
  {
    id: "5",
    consultor: "Ana Torres",
    departamento: "SAP MM",
    tipoEmpleado: "Interno",
    esquema: "Full-time",
    tiempo: "40",
    modulo: "MM",
    nivel: "Sr",
    ubicacion: "Monterrey",
    proyecto: "Optimización MM – RetailMX",
  },
];

// OIs y proyectos eliminados

// =================== COMPONENTE ===================
export default function ProyeccionPage() {
  // ------------------- STATE ------------------
  const [selectedModalRows, setSelectedModalRows] = useState<Record<number, boolean>>({});
  // const [selectedIO, setSelectedIO] = useState<string>("");
  // Estado para filtro de fechas en la modal
  const [modalDesde, setModalDesde] = useState<string>("");
  const [modalHasta, setModalHasta] = useState<string>("");
  //const [tableData, setTableData] = useState<RowData[]>(initialData);

  // ------------------- ROUTE -----------------
  const router = useRouter();

  // -------------------  Toolbar: OI/Proyecto y botones -----------------
  // const uniqueIOs = OI_OPTIONS;
  // const selectedProyecto = selectedIO ? PROYECTO_BY_OI[selectedIO] ?? "" : "";

  // ------------------- TABLE -----------------
  const [data] = useState<RowData[]>(initialData);
  // importacion de tablas de la cabecera
  const columns = useMemo<MRT_ColumnDef<RowData>[]>(
    () => [
      { accessorKey: "consultor", header: "Consultor" },
      { accessorKey: "departamento", header: "Departamento" },
      { accessorKey: "tipoEmpleado", header: "Tipo Empleado" },
      { accessorKey: "esquema", header: "Esquema" },
      { accessorKey: "tiempo", header: "Horas/Sem" },
      { accessorKey: "modulo", header: "Módulo" },
      { accessorKey: "nivel", header: "Nivel" },
      { accessorKey: "ubicacion", header: "Ubicación" },
    ],
    []
  );

  const actions = { add: true, export: true, delete: true }
  // ------------------- LOGICA DE MODAL ------------------
  const handleSelectModalRow = (idx: number) => {
    setSelectedModalRows((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };
  /*  const handleAgregarSeleccionados = () => {
     const nuevos = Object.entries(selectedModalRows)
       .filter(([, v]) => v)
       .map(([idx]) => {
         const r = modalRows[Number(idx)];
         return {
           id: String(Date.now() + Math.random()),
           consultor: r.nombre,
           departamento: r.departamento,
           tipoEmpleado: "Externo",
           esquema: "Full-time",
           tiempo: "40",
           modulo: r.especialidad.includes("FI") ? "FI" : "MM",
           nivel: r.nivel,
           ubicacion: "Remoto",
         } as RowData;
       });
 
     setTableData((prev) => [...prev, ...nuevos]);
     setSelectedModalRows({});
   }; */
  // ------------------- MODAL -------------------
  type ModalRow = {
    nombre: string;
    especialidad: string;
    nivel: string;
    departamento: string;
    fecha?: string; // Fecha tentativa de liberación
  };
  // Agrega un campo de fecha ficticio para ejemplo
  const [modalRows] = useState<ModalRow[]>([
    {
      nombre: "María Gómez",
      especialidad: "SAP FI",
      nivel: "Sr",
      departamento: "Finanzas",
      fecha: "2024-06-01",
    },
    {
      nombre: "Carlos Ruiz",
      especialidad: "SAP MM",
      nivel: "Mid",
      departamento: "Abastecimiento",
      fecha: "2024-06-10",
    },
    {
      nombre: "Ana Torres",
      especialidad: "SAP HCM",
      nivel: "Jr",
      departamento: "Recursos Humanos",
      fecha: "2024-06-15",
    },
  ]);

  // Filtrado por rango de fechas
  const filteredModalRows = modalRows.filter((row) => {
    if (!modalDesde && !modalHasta) return true;
    if (!row.fecha) return false;
    const rowDate = new Date(row.fecha);
    if (modalDesde) {
      const desdeDate = new Date(modalDesde);
      if (rowDate < desdeDate) return false;
    }
    if (modalHasta) {
      const hastaDate = new Date(modalHasta);
      if (rowDate > hastaDate) return false;
    }
    return true;
  });
  // Estado para búsqueda dinámica de proyecto
  const [projectSearch, setProjectSearch] = useState("");
  return (
    <>
      <ContentBody
        title="Proyección"
        ContentBtn={
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Autocomplete
              freeSolo
              options={Array.from(new Set(data.map(row => row.proyecto).filter(Boolean)))}
              value={projectSearch}
              onInputChange={(_, newValue) => setProjectSearch(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Buscar proyecto" variant="outlined" size="small" sx={{ minWidth: 240 }} />
              )}
            />
            <Typography sx={{ ml: 3, fontWeight: 600, color: '#222', fontSize: 20 }}>
              {projectSearch && data.some(row => row.proyecto === projectSearch)
                ? `Proyecto: ${projectSearch}`
                : ""}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, ml: 'auto' }}>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
                onClick={() => router.push("/dashboard/solicitud_horas")}
              >
                Solicitud de Horas (2)
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
                onClick={() => router.push("/dashboard/proyeccion/date")}
              >
                Ver proyección
              </Button>
            </Box>
          </Box>
        }
      >
        {/* Ya no se muestra el nombre de proyecto arriba, ahora va a la derecha del buscador */}
        <DataTable
          columns={columns}
          data={projectSearch
            ? data.filter(row => {
                const proyecto = (row as { proyecto?: string }).proyecto || "";
                return proyecto.toLowerCase().includes(projectSearch.toLowerCase());
              })
            : data}
          menu={true}
          actions={actions}

          ModalAdd={
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, py: 2 }}>
              {/* Filtros de búsqueda */}
              {/* Búsqueda por nombre, especialidad y nivel */}
              {[
                { label: "Nombre", placeholder: "Buscar por nombre" },
                { label: "Especialidad", placeholder: "Buscar por especialidad" },
                { label: "Nivel", placeholder: "Buscar por nivel" },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  <Box
                    sx={{
                      minWidth: 120,
                      bgcolor: "#f7f4fa",
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textAlign: "right",
                    }}
                  >
                    <Typography sx={{ fontWeight: 500, color: "#444" }}>
                      {item.label}:
                    </Typography>
                  </Box>
                  <TextField
                    placeholder={item.placeholder}
                    variant="outlined"
                    size="medium"
                    fullWidth
                    sx={{
                      bgcolor: "#ede9f6",
                      borderRadius: 2,
                      ".MuiOutlinedInput-root": {
                        borderRadius: 2,
                        height: 48,
                        fontSize: 16,
                        color: "#3c3842",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <Box sx={{ pr: 1 }}>
                          <IconButton edge="end" sx={{ color: "#3c3842" }}>
                            <SearchIcon />
                          </IconButton>
                        </Box>
                      ),
                    }}
                  />
                </Box>
              ))}

              {/* Filtros de fecha: Desde y Hasta */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Desde"
                  type="date"
                  value={modalDesde}
                  onChange={e => setModalDesde(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 180 }}
                />
                <TextField
                  label="Hasta"
                  type="date"
                  value={modalHasta}
                  onChange={e => setModalHasta(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 180 }}
                />
              </Box>

              {/* Resultados de ejemplo */}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SearchIcon />}
                >
                  BUSCAR
                </Button>
              </Box>

              <Box sx={{ mt: 2 }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "separate",
                    borderSpacing: "0 8px",
                    background: "#fff",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15, background: '#f7f4fa' }}>
                        Nombre
                      </th>
                      <th style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15, background: '#f7f4fa' }}>
                        Especialidad
                      </th>
                      <th style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15, background: '#f7f4fa' }}>
                        Nivel
                      </th>
                      <th style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15, background: '#f7f4fa' }}>
                        Departamento
                      </th>
                      <th style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15, background: '#f7f4fa' }}>
                        Fecha tentativa de liberación
                      </th>
                      <th
                        style={{
                          border: "1px solid #aaa",
                          padding: '10px 8px',
                          textAlign: "center",
                          fontSize: 15,
                          background: '#f7f4fa'
                        }}
                      >
                        Seleccionar
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredModalRows.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15 }}>
                          {row.nombre}
                        </td>
                        <td style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15 }}>
                          {row.especialidad}
                        </td>
                        <td style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15 }}>
                          {row.nivel}
                        </td>
                        <td style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15 }}>
                          {row.departamento}
                        </td>
                        <td style={{ border: "1px solid #aaa", padding: '10px 8px', fontSize: 15 }}>
                          {row.fecha ? new Date(row.fecha).toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '—'}
                        </td>
                        <td
                          style={{
                            border: "1px solid #aaa",
                            padding: '10px 8px',
                            textAlign: "center",
                            fontSize: 15
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={!!selectedModalRows[idx]}
                            onChange={() => handleSelectModalRow(idx)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                  //onClick={handleAgregarSeleccionados}
                  >
                    Agregar
                  </Button>
                </Box>
              </Box>
            </Box>
          }
          title_add="Agregar consultor"
        />
      </ContentBody>
    </>
  )
}