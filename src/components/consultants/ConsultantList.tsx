'use client';

import React from 'react';
import { Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Badge } from '@tremor/react';
import { useConsultantStore } from '@/store/consultantStore';
import { AvailabilityStatus } from '@/types/consultant';

export default function ConsultantList() {
  const { consultants, loading } = useConsultantStore();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Nombre</TableHeaderCell>
          <TableHeaderCell>Especialización</TableHeaderCell>
          <TableHeaderCell>Disponibilidad</TableHeaderCell>
          <TableHeaderCell>Nivel</TableHeaderCell>
          <TableHeaderCell>Proyectos Completados</TableHeaderCell>
          <TableHeaderCell>Tasa de Éxito</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {consultants.map((consultant) => (
          <TableRow key={consultant.id}>
            <TableCell>{consultant.name}</TableCell>
            <TableCell>{consultant.specialization.join(', ')}</TableCell>
            <TableCell>
              <Badge color={
                consultant.availability === AvailabilityStatus.AVAILABLE ? 'green' :
                consultant.availability === AvailabilityStatus.PARTIALLY_AVAILABLE ? 'yellow' :
                'red'
              }>
                {consultant.availability}
              </Badge>
            </TableCell>
            <TableCell>{consultant.experienceLevel}</TableCell>
            <TableCell>{consultant.totalProjectsCompleted}</TableCell>
            <TableCell>{consultant.successRate}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}