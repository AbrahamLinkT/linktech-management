"use client";

import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
} from "@tremor/react";
import { useConsultantStore } from "src/store/consultantStore";
import { AvailabilityStatus } from "src/types/consultant";


export default function ConsultantList() {
  const { consultants, loading } = useConsultantStore();

  if (loading) {
    return <div className="text-gray-600 text-center py-4">Cargando...</div>;
  }

  if (!consultants.length) {
    return (
      <div className="text-gray-600 text-center py-4">
        No hay consultores disponibles
      </div>
    );

  }

  return (
    <Table>
      <TableHead>
        <TableRow className="bg-gray-50">
          <TableHeaderCell className="text-gray-900 font-semibold">
            Nombre
          </TableHeaderCell>
          <TableHeaderCell className="text-gray-900 font-semibold">
            Especialización
          </TableHeaderCell>
          <TableHeaderCell className="text-gray-900 font-semibold">
            Disponibilidad
          </TableHeaderCell>
          <TableHeaderCell className="text-gray-900 font-semibold">
            Nivel
          </TableHeaderCell>
          <TableHeaderCell className="text-gray-900 font-semibold">
            Proyectos Completados
          </TableHeaderCell>
          <TableHeaderCell className="text-gray-900 font-semibold">
            Tasa de Éxito
          </TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {consultants.map((consultant) => (
          <TableRow key={consultant.id} className="hover:bg-gray-50">
            <TableCell className="font-medium text-gray-900">
              {consultant.name}
            </TableCell>
            <TableCell className="text-gray-700">
              {consultant.specialization.join(", ")}
            </TableCell>
            <TableCell>
              <Badge
                color={
                  consultant.availability === AvailabilityStatus.AVAILABLE
                    ? "green"
                    : consultant.availability ===
                      AvailabilityStatus.PARTIALLY_AVAILABLE
                    ? "yellow"
                    : "red"
                }
                className="font-medium"
              >
                {consultant.availability === AvailabilityStatus.AVAILABLE
                  ? "Disponible"
                  : consultant.availability ===
                    AvailabilityStatus.PARTIALLY_AVAILABLE
                  ? "Parcialmente Disponible"
                  : "No Disponible"}
              </Badge>
            </TableCell>
            <TableCell className="text-gray-700">
              {consultant.experienceLevel}
            </TableCell>
            <TableCell className="text-gray-700">
              {consultant.totalProjectsCompleted}
            </TableCell>
            <TableCell className="text-gray-700">
              {consultant.successRate}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}