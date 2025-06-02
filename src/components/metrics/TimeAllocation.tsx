'use client';

import React from 'react';
import { Title, DonutChart } from '@tremor/react';

const data = [
  {
    name: 'Desarrollo',
    hours: 120,
  },
  {
    name: 'Pruebas',
    hours: 40,
  },
  {
    name: 'Documentación',
    hours: 30,
  },
  {
    name: 'Reuniones',
    hours: 25,
  },
];

export default function TimeAllocation() {
  return (
    <div>
      <Title>Distribución de Tiempo</Title>
      <DonutChart
        className="mt-6"
        data={data}
        category="hours"
        index="name"
        colors={['blue', 'cyan', 'indigo', 'violet']}
      />
    </div>
  );
}