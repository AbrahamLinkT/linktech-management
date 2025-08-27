/* 'use client';
import { useRef, useState } from "react";
import staf from "@/data/staff.json"

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
import { LogicaSwtich } from "@/components/modal/logica";
import { ContentBody, ContentTable } from "@/components/containers/containers";
import { Btn_data, Btn_list } from "@/components/buttons/buttons";
import { SearchWorkers } from "@/components/filters/filters";
import { DialogBase } from "@/components/modal/modals";
import { Table_1 } from "@/components/tables/table";

export default function DataTable() {
  // referencia al elemento del dialogo 
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectId, setSelectId] = useState<string | null>(null);

  // Estado para columnas visibles
  const columnas = [
    { key: "consultor", label: "Consultor" },
    { key: "especialidad", label: "Especialidad" },
    { key: "departamento", label: "Departamento" },
    { key: "esquema", label: "Esquema" },
    { key: "tiempo", label: "Tiempo" },
    { key: "estatus", label: "Estatus" },
  ];
  const [visibleCols, setVisibleCols] = useState<string[]>(columnas.map(c => c.key));

  // Filtro de columnas
  const handleColToggle = (key: string) => {
    setVisibleCols(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // abrur y cerrar modal 
  const handleClick = () => {
    dialogRef.current?.showModal();
  };
  const handleClose = () => {
    dialogRef.current?.close();
  };
  // mostrar el menu de opciones y capturar el valor 
  const toggleMenu = (id: string) => {
    setMenuOpenId(prev => (prev === id ? null : id));
  };

  const handleOption = (action: string, id: string) => {
    console.log(`Acción: ${action}, ID: ${id}`);
    setSelectedAction(action);       // guardar opción
    setMenuOpenId(null);             // cerrar menú
    setSelectId(id);
    handleClick();                   // abrir modal
  };

  // Estado para mostrar/ocultar el filtro de columnas
  const [showColFilters, setShowColFilters] = useState(false);

  // Renderizar checkboxes para columnas
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

  // Generar headers y rows filtrados
  const headers = columnas.filter(col => visibleCols.includes(col.key)).map(col => col.label).concat("");
  // Función auxiliar para acceso seguro a propiedades
  function getStaffValue<T extends keyof StaffItem>(item: StaffItem, key: T): string {
    return item[key];
  }

  const rows = (staf.staff as StaffItem[]).map((p) => {
    const datos = columnas
      .filter(col => visibleCols.includes(col.key))
      .map(col => getStaffValue(p, col.key as keyof StaffItem));
    return [
      ...datos,
      <>
        <Btn_data text="..." Onclick={() => toggleMenu(p.id)} />
        {menuOpenId === p.id && (
          <Btn_list
            items={[{
              text: "Horas",
              onClick: () => handleOption("horas", p.id),
            }, {
              text: "Proyectos",
              onClick: () => handleOption("proyectos", p.id),
            }]}
          />
        )}
      </>
    ];
  });

  return (
    <>
      <ContentBody title="Trabajadores">
        <ContentTable
          header={
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <SearchWorkers />
              <button
                type="button"
                onClick={() => setShowColFilters(v => !v)}
                style={{
                  padding: "0.4em 1em",
                  border: "1px solid #bbb",
                  borderRadius: "6px",
                  background: showColFilters ? "#e6f0fa" : "#f5f5f5",
                  cursor: "pointer",
                  fontWeight: 500
                }}
              >
                Filtrar columnas
              </button>
              {showColFilters && <FiltroColumnas />}
            </div>
          }
          Body={
            <Table_1
              headers={headers}
              rows={rows}
            />
          }
        />
      </ContentBody>

      <DialogBase
        close={handleClose}
        dialogRef={dialogRef}>
        <LogicaSwtich
          id={selectId}
          n={selectedAction}
        />
      </DialogBase>

    </>
  );
} */