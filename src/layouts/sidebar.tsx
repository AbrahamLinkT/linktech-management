"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { navbarLinks } from "@/constants";

import logoLight from "@/assets/Linktech-light.png";
import logoDark from "@/assets/Linktech-light.png";

import { cn } from "@/utils/cn";

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ collapsed }, ref) => {
  const pathname = usePathname();

  return (
    <aside
      ref={ref}
      className={cn(
        "fixed z-100 flex h-full w-[240px] flex-col overflow-x-hidden border-r border-slate-300 bg-white [transition:width_300ms_cubic-bezier(0.4,0,0.2,1),left_300ms_cubic-bezier(0.4,0,0.2,1),background-color_150ms_cubic-bezier(0.4,0,0.2,1),border_150ms_cubic-bezier(0.4,0,0.2,1)] dark:border-slate-700 dark:bg-slate-900",
        collapsed ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        collapsed ? "max-md:-left-full" : "max-md:left-0"
      )}
    >
      <div className="flex gap-x-3 p-3">
        <img src={logoLight.src} alt="Logo" className="dark:hidden" />
        <img src={logoDark.src} alt="Logo" className="hidden dark:block" />
        {!collapsed && (
          <p className="text-lg font-medium text-slate-900 transition-colors dark:text-slate-50">
            Linktech
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3 [scrollbar-width:thin]">
        {navbarLinks.map((navbarLink) => (
          <nav
            key={navbarLink.title}
            className={cn("sidebar-group", collapsed && "md:items-center")}
          >
            <p className={cn("sidebar-group-title", collapsed && "md:w-[45px]")}>
              {navbarLink.title}
            </p>
            {navbarLink.links.map((link) => {
              const isActive = pathname === link.path;

              return (
                <Link
                  key={link.label}
                  href={link.path}
                  className={cn(
                    "flex items-center gap-x-2 rounded px-3 py-2 text-base font-medium transition-colors",
                    collapsed && "md:w-[45px]",
                    isActive
                      ? "bg-blue-500 text-white dark:bg-blue-600 dark:text-white"
                      : "text-slate-700 hover:bg-blue-100 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  )}
                >
                  <link.icon size={22} className="flex-shrink-0" />
                  {!collapsed && <p className="whitespace-nowrap">{link.label}</p>}
                </Link>

              );
            })}
          </nav>
        ))}
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";
