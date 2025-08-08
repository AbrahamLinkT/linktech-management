"use client";
import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_RowSelectionState,
} from "material-react-table";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

// 1. Define la interfaz para los datos
type Person = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

const CustomTable: React.FC = () => {
  // 2. Estado para selección de filas
  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});
  const [openModal, setOpenModal] = useState(false);
  const [tableData, setTableData] = useState<Person[]>([
    { id: 1, firstName: "Luis", lastName: "Hernández", email: "luis@mail.com" },
    { id: 2, firstName: "Ana", lastName: "Gómez", email: "ana@mail.com" },
    { id: 3, firstName: "Carlos", lastName: "Pérez", email: "carlos@mail.com" },
    { id: 4, firstName: "María", lastName: "López", email: "maria@mail.com" },
  ]);

  // 3. Definición de columnas tipadas
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 60,
      },
      {
        accessorKey: "firstName",
        header: "Nombre",
      },
      {
        accessorKey: "lastName",
        header: "Apellido",
      },
      {
        accessorKey: "email",
        header: "Correo Electrónico",
      },
    ],
    []
  );

  // IDs seleccionados
  const selectedIds = Object.keys(rowSelection).map(Number);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Tabla Interactiva - Material React Table
      </Typography>

      {/* Botones de acciones */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button variant="contained" color="primary">Nuevo</Button>
        <Button variant="contained" color="info">Editar</Button>
        <Button
          variant="contained"
          color="warning"
          disabled={selectedIds.length === 0}
          onClick={() => setOpenModal(true)}
        >
          Archivar
        </Button>
      </Box>

      {/* Modal de confirmación */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>¿Archivar registros seleccionados?</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que deseas archivar los registros seleccionados? Esta acción no se puede deshacer.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="inherit">Cancelar</Button>
          <Button
            onClick={() => {
              setTableData(prev => prev.filter(row => !selectedIds.includes(row.id)));
              setRowSelection({});
              setOpenModal(false);
            }}
            color="warning"
            variant="contained"
          >
            Archivar
          </Button>
        </DialogActions>
      </Dialog>

      <MaterialReactTable<Person>
        localization={{
          actions: 'Acciones',
          showHideColumns: 'Mostrar/Ocultar columnas',
          showHideFilters: 'Mostrar/Ocultar filtros',
          showHideSearch: 'Mostrar/Ocultar búsqueda',
          search: 'Buscar',
          clearSearch: 'Limpiar búsqueda',
          rowNumber: 'N°',
          noRecordsToDisplay: 'No hay registros para mostrar',
          rowsPerPage: 'Filas por página',
          columnActions: 'Acciones de columna',
          filterMode: 'Modo de filtro',
          filterByColumn: 'Filtrar por columna',
          // Traducción de opciones de filtro
          filterContains: 'Contiene',
          filterEmpty: 'Vacío',
          filterEndsWith: 'Termina con',
          filterEquals: 'Igual a',
          filterFuzzy: 'Búsqueda difusa',
          filterGreaterThan: 'Mayor que',
          filterGreaterThanOrEqualTo: 'Mayor o igual que',
          filterLessThan: 'Menor que',
          filterLessThanOrEqualTo: 'Menor o igual que',
          filterNotEmpty: 'No vacío',
          filterNotEquals: 'Distinto de',
          filterStartsWith: 'Empieza con',
          // Traducción de menú contextual
          clearSort: 'Limpiar orden',
          sortByColumnAsc: 'Ordenar por {column} ascendente',
          sortByColumnDesc: 'Ordenar por {column} descendente',
          clearFilter: 'Limpiar filtro',
          resetColumnSize: 'Restablecer tamaño de columna',
          hideColumn: 'Ocultar columna',
          showAllColumns: 'Mostrar todas las columnas',
          hideAll: 'Ocultar todas',
          showAll: 'Mostrar todas',
          resetOrder: 'Restablecer orden',
          rowNumbers: 'Números de fila',
          select: 'Seleccionar',
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
