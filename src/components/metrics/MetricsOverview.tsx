'use client';

import React from 'react';
import { Card, Grid, Metric, Text, Flex, ProgressBar } from '@tremor/react';

export default function MetricsOverview() {
  return (
    <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6 mb-6">
      <Card>
        <Text>Proyectos Activos</Text>
        <Metric>12</Metric>
        <Flex className="mt-4">
          <Text>Progreso General</Text>
          <Text>75%</Text>
        </Flex>
        <ProgressBar value={75} className="mt-2" />
      </Card>
      
      <Card>
        <Text>Consultores Asignados</Text>
        <Metric>24</Metric>
        <Flex className="mt-4">
          <Text>Tasa de Ocupación</Text>
          <Text>85%</Text>
        </Flex>
        <ProgressBar value={85} className="mt-2" />
      </Card>

      <Card>
        <Text>Facturación Mensual</Text>
        <Metric>$125,000</Metric>
        <Flex className="mt-4">
          <Text>Meta Mensual</Text>
          <Text>90%</Text>
        </Flex>
        <ProgressBar value={90} className="mt-2" />
      </Card>
    </Grid>
  );
}