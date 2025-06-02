import Image from "next/image";
import Carousel from "../components/Carousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white shadow flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <Image src="/LinkLOGO.png" alt="Linktech Logo" width={48} height={48} />
          <span className="text-2xl font-bold text-blue-700 tracking-tight">Linktech</span>
        </div>
        <ul className="flex gap-8 text-gray-700 font-medium">
          <li><a href="#" className="hover:text-blue-700 transition">Inicio</a></li>
          <li><a href="#" className="hover:text-blue-700 transition">Soluciones SAP</a></li>
          <li><a href="#" className="hover:text-blue-700 transition">Nosotros</a></li>
          <li><a href="#" className="hover:text-blue-700 transition">Contacto</a></li>
        </ul>
      </nav>

      {/* Carrusel */}
      <main className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="w-full max-w-3xl">
          <Carousel />
        </div>
        <h1 className="mt-10 text-4xl font-extrabold text-blue-700 text-center">Soluciones SAP para tu empresa</h1>
        <p className="mt-4 text-lg text-gray-600 text-center max-w-2xl">
          En Linktech somos expertos en la venta, consultoría e implementación de soluciones SAP para empresas que buscan transformar y optimizar sus procesos de negocio.
        </p>
      </main>
    </div>
  );
}
