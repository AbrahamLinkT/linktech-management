'use client';

import React from 'react';
import { useProjectStore } from '@/store/projectStore';

export default function ProjectTimeline() {
  const { projects } = useProjectStore();

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <div key={project.id} className="relative">
          <div className="font-medium mb-2">{project.name}</div>
          <div className="flex gap-4">
            {project.phases.map((phase) => (
              <div
                key={phase.id}
                className={`p-4 rounded-lg ${
                  phase.status === 'COMPLETED' ? 'bg-green-100' :
                  phase.status === 'IN_PROGRESS' ? 'bg-blue-100' :
                  'bg-gray-100'
                }`}
              >
                <div className="text-sm font-medium">{phase.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(phase.startDate).toLocaleDateString()} - 
                  {new Date(phase.endDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}