'use client';

import React from 'react';
import { Card, Title, AreaChart } from '@tremor/react';
import { useConsultantStore } from '@/store/consultantStore';

export default function ConsultantPerformance() {
  const { consultants } = useConsultantStore();

  const performanceData = consultants
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, 10)
    .map(consultant => ({
      name: consultant.name,
      'Tasa de Éxito': consultant.successRate,
      'Proyectos Completados': consultant.totalProjectsCompleted
    }));

  return (
    <Card>
      <Title>Rendimiento de Consultores</Title>
      <AreaChart
        className="mt-6"
        data={performanceData}
        index="name"
        categories={['Tasa de Éxito', 'Proyectos Completados']}
        colors={['blue', 'cyan']}
        yAxisWidth={48}
      />
    </Card>
  );
}