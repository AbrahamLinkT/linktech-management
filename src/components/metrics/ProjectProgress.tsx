'use client';

import React from 'react';
import { Title, BarChart } from '@tremor/react';

const data = [
  {
    name: 'Proyecto A',
    'Progreso': 75,
  },
  {
    name: 'Proyecto B',
    'Progreso': 45,
  },
  {
    name: 'Proyecto C',
    'Progreso': 90,
  },
  {
    name: 'Proyecto D',
    'Progreso': 60,
  },
];

export default function ProjectProgress() {
  return (
    <div>
      <Title>Progreso de Proyectos</Title>
      <BarChart
        className="mt-6"
        data={data}
        index="name"
        categories={['Progreso']}
        colors={['blue']}
      />
    </div>
  );
}