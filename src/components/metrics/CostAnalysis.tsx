'use client';

import React from 'react';
import { Title, AreaChart } from '@tremor/react';

const data = [
  {
    date: 'Ene 2023',
    'Costo Planeado': 10000,
    'Costo Real': 12000,
  },
  {
    date: 'Feb 2023',
    'Costo Planeado': 20000,
    'Costo Real': 19000,
  },
  {
    date: 'Mar 2023',
    'Costo Planeado': 30000,
    'Costo Real': 32000,
  },
  {
    date: 'Abr 2023',
    'Costo Planeado': 40000,
    'Costo Real': 38000,
  },
];

export default function CostAnalysis() {
  return (
    <div>
      <Title>Análisis de Costos</Title>
      <AreaChart
        className="mt-6"
        data={data}
        index="date"
        categories={['Costo Planeado', 'Costo Real']}
        colors={['blue', 'red']}
      />
    </div>
  );
}