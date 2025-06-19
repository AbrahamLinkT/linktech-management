import React from "react";
import { Card, Title, Grid } from "@tremor/react";
import MetricsOverview from "src/components/metrics/MetricsOverview";
import ProjectProgress from "src/components/metrics/ProjectProgress";
import CostAnalysis from "src/components/metrics/CostAnalysis";
import TimeAllocation from "src/components/metrics/TimeAllocation";


export default function MetricsPage() {
  return (
    <div className="space-y-6">
      <Title>Métricas</Title>

      <MetricsOverview />

      <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-6">
        <Card>
          <ProjectProgress />
        </Card>
        <Card>
          <CostAnalysis />
        </Card>
        <Card>
          <TimeAllocation />
        </Card>
      </Grid>
    </div>
  );
}