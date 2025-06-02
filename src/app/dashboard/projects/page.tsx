import React from 'react';
import { Card, Title, TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';
import ProjectList from '@/components/projects/ProjectList';
import ProjectBoard from '@/components/projects/ProjectBoard';
import ProjectTimeline from '@/components/projects/ProjectTimeline';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>Gestión de Proyectos</Title>
        <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
          Nuevo Proyecto
        </button>
      </div>

      <Card>
        <TabGroup>
          <TabList>
            <Tab>Lista</Tab>
            <Tab>Tablero</Tab>
            <Tab>Línea de Tiempo</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ProjectList />
            </TabPanel>
            <TabPanel>
              <ProjectBoard />
            </TabPanel>
            <TabPanel>
              <ProjectTimeline />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
}