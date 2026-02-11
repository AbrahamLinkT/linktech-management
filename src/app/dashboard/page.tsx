"use client";
import Link from "next/link";
import { Footer } from "@/layouts/footer";
import { navbarLinks } from "@/constants";
import { usePermissions } from "@/contexts/permissions-context";

const DashboardPage = () => {
  const { hasPermission, role, loading } = usePermissions();

  if (loading) {
    return (
      <div className="pt-0 p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando permisos...</p>
        </div>
      </div>
    );
  }

  // Filtrar las secciones y links según permisos
  const filteredSections = navbarLinks
    .map((section) => ({
      ...section,
      links: section.links.filter((link) => {
        // Si no tiene permission definido (como Configuración), siempre mostrar
        if (!link.permission) return true;
        
        // Si es admin, mostrar todo
        if (role === 'admin') return true;
        
        // Si es lider, mostrar todo excepto usuarios
        if (role === 'lider' && link.permission !== 'usuarios') return true;
        
        // Para otros roles, verificar permiso específico
        return hasPermission(link.permission);
      }),
    }))
    .filter((section) => section.links.length > 0); // Eliminar secciones vacías

  return (
    <div className="pt-0 p-6">
      <div className="flex flex-col gap-y-6">
        {filteredSections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">No tienes permisos asignados</p>
            <p className="text-gray-400 text-sm">Contacta al administrador para obtener acceso a los módulos.</p>
          </div>
        ) : (
          filteredSections.map((section, i) => (
            <div key={i} className="flex flex-col gap-y-4">
              {/* Título de sección */}
              {section.title != null && <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{section.title}</h2>}

              {/* Tarjetas */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.links.map((link, j) => {
                  const Icon = link.icon;
                  return (
                    <div key={j} className="flex flex-col gap-2">
                      <h3 className="text-base font-semibold">{link.label}</h3>
                      <Link href={link.path} aria-label={link.label}>
                        {/* Fixed height card and ensure description placeholder when missing */}
                        <div className="flex flex-col items-center justify-between rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md dark:bg-neutral-900 cursor-pointer h-30">
                          <div className="mb-3 text-blue-500 dark:text-blue-400">
                            <Icon size={32} />
                          </div>
                          <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                            {link.description}
                          </p>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardPage;
