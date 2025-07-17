"use client";

import React from "react";
import { Card, Title } from "@tremor/react";
import { useProjectStore } from "@/store/projectStore";
import { ProjectStatus } from "@/types/project";


export default function ProjectBoard() {
  const { projects } = useProjectStore();

  const columns = Object.values(ProjectStatus);

  return (
    <div className="grid grid-cols-4 gap-4">
      {columns.map((status) => (
        <div key={status} className="space-y-4">
          <Title className="text-sm font-medium text-gray-500">{status}</Title>
          {projects
            .filter((project) => project.status === status)
            .map((project) => (
              <Card key={project.id} className="cursor-pointer hover:shadow-lg">
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Fase: {project.currentPhase}
                </p>
                <div className="mt-2 text-xs text-gray-400">
                  {new Date(project.endDate).toLocaleDateString()}
                </div>
              </Card>
            ))}
        </div>
      ))}
    </div>
  );
}