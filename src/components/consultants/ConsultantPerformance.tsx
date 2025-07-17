"use client";

import React from "react";
import { Card, Title, AreaChart } from "@tremor/react";
import { useConsultantStore } from "@/store/consultantStore";

export default function ConsultantPerformance() {
  const { consultants } = useConsultantStore();

  const performanceData = consultants
    .sort((a, b) => b.successRate - a.successRate)
    .slice(0, 10)
    .map((consultant) => ({
      name: consultant.name,
      "Tasa de Éxito": consultant.successRate,
      "Proyectos Completados": consultant.totalProjectsCompleted,

    }));

  return (
    <Card className="bg-white">
      <Title className="text-xl font-semibold text-gray-900 mb-4">
        Rendimiento de Consultores
      </Title>

      {performanceData.length > 0 ? (
        <AreaChart
          className="mt-6 h-80"
          data={performanceData}
          index="name"
          categories={["Tasa de Éxito", "Proyectos Completados"]}
          colors={["blue", "cyan"]}
          yAxisWidth={48}
          showLegend={true}
          valueFormatter={(value) =>
            `${value}${typeof value === "number" && value <= 100 ? "%" : ""}`
          }
        />
      ) : (
        <div className="text-gray-600 text-center py-8">
          No hay datos disponibles
        </div>
      )}
    </Card>
  );
}