"use client";

import React, { useMemo, useState, useEffect } from "react";
import { ContentBody } from "@/components/containers/containers";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DataTable } from "@/components/tables/table_master";
import { type MRT_ColumnDef } from "material-react-table";
import { Btn_data } from "@/components/buttons/buttons";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getPendingRequests, approveRequest, rejectRequest } from "@/services/staffAssignmentService";
import { Box, Button, Modal, TextField, Typography, Alert } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

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

interface SolicitudAsignacion {
  _id: string;
  project_name: string;
  project_code: string;
  worker_name: string;
  worker_department_name: string;
  requested_by_name: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function HorasPorAprobar() {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [solicitudesAsignacion, setSolicitudesAsignacion] = useState<SolicitudAsignacion[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [errorAssignments, setErrorAssignments] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SolicitudAsignacion | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionInProgress, setActionInProgress] = useState(false);

  // Cargar solicitudes de asignación pendientes
  useEffect(() => {
    const loadPendingRequests = async () => {
      if (!isLoaded || !isSignedIn || !user?.primaryEmailAddress?.emailAddress) {
        return;
      }

      setLoadingAssignments(true);
      setErrorAssignments(null);
      try {
        const result = await getPendingRequests(user.primaryEmailAddress.emailAddress);
        setSolicitudesAsignacion(result.requests || []);
      } catch (err) {
        setErrorAssignments((err as Error).message);
        console.error("Error cargando solicitudes de asignación:", err);
      } finally {
        setLoadingAssignments(false);
      }
    };

    loadPendingRequests();
  }, [isLoaded, isSignedIn, user?.primaryEmailAddress?.emailAddress]);

  // Columnas para asignaciones
  const columnasAsignacion = useMemo<MRT_ColumnDef<SolicitudAsignacion>[]>(
    () => [
      { accessorKey: "worker_name", header: "Consultor", size: 200 },
      { accessorKey: "worker_department_name", header: "Departamento", size: 150 },
      { accessorKey: "project_name", header: "Proyecto", size: 200 },
      { accessorKey: "project_code", header: "Código Proyecto", size: 120 },
      { accessorKey: "requested_by_name", header: "Solicitado por", size: 180 },
      {
        accessorKey: "created_at",
        header: "Fecha de Solicitud",
        size: 150,
        Cell: ({ cell }) => new Date(cell.getValue() as string).toLocaleDateString("es-MX"),
      },
    ],
    []
  );

  const handleApprove = async (request: SolicitudAsignacion) => {
    setSelectedRequest(request);
    setModalOpen(true);
    setRejectionReason("");
  };

  const handleConfirmApprove = async () => {
    if (!selectedRequest || !user?.id) return;

    setActionInProgress(true);
    try {
      // 1. Aprobar la solicitud en MongoDB
      await approveRequest(selectedRequest._id, user.id);

      // 2. Crear la asignación en assigned_hours (backend Java)
      const assignmentPayload = [
        {
          project_id: selectedRequest.project_code,
          assigned_to: selectedRequest.worker_name, // O usar worker_id si está disponible
          assigned_by: user.id,
          hours_data: {
            monday: 0,
            tuesday: 0,
            wednesday: 0,
            thursday: 0,
            friday: 0,
            saturday: 0,
            sunday: 0,
            total: 0,
            week: ""
          }
        }
      ];

      // POST a assigned_hours
      const assignmentResponse = await fetch("/api/proxy/assigned-hours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignmentPayload),
      });

      if (!assignmentResponse.ok) {
        console.warn("Advertencia: Solicitud aprobada pero asignación podría no haberse creado");
      }

      // Actualizar lista localmente (remover de pending)
      setSolicitudesAsignacion((prev) =>
        prev.filter((r) => r._id !== selectedRequest._id)
      );

      alert("✅ Solicitud aprobada y consultor asignado al proyecto");
      setModalOpen(false);
      setSelectedRequest(null);
    } catch (err) {
      alert("❌ Error aprobando solicitud: " + (err as Error).message);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleReject = async (request: SolicitudAsignacion) => {
    if (!user?.id) return;

    const reason = prompt(
      "Por favor ingresa el motivo del rechazo:",
      "Sin especificar"
    );
    if (reason === null) return;

    setActionInProgress(true);
    try {
      await rejectRequest(selectedRequest?._id || request._id, user.id, reason);
      // Actualizar lista localmente
      setSolicitudesAsignacion((prev) =>
        prev.filter((r) => r._id !== request._id)
      );
      alert("✅ Solicitud rechazada");
    } catch (err) {
      alert("❌ Error rechazando solicitud: " + (err as Error).message);
    } finally {
      setActionInProgress(false);
    }
  };

  // Definir columnas para solicitudes de horas
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

  // Datos estáticos de solicitudes de horas (puedes reemplazar por fetch a futuro)
  const data: Solicitud[] = [
    {
      id: "1",
      consultor: "Diego Carranza",
      departamento: "FI",
      modulo: "FI",
      proyecto: "Proyecto A",
      fechas: "20/08/25 - 15/10/25",
      horas: "8 horas",
      solicitante: "Mario Alvarez",
    },
    {
      id: "2",
      consultor: "Esteban Gutiérrez",
      departamento: "MM",
      modulo: "MM",
      proyecto: "Proyecto B",
      fechas: "20/08/25 - 10/09/25",
      horas: "8 horas",
      solicitante: "Luis Martinez",
    },
    {
      id: "3",
      consultor: "Ana Torres",
      departamento: "FI",
      modulo: "FI",
      proyecto: "Proyecto A",
      fechas: "01/09/25 - 20/09/25",
      horas: "6 horas",
      solicitante: "Mario Alvarez",
    },
  ];

  // Agrupar por proyecto
  const proyectos = Array.from(new Set(data.map(d => d.proyecto)));

  const actions = { edit: false, add: false, export: false, delete: false, cancel: true, accept: true };
  const handleClickRoute = () => {
    router.push("/dashboard/proyeccion");
  };

  return (
    <ProtectedRoute requiredPermission="horasPorAprobar">
      <ContentBody
        title="Horas por aprobar"
        btnReg={
          <Btn_data
            icon={<ArrowLeft />}
            text={"Regresar"}
            styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
            Onclick={handleClickRoute}
          />
        }
      >
        {/* SECCIÓN: SOLICITUDES DE ASIGNACIÓN PENDIENTES */}
        <Box sx={{ marginBottom: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#2563eb", marginBottom: 2 }}>
            📋 Solicitudes de Asignación Pendientes
          </Typography>

          {loadingAssignments && (
            <Typography>Cargando solicitudes...</Typography>
          )}

          {errorAssignments && (
            <Alert severity="error">{errorAssignments}</Alert>
          )}

          {solicitudesAsignacion.length === 0 && !loadingAssignments && (
            <Alert severity="info">No tienes solicitudes de asignación pendientes</Alert>
          )}

          {solicitudesAsignacion.length > 0 && (
            <Box sx={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Consultor</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Departamento</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Proyecto</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Código</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Solicitado por</th>
                    <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Fecha</th>
                    <th style={{ padding: "12px", textAlign: "center", borderBottom: "2px solid #ddd" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudesAsignacion
                    .filter((r) => r.status === "pending")
                    .map((request) => (
                      <tr key={request._id} style={{ borderBottom: "1px solid #ddd" }}>
                        <td style={{ padding: "12px" }}>{request.worker_name}</td>
                        <td style={{ padding: "12px" }}>{request.worker_department_name}</td>
                        <td style={{ padding: "12px" }}>{request.project_name}</td>
                        <td style={{ padding: "12px" }}>{request.project_code}</td>
                        <td style={{ padding: "12px" }}>{request.requested_by_name}</td>
                        <td style={{ padding: "12px" }}>
                          {new Date(request.created_at).toLocaleDateString("es-MX")}
                        </td>
                        <td style={{ padding: "12px", textAlign: "center" }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckIcon />}
                            onClick={() => handleApprove(request)}
                            disabled={actionInProgress}
                            sx={{ marginRight: 1 }}
                          >
                            Aprobar
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<CloseIcon />}
                            onClick={() => handleReject(request)}
                            disabled={actionInProgress}
                          >
                            Rechazar
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Box>
          )}
        </Box>

        {/* SECCIÓN: SOLICITUDES DE HORAS */}
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#2563eb", marginBottom: 2 }}>
            ⏰ Solicitudes de Horas
          </Typography>
          {proyectos.map((proy) => (
            <div key={proy} style={{ marginBottom: 32 }}>
              <h2 style={{ fontWeight: 700, fontSize: 20, margin: "24px 0 12px 0", color: "#2563eb" }}>
                {proy}
              </h2>
              <DataTable<Solicitud>
                data={data.filter((d) => d.proyecto === proy)}
                columns={columns}
                menu={true}
                actions={actions}
              />
            </div>
          ))}
        </Box>

        {/* MODAL DE CONFIRMACIÓN DE APROBACIÓN */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Confirmar aprobación
            </Typography>
            <Typography sx={{ marginBottom: 3 }}>
              ¿Apruebas la asignación de <strong>{selectedRequest?.worker_name}</strong> al proyecto{" "}
              <strong>{selectedRequest?.project_name}</strong>?
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button variant="outlined" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={handleConfirmApprove}
                disabled={actionInProgress}
              >
                Confirmar
              </Button>
            </Box>
          </Box>
        </Modal>
      </ContentBody>
    </ProtectedRoute>
  );
}
