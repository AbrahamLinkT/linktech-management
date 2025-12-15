import React from 'react';
import { Card, Title, TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import ConsultantList from '@/components/consultants/ConsultantList';
import ConsultantAvailability from '@/components/consultants/ConsultantAvailability';
import ConsultantPerformance from '@/components/consultants/ConsultantPerformance';

export default function ConsultantsPage() {
  return (
    <ProtectedRoute requiredPermission="consultants">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Title className="text-2xl font-bold text-gray-900">Consultores</Title>
          <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
            Nuevo Consultor
          </button>
        </div>

        <Card className="overflow-hidden">
          <TabGroup>
            <TabList className="border-b border-gray-200">
              <Tab className="text-gray-700 hover:text-blue-700 px-6 py-3 text-sm font-medium">Lista</Tab>
              <Tab className="text-gray-700 hover:text-blue-700 px-6 py-3 text-sm font-medium">Disponibilidad</Tab>
              <Tab className="text-gray-700 hover:text-blue-700 px-6 py-3 text-sm font-medium">Rendimiento</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <div className="p-4">
                  <ConsultantList />
                </div>
              </TabPanel>
              <TabPanel>
                <div className="p-4">
                  <ConsultantAvailability />
                </div>
              </TabPanel>
              <TabPanel>
                <div className="p-4">
                  <ConsultantPerformance />
                </div>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </Card>
      </div>
    </ProtectedRoute>
  );
}