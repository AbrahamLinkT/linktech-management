import React from "react";
import { Card, Title, Grid } from "@tremor/react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import MetricsOverview from "@/components/metrics/MetricsOverview";
import ProjectProgress from "@/components/metrics/ProjectProgress";
import CostAnalysis from "@/components/metrics/CostAnalysis";
import TimeAllocation from "@/components/metrics/TimeAllocation";


export default function MetricsPage() {
  return (
    <ProtectedRoute requiredPermission="metrics">
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
    </ProtectedRoute>
  );
}