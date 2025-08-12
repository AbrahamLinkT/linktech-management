"use client";
import React, { useMemo, useState, MouseEvent } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowSelectionState,
} from "material-react-table";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

const CustomTable: React.FC = () => {
  const router = useRouter();

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [tableData, setTableData] = useState<Person[]>([
    { id: 1, firstName: "Luis", lastName: "Hernández", email: "luis@mail.com" },
    { id: 2, firstName: "Ana", lastName: "Gómez", email: "ana@mail.com" },
    { id: 3, firstName: "Carlos", lastName: "Pérez", email: "carlos@mail.com" },
    { id: 4, firstName: "María", lastName: "López", email: "maria@mail.com" },
  ]);

  // Menú
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  // Modal archivar
  const [openArchiveModal, setOpenArchiveModal] = useState(false);

  const selectedIds = Object.keys(rowSelection).map(Number);
  // const selectedPerson = tableData.find((p) => p.id === selectedIds[0]);

  // Abrir/cerrar menú
  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Exportar a Excel
  const exportToExcel = () => {
    if (selectedIds.length === 0) {
      alert("Selecciona al menos un registro para exportar.");
      return;
    }
    const dataToExport = tableData.filter((p) => selectedIds.includes(p.id));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trabajadores");

    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    const blob = new Blob([wbout], { type: "application/octet-stream" });
    saveAs(blob, "trabajadores.xlsx");
  };

  // Acciones menú
  const handleMenuItemClick = (
    action: "nuevo" | "editar" | "archivar" | "eliminar" | "exportar"
  ) => {
    handleMenuClose();

    switch (action) {
      case "nuevo":
        router.push("/dashboard/tabla/new");
        break;
      case "editar":
        if (selectedIds.length !== 1) {
          alert("Selecciona exactamente un registro para editar.");
          return;
        }
        router.push(`/dashboard/edith/${selectedIds[0]}`);
        break;
      case "archivar":
        if (selectedIds.length === 0) {
          alert("Selecciona al menos un registro para archivar.");
          return;
        }
        setOpenArchiveModal(true);
        break;
      case "eliminar":
        if (selectedIds.length === 0) {
          alert("Selecciona al menos un registro para eliminar.");
          return;
        }
        if (
          confirm(
            `¿Eliminar ${selectedIds.length} registro(s)? Esta acción no se puede deshacer.`
          )
        ) {
          setTableData((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
          setRowSelection({});
        }
        break;
      case "exportar":
        exportToExcel();
        break;
    }
  };

  // Confirmar archivar
  const handleConfirmArchive = () => {
    setTableData((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
    setRowSelection({});
    setOpenArchiveModal(false);
  };

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      { accessorKey: "id", header: "ID", size: 60 },
      { accessorKey: "firstName", header: "Nombre" },
      { accessorKey: "lastName", header: "Apellido" },
      { accessorKey: "email", header: "Correo Electrónico" },
    ],
    []
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Tabla Interactiva - Material React Table
      </Typography>

      {/* Menú acciones */}
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={handleMenuClick}>
          Acciones
        </Button>
        <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
          <MenuItem onClick={() => handleMenuItemClick("nuevo")}>Nuevo</MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick("editar")}
            disabled={selectedIds.length !== 1}
          >
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick("archivar")}
            disabled={selectedIds.length === 0}
          >
            Archivar
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick("eliminar")}
            disabled={selectedIds.length === 0}
          >
            Eliminar
          </MenuItem>
          <MenuItem
            onClick={() => handleMenuItemClick("exportar")}
            disabled={selectedIds.length === 0}
          >
            Exportar a Excel
          </MenuItem>
        </Menu>
      </Box>

      {/* Modal archivar */}
      <Dialog open={openArchiveModal} onClose={() => setOpenArchiveModal(false)}>
        <DialogTitle>¿Archivar registros seleccionados?</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas archivar los registros seleccionados? Esta acción no se
            puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenArchiveModal(false)} color="inherit">
            Cancelar
          </Button>
          <Button variant="contained" color="warning" onClick={handleConfirmArchive}>
            Archivar
          </Button>
        </DialogActions>
      </Dialog>

      <MaterialReactTable<Person>
        localization={{
          actions: "Acciones",
          showHideColumns: "Mostrar/Ocultar columnas",
          showHideFilters: "Mostrar/Ocultar filtros",
          showHideSearch: "Mostrar/Ocultar búsqueda",
          search: "Buscar",
          clearSearch: "Limpiar búsqueda",
          rowNumber: "N°",
          noRecordsToDisplay: "No hay registros para mostrar",
          rowsPerPage: "Filas por página",
          columnActions: "Acciones de columna",
          filterMode: "Modo de filtro",
          filterByColumn: "Filtrar por columna",
          filterContains: "Contiene",
          filterEmpty: "Vacío",
          filterEndsWith: "Termina con",
          filterEquals: "Igual a",
          filterFuzzy: "Búsqueda difusa",
          filterGreaterThan: "Mayor que",
          filterGreaterThanOrEqualTo: "Mayor o igual que",
          filterLessThan: "Menor que",
          filterLessThanOrEqualTo: "Menor o igual que",
          filterNotEmpty: "No vacío",
          filterNotEquals: "Distinto de",
          filterStartsWith: "Empieza con",
          clearSort: "Limpiar orden",
          sortByColumnAsc: "Ordenar por {column} ascendente",
          sortByColumnDesc: "Ordenar por {column} descendente",
          clearFilter: "Limpiar filtro",
          resetColumnSize: "Restablecer tamaño de columna",
          hideColumn: "Ocultar columna",
          showAllColumns: "Mostrar todas las columnas",
          hideAll: "Ocultar todas",
          showAll: "Mostrar todas",
          resetOrder: "Restablecer orden",
          rowNumbers: "Números de fila",
          select: "Seleccionar",
        }}
        columns={columns}
        data={tableData}
        enableColumnResizing
        enableRowSelection
        enableRowNumbers
        enablePagination
        enableColumnFilterModes
        enableFacetedValues
        enableFilters
        enableHiding
        enableColumnOrdering
        enableFullScreenToggle
        enableDensityToggle
        enableColumnActions
        muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
        onRowSelectionChange={setRowSelection}
        state={{ rowSelection }}
        renderBottomToolbarCustomActions={() => (
          <Box sx={{ p: 1 }}>
            <Typography variant="body2">
              Filas seleccionadas: {Object.keys(rowSelection).length}
            </Typography>
          </Box>
        )}
      />
    </Box>
  );
};

export default CustomTable;
