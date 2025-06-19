"use client";

import React from "react";
import { Card, Title, BarChart } from "@tremor/react";
import { useConsultantStore } from "src/store/consultantStore";
import { AvailabilityStatus } from "src/types/consultant";


export default function ConsultantAvailability() {
  const { consultants } = useConsultantStore();

  const availabilityData = [
    {
      status: "Disponible",
      count: consultants.filter(
        (c) => c.availability === AvailabilityStatus.AVAILABLE
      ).length,
    },
    {
      status: "Parcialmente Disponible",
      count: consultants.filter(
        (c) => c.availability === AvailabilityStatus.PARTIALLY_AVAILABLE
      ).length,
    },
    {
      status: "No Disponible",
      count: consultants.filter(
        (c) => c.availability === AvailabilityStatus.UNAVAILABLE
      ).length,
    },

  ];

  return (
    <Card className="bg-white">
      <Title className="text-xl font-semibold text-gray-900 mb-4">
        Disponibilidad de Consultores
      </Title>
      {availabilityData.some((d) => d.count > 0) ? (

        <BarChart
          className="mt-6 h-80"
          data={availabilityData}
          index="status"
          categories={["count"]}
          colors={["blue"]}
          yAxisWidth={48}
          showLegend={false}
        />
      ) : (
        <div className="text-gray-600 text-center py-8">
          No hay datos disponibles
        </div>
      )}
    </Card>
  );
}

