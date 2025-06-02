import React from 'react';
import { Card, Title, TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';
import ConsultantList from '@/components/consultants/ConsultantList';
import ConsultantAvailability from '@/components/consultants/ConsultantAvailability';
import ConsultantPerformance from '@/components/consultants/ConsultantPerformance';

export default function ConsultantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>Consultores</Title>
        <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
          Nuevo Consultor
        </button>
      </div>

      <Card>
        <TabGroup>
          <TabList>
            <Tab>Lista</Tab>
            <Tab>Disponibilidad</Tab>
            <Tab>Rendimiento</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ConsultantList />
            </TabPanel>
            <TabPanel>
              <ConsultantAvailability />
            </TabPanel>
            <TabPanel>
              <ConsultantPerformance />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
}