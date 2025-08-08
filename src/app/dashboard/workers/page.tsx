"use client";

import { ContentBody, ContentTable, ContentTrasition } from "@/components/containers/containers";
import { PanelLateral } from "@/components/modal/modals";
import React, { useState } from "react";
import staf from "@/data/staff.json";
import Modal from "@/components/Modal";
// import { Edit, Archive, Trash2 } from "lucide-react";
import NewWorker from "./new_worker/page";

// Definir el tipo para los datos de staff
interface StaffItem {
    id: string;
    consultor: string;
    especialidad: string;
    nivel: string;
    departamento: string;
    esquema: string;
    tiempo: string;
    estatus: string;
}
import { Calendario, EditorDeHoras } from "@/components/ui/calender";
import { Table_1, Table_3 } from "@/components/tables/table";
import oi from "@/data/OI_Staff.json";
import { Pencil, Search } from "lucide-react";
import { parseISO } from "date-fns";
import { Btn_data } from "@/components/buttons/buttons";

// import { useRouter } from "next/navigation"; // si usas App Router

export default function Workers() {
    const [isModalOpen, setIsModalOpen] = useState(false);/*ESTE SE USA PARA EL MODAL POP UP */
    // Estado para paginación
    const [page, setPage] = useState(1);
    const pageSize = 10;
    // Estado para el texto de búsqueda
    const [search, setSearch] = useState("");
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
    const [edith, setEdith] = useState(false);
    const [diasSeleccionadosStr, setDiasSeleccionadosStr] = useState<string[]>([]);

    const toggleModal = () => {setIsModalOpen(!isModalOpen)} //ABRIR Y CERRAR MODAL POP UP

    // Columnas y filtros de columnas
    const columnas = [
        { key: "consultor", label: "Consultor" },
        { key: "especialidad", label: "Especialidad" },
        { key: "departamento", label: "Departamento" },
        { key: "esquema", label: "Esquema" },
        { key: "estatus", label: "Status" },
    ];
    const [visibleCols, setVisibleCols] = useState<string[]>(columnas.map(c => c.key));
    const [showColFilters, setShowColFilters] = useState(false);

    // Función auxiliar para acceso seguro a propiedades
    const getStaffValue = <T extends keyof StaffItem>(item: StaffItem, key: T): string => {
        return item[key];
    };

    const handleColToggle = (key: string) => {
        setVisibleCols(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const FiltroColumnas = () => (
        <div style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "0.5rem 1rem 0.5rem 1rem",
            marginBottom: "1rem",
            background: "#fafbfc",
            display: "inline-block"
        }}>
            <div style={{ fontWeight: "bold", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Mostrar columnas:</div>
            <div style={{ display: "flex", gap: "1rem" }}>
                {columnas.map(col => (
                    <label key={col.key} style={{ display: "flex", alignItems: "center", fontSize: "0.95rem" }}>
                        <input
                            type="checkbox"
                            checked={visibleCols.includes(col.key)}
                            onChange={() => handleColToggle(col.key)}
                            style={{ marginRight: "0.3em" }}
                        />
                        {col.label}
                    </label>
                ))}
            </div>
        </div>
    );

    // Convierte a Date[] para lo que necesites
    const diasSeleccionados = diasSeleccionadosStr.map((d) => parseISO(d));
    const togglePanel = () => {
        setIsPanelOpen(!isPanelOpen);
        setEdith(false);
        setDiasSeleccionadosStr([]); // Limpia también al cerrar el panel
    };
    const handleClick = () => {
        setEdith(!edith);
    }
    // Función para limpiar y cerrar edición (cancelar)
    const handleCancelarEdicion = () => {
        setEdith(false);
        setDiasSeleccionadosStr([]);
    };
    // Función para guardar y limpiar selección (guardado)
    /*  const handleGuardarEdicion = (
         horasPorDia: { [key: string]: number },
         ordenInternaOI: string
     ) => {
         console.log("Guardar horas:", horasPorDia);
         console.log("Orden Interna:", ordenInternaOI);
 
         setEdith(false);
         setDiasSeleccionadosStr([]); // limpia días seleccionados al guardar
     }; */

// Definir el tipo para los datos de OI_Staff
interface OrdenInterna {
    OI: string;
    titulo: string;
    fechaIn: string;
    fechaFn: string;
}

interface OIStaffItem {
    id_usuario: string;
    ordenes_internas: OrdenInterna[];
}

const ordenesInternas: OrdenInterna[] = selectedWorkerId
    ? (oi as OIStaffItem[]).find(user => user.id_usuario === selectedWorkerId)?.ordenes_internas ?? []
    : [];
    // const router = useRouter()

    // const handleClickRoute = () => {
    //     router.push("/dashboard/workers/new_worker")
    // }
    // Función auxiliar para acceso seguro a propiedades

    // Filtrar trabajadores según el texto de búsqueda y columnas visibles
    const filteredStaff = (Array.isArray(staf.staff) ? staf.staff : [])
        .filter((p: StaffItem) => {
            if (!search.trim()) return true;
            // Buscar en las columnas visibles
            return columnas
                .filter(col => visibleCols.includes(col.key))
                .some(col => getStaffValue(p, col.key as keyof StaffItem).toLowerCase().includes(search.toLowerCase()));
        });

    // Calcular paginación
    const total = filteredStaff.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIdx = (page - 1) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, total);
    const paginatedStaff = filteredStaff.slice(startIdx, endIdx);

    // Cambiar de página y evitar salir de rango
    const goToPage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        setPage(newPage);
    };

    // Resetear a la primera página si cambia el filtro o búsqueda
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => { setPage(1); }, [search, visibleCols.join(","), total]);

    // const stylesInput = `
    //         w-full border border-gray-600 rounded px-3 py-1
    //         hover:border-blue-600 
    //         focus:border-blue-500 
    //         focus:ring-2 focus:ring-blue-300 
    //         focus:outline-none
    //     `;
    return (
        <>
        <Modal
              isOpen={isModalOpen}
              onConfirm={toggleModal}
              onCancel={toggleModal}
              body={
                <>
                    <NewWorker 

                    />
                </>
        
              }
              >
        
            </Modal>
            
        <ContentTrasition
            IspanelOpen={isPanelOpen ? togglePanel : undefined}
            body={
                <ContentBody title="Trabajadores">
                    <ContentTable
                        header={
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "space-between" }}>
                                <form
                                    onSubmit={e => { e.preventDefault(); }}
                                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}
                                >
                                    <input
                                        type="text"
                                        placeholder="Buscar trabajador..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="rounded-lg border border-gray-400 bg-white px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        style={{ minWidth: 180 }}
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-lg border border-gray-400 bg-gray-100 px-3 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white flex items-center"
                                        tabIndex={-1}
                                    >
                                        <Search size={18} className="mr-1" />
                                        Buscar
                                    </button>
                                </form>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowColFilters(v => !v)}
                                        className={
                                            `mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white` +
                                            (showColFilters ? ' bg-blue-100 text-blue-700' : '')
                                        }
                                    >
                                        Filtrar columnas
                                    </button>
                                    <Btn_data
                                        text={"Nuevo Trabajador"} styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                                        Onclick={toggleModal}
                                    />
                                    {showColFilters && <FiltroColumnas />}
                                </div>
                            </div>
                        }
                        Body={
                            <>
                                <Table_3
                                    headers={columnas.filter(col => visibleCols.includes(col.key)).map(col => col.label)}
                                    rows={paginatedStaff.map((p) =>
                                        columnas
                                            .filter(col => visibleCols.includes(col.key))
                                            .map(col => getStaffValue(p, col.key as keyof StaffItem))
                                    )}
                                    EventOnclick={(index) => {
                                        if (index === -1) {
                                            setSelectedWorkerId(null);
                                            setIsPanelOpen(false);
                                            setEdith(false);
                                            setDiasSeleccionadosStr([]);
                                        } else {
                                            const id = paginatedStaff[index]?.id ?? null;
                                            setSelectedWorkerId(id);
                                            setIsPanelOpen(true);
                                            setEdith(false);
                                        }
                                    }}


                                    sortable={true}
                                    selectable={true}
                                />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                                    <span className="text-sm text-gray-600">
                                        Mostrando {total === 0 ? 0 : startIdx + 1}-{endIdx} de {total}
                                    </span>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button
                                            type="button"
                                            className="rounded border border-gray-300 px-3 py-1 text-sm font-medium bg-white hover:bg-gray-100 disabled:opacity-50"
                                            onClick={() => goToPage(page - 1)}
                                            disabled={page === 1}
                                        >Anterior</button>
                                        <span className="text-sm px-2">{page} / {totalPages}</span>
                                        <button
                                            type="button"
                                            className="rounded border border-gray-300 px-3 py-1 text-sm font-medium bg-white hover:bg-gray-100 disabled:opacity-50"
                                            onClick={() => goToPage(page + 1)}
                                            disabled={page === totalPages}
                                        >Siguiente</button>
                                    </div>
                                </div>
                            </>
                        }
                    />
                </ContentBody>
            }
            panel={
                <PanelLateral
                    Open={isPanelOpen}
                    close={togglePanel}
                    title="Disponibilidad del trabajador"
                    content={
                        <div>
                            <p>El id del trabajador es: <strong>{selectedWorkerId}</strong></p>
                            <Calendario
                                modoEdicion={edith}
                                finesSeleccionables={false}
                                diasSeleccionados={diasSeleccionadosStr}
                                setDiasSeleccionados={setDiasSeleccionadosStr}
                            />
                            {!edith && (
                                <>
                                    {selectedWorkerId && (oi as OIStaffItem[]).find(user => user.id_usuario === selectedWorkerId)?.ordenes_internas?.length ? (
                                        <>
                                            <div className="flex justify-end mt-1.5 mb-3">
                                                <button
                                                    className="flex items-center gap-1 cursor-pointer border rounded px-2 py-1 bg-gray-100 text-sky-400 hover:bg-sky-500 hover:text-white"
                                                    onClick={handleClick}
                                                >
                                                    <span className="ml-1.5">Editar</span>
                                                    <Pencil />
                                                </button>
                                            </div>

                                            <div className="mt-4">
                                                <Table_1
                                                    headers={["OI", "Empresa", "Fechas"]}
                                                    rows={((oi as OIStaffItem[]).find(user => user.id_usuario === selectedWorkerId)?.ordenes_internas ?? []).map((orden) => [
                                                        orden.OI,
                                                        orden.titulo,
                                                        `${orden.fechaIn} - ${orden.fechaFn}`
                                                    ])}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <p>No hay órdenes internas para este trabajador.</p>
                                    )}
                                </>
                            )}

                            {edith && (
                                <EditorDeHoras
                                    dias={diasSeleccionados}
                                    ordenesInternas={ordenesInternas}
                                    onGuardar={() => { }} // solucionar error 
                                    onCancelar={handleCancelarEdicion}
                                />
                            )}

                        </div>
                    }
                />
            }
        /></>
    );
}

/*  return(
     <>
     <DataTable />
     </>
 ) */
