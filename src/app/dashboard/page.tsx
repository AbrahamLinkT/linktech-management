"use client";
import Link from "next/link";
import { useTheme } from "@/hooks/use-theme";
import { Footer } from "@/layouts/footer";
import { navbarLinks } from "@/constants";

const DashboardPage = () => {
  const { theme } = useTheme();

  return (
    <div className="pt-0 p-6">
      <div className="flex flex-col gap-y-6">
        {navbarLinks.map((section, i) => (
          <div key={i} className="flex flex-col gap-y-4">
            {/* Título de sección */}
            {/*<h1 className="title text-lg">{section.title}</h1>*/}

            {section.title != null ? <br /> : null}

            {/* Tarjetas */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.links.map((link, j) => {
                const Icon = link.icon;
                return (
                  <div key={j} className="flex flex-col gap-2">
                    <h3 className="text-base font-semibold">{link.label}</h3>
                    <Link href={link.path}>
                      <div className="flex flex-col items-center justify-center rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md dark:bg-neutral-900 cursor-pointer">
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
        ))}

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardPage;
