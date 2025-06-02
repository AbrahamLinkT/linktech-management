import Image from "next/image";
import Carousel from "../components/Carousel";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <Image src="/LinkLOGO.png" alt="Linktech Logo" width={300} height={300} priority />
            </div>
            <button className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
              Iniciar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Carrusel */}
      <main className="flex-1 flex flex-col items-center justify-start py-10">
        <div className="w-full max-w-6xl px-4">
          <Carousel />
          
          <h1 className="mt-10 text-4xl font-extrabold text-blue-700 text-center">Soluciones SAP para tu empresa</h1>
          <p className="mt-4 text-lg text-gray-600 text-center max-w-3xl mx-auto mb-16">
            En Linktech somos expertos en la venta, consultoría e implementación de soluciones SAP para empresas que buscan transformar y optimizar sus procesos de negocio.
          </p>

          {/* Three Columns Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Column 1 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Cloud Service</h2>
              <p className="text-gray-600">
                Servicios Basis y con la basta infraestructura de Huawei, hemos creado Link Cloud Service.
                Potencia y capacidad de cómputo para bases de datos, almacenamiento, aplicaciones y otros recursos de TI.
              </p>
            </div>

            {/* Column 2 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Reportes Inteligentes</h2>
              <p className="text-gray-600">
                La nueva era del reporteo Inteligente con SAP Analytics Cloud SAC, plataforma de Inteligencia empresarial (BI) 
                de software como servicios (SaaS). Capacidades analíticas a todos los usuarios en un solo producto para todo tipo de ERP.
              </p>
            </div>

            {/* Column 3 */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-blue-700 mb-4">Refiere y ¡GANA!</h2>
              <p className="text-gray-600">
                Refiere los proyectos de tus amigos o colegas relacionados con la implementación del ERP, 
                soluciones o servicios de Soporte SAP. ¡Recibirás grandes recompensas!
              </p>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-16">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Dos décadas Innovando</h2>
            <p className="text-gray-600 mb-6">
              Implementación, Soporte y consultoría para el ciclo de vida SAP. Nuestros Servicios de Soporte, 
              para necesidades de mejora o nueva funcionalidad, integrándose al equipo del cliente con visibilidad completa.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-3">Oferta Linktech</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Migración a SAP S/4HANA</li>
                  <li>SAP Analytics Cloud SAC</li>
                  <li>SAP BPC</li>
                  <li>SuccessFactors</li>
                  <li>C/4HANA</li>
                  <li>Soluciones Fiscales</li>
                  <li>Document Compliance</li>
                  <li>Localización, MX, US & LATAM</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-3">Servicios de Soporte</h3>
                <p className="text-gray-600 mb-4">
                  Brindamos soporte remoto funcional y técnico para cubrir necesidades de 1er, 2o y 3er nivel de tu ambiente SAP.
                  Contamos con la certificación SAP PCoE, esto avala la calidad de nuestros servicios.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Soporte Funcional</li>
                  <li>Soporte Basis</li>
                  <li>SAP BPC</li>
                  <li>Staff Augmentation</li>
                  <li>Contenido para Capacitación</li>
                  <li>Fábrica de Software</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Contacto</h3>
              <p className="mb-2">¿Necesita ayuda?</p>
              <p className="mb-2">📞 81 4165 5465</p>
              <p>📧 dc.operations@linktech.com.mx</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Ubicaciones</h3>
              <ul className="space-y-2">
                <li>Monterrey</li>
                <li>CDMX</li>
                <li>Guadalajara</li>
                <li>Dallas Texas, US</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Servicios</h3>
              <ul className="space-y-2">
                <li>Cloud Service</li>
                <li>Reportes Inteligentes</li>
                <li>Soporte SAP</li>
                <li>Consultoría</li>
              </ul>
            </div>
            <div>
              <Image src="/LinkLOGO.png" alt="Linktech Logo" width={120} height={120} className="mb-4" />
              <p className="text-sm">Link Technologies - SAPI d.c. v.</p>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center">
            <p>&copy; {new Date().getFullYear()} Link Technologies - SAPI d.c. v. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}