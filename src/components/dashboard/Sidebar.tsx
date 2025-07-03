"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { href: "/dashboard", label: "Panel" },
  { href: "/dashboard/projects", label: "Gestión de Proyectos" },
  { href: "/dashboard/billing", label: "Plan de Facturación" },
  { href: "/dashboard/metrics", label: "Métricas" },
  { href: "/dashboard/consultants", label: "Consultores" },

];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white shadow-lg h-[calc(100vh-4rem)]">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block px-4 py-2 rounded-lg ${
                  pathname === item.href
                    ? "bg-blue-700 text-white"
                    : "text-gray-700 hover:bg-gray-100"

                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}