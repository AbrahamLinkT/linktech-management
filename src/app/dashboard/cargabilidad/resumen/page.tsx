"use client";
import React from "react";

const semanasAgrupadas = [
  { nombre: "SEMANA 19", dias: ["05-may-25", "06-may-25", "07-may-25", "08-may-25", "09-may-25"] },
  { nombre: "SEMANA 20", dias: ["12-may-25", "13-may-25", "14-may-25", "15-may-25", "16-may-25"] },
  { nombre: "SEMANA 21", dias: ["19-may-25", "20-may-25", "21-may-25", "22-may-25", "23-may-25"] },
];
const dias = semanasAgrupadas.flatMap(s => s.dias);

// Datos de ejemplo (puedes reemplazar por fetch o import real)
const rows = [
  ["CHANTACA ZERON UBALDO", "Asimilado", "FT", 63, 63, 63, 63, 63, 63, 63, 63, 63, 63, 75, 75, 75, 75, 75],
  ["DIAZ ARREDONDO ABRAHAM", "Indeterminado", "FT", 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 125, 125, 125, 125, 125],
  ["HERNANDEZ MACIAS RAFAEL", "Asimilado", "FT", 100, 100, 100, 100, 125, 100, 100, 100, 100, 125, 100, 100, 100, 100, 125],
  ["HERRERA CHACON ERNESTO", "Indeterminado", "FT", 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 100, 100, 100, 100, 100],
  ["LOPEZ CARRANZA JESUS ALBERTO", "Asimilado", "FT", 100, 100, 113, 113, 113, 100, 100, 100, 100, 100, 75, 75, 75, 75, 75],
  ["MORAN GARCIA NAHOMI ISABELA", "Indeterminado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["PALOMARES PEREZ ANGEL HUMBERTO", "Indeterminado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["RIVERA SANCHEZ ALEJANDRO", "Asimilado", "FT", 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50],
  ["SANCHEZ RAMIREZ ADRIANA", "Indeterminado", "FT", 0, 0, 0, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38],
  ["TIRADO TIRADO JUAN DIEGO ANTONIO", "Indeterminado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 125, 125],
  ["VEGA RAMIREZ ALAN", "Indeterminado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["GOMEZ MARTINEZ YAYOY MONSERRAT", "Asimilado", "FT", 119, 119, 119, 119, 119, 119, 119, 119, 119, 119, 106, 106, 106, 106, 106],
  ["OLIVARES DE LA TORRE JULIO CESAR", "Asimilado", "FT", 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75, 75],
  ["MOLINAR GONZALEZ FERNANDO ADRIAN", "Asimilado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["CARREON QUIÑONES CARLOS ALBERTO", "Asimilado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["AQUINO ALVARADO DAVID", "Asimilado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["ALMAGUER SOTO RIGOBERTO", "Asimilado", "FT", 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150, 150],
  ["FERNANDEZ RECIO SANTIAGO", "Indeterminado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["AVENDAÑO ZEBADUA RAFAEL", "Asimilado", "FT", 78, 78, 78, 78, 103, 40, 40, 40, 40, 65, 40, 40, 40, 40, 65],
  ["MARTINEZ OJEDA GILBERTO DANIEL", "Asimilado", "FT", 100, 100, 100, 100, 125, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["GRANADOS SANTIAGO JUAN", "Asimilado", "FT", 90, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65],
  ["PAZ CHAVEZ JUAN CARLOS", "Asimilado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["MUGARTE LOPEZ ADAD OLIVIER", "Asimilado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["BELLO RUIZ GUSTAVO", "Asimilado", "FT", 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["COVARRUBIAS CLAUSEN JOSE LUIS", "Asimilado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 50, 50, 50, 50, 50],
  ["DOMINGUEZ ALCOCER ABRAHAM SALVADOR", "Indeterminado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["DIAZ PEÑALOZA SERGIO YVAN", "Asimilado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["PIÑA ALBARRAN ERICK IRVING", "Asimilado", "FT", 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
  ["RAMIREZ MONROY MARTIN", "Asimilado", "FT", 0, 0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
];

import { useRouter } from "next/navigation";

export default function ResumenCargabilidad() {
  const router = useRouter();
  return (
    <div className="relative p-6">
      {/* Encabezado y botón en disposición horizontal, fondo gris claro */}
      <div className="sticky top-0 left-0 z-20 bg-gray-100 flex items-center mb-6" style={{ minHeight: '3.5rem' }}>
        <h2 className="text-2xl font-bold">Resumen de Cargabilidad</h2>
        <button
          className="absolute right-6 top-6 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200"
          style={{ zIndex: 30 }}
          onClick={() => router.push('/dashboard/cargabilidad')}
        >
          ← Regresar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-max w-full border border-gray-300 text-xs md:text-sm">
          <thead>
            {/* Fila de semanas */}
            <tr className="bg-blue-200">
              <th className="border px-2 py-1" colSpan={3}></th>
              {semanasAgrupadas.map((semana, idx) => (
                <th key={idx} className="border px-2 py-1 text-center font-bold" colSpan={semana.dias.length}>{semana.nombre}</th>
              ))}
            </tr>
            {/* Fila de días */}
            <tr className="bg-blue-100">
              <th className="border px-2 py-1">Consultor</th>
              <th className="border px-2 py-1">Esquema</th>
              <th className="border px-2 py-1">Tiempo</th>
              {dias.map((dia, idx) => (
                <th key={idx} className="border px-2 py-1">{dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border px-2 py-1 font-semibold whitespace-nowrap">{row[0]}</td>
                <td className="border px-2 py-1 whitespace-nowrap">{row[1]}</td>
                <td className="border px-2 py-1 whitespace-nowrap">{row[2]}</td>
                {row.slice(3).map((val, j) => {
                  const numVal = typeof val === 'string' ? parseFloat(val) : val;
                  let bg = 'bg-green-100';
                  if (numVal === 0) bg = 'bg-red-100';
                  else if (numVal > 100) bg = 'bg-yellow-100';
                  return (
                    <td key={j} className={`border px-2 py-1 text-center ${bg}`}>{numVal}%</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
