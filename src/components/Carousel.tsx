"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  { src: "/LinkLOGO.png", alt: "Solución SAP 1" },
  { src: "/next.svg", alt: "Solución SAP 2" },
  { src: "/vercel.svg", alt: "Solución SAP 3" },
  { src: "/file.svg", alt: "Solución SAP 4" },
  { src: "/globe.svg", alt: "Solución SAP 5" },
  { src: "/window.svg", alt: "Solución SAP 6" },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-64 rounded-lg overflow-hidden shadow-lg bg-white">
      {images.map((img, idx) => (
        <div
          key={img.src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            current === idx ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image src={img.src} alt={img.alt} fill className="object-contain" />
        </div>
      ))}
      {/* Controles manuales */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full border-2 border-blue-700 ${
              current === idx ? "bg-blue-700" : "bg-white"
            }`}
            aria-label={`Ir a la imagen ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
