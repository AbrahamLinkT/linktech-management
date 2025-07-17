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
import { useProjectStore } from "@/store/projectStore";
import { ProjectStatus } from "@/types/project";


export default function ProjectList() {
  const { projects, loading } = useProjectStore();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Nombre</TableHeaderCell>
          <TableHeaderCell>Estado</TableHeaderCell>
          <TableHeaderCell>Fase Actual</TableHeaderCell>
          <TableHeaderCell>Fecha Inicio</TableHeaderCell>
          <TableHeaderCell>Fecha Fin</TableHeaderCell>
          <TableHeaderCell>Presupuesto</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell>{project.name}</TableCell>
            <TableCell>
              <Badge
                color={
                  project.status === ProjectStatus.IN_PROGRESS
                    ? "blue"
                    : project.status === ProjectStatus.COMPLETED
                    ? "green"
                    : project.status === ProjectStatus.ON_HOLD
                    ? "yellow"
                    : "gray"
                }
              >
                {project.status}
              </Badge>
            </TableCell>
            <TableCell>{project.currentPhase}</TableCell>
            <TableCell>
              {new Date(project.startDate).toLocaleDateString()}
            </TableCell>
            <TableCell>
              {new Date(project.endDate).toLocaleDateString()}
            </TableCell>

            <TableCell>${project.budget.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}