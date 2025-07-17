import React from 'react';
import { Card, Title, TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';
import BillingPlanList from '@/components/billing/BillingPlanList';
import BillingCalendar from '@/components/billing/BillingCalendar';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Title>Plan de Facturación</Title>
        <button className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
          Nuevo Plan
        </button>
      </div>

      <Card>
        <TabGroup>
          <TabList>
            <Tab>Lista de Planes</Tab>
            <Tab>Calendario</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <BillingPlanList />
            </TabPanel>
            <TabPanel>
              <BillingCalendar />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </Card>
    </div>
  );
}