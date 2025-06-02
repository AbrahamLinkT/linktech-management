'use client';

import React from 'react';
import { Card, Title, BarChart } from '@tremor/react';
import { useConsultantStore } from '@/store/consultantStore';
import { AvailabilityStatus } from '@/types/consultant';

export default function ConsultantAvailability() {
  const { consultants } = useConsultantStore();

  const availabilityData = [
    {
      status: 'Disponible',
      count: consultants.filter(c => c.availability === AvailabilityStatus.AVAILABLE).length
    },
    {
      status: 'Parcialmente Disponible',
      count: consultants.filter(c => c.availability === AvailabilityStatus.PARTIALLY_AVAILABLE).length
    },
    {
      status: 'No Disponible',
      count: consultants.filter(c => c.availability === AvailabilityStatus.UNAVAILABLE).length
    }
  ];

  return (
    <Card>
      <Title>Disponibilidad de Consultores</Title>
      <BarChart
        className="mt-6"
        data={availabilityData}
        index="status"
        categories={["count"]}
        colors={["blue"]}
        yAxisWidth={48}
      />
    </Card>
  );
}