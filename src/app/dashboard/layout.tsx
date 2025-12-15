"use client";

import { useMediaQuery } from "react-responsive";
import { ReactNode, useEffect, useRef, useState } from "react";
import { PermissionsProvider } from "@/contexts/permissions-context";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { cn } from "@/utils/cn";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const isDesktopDevice = useMediaQuery({ query: '(min-width: 768px)' });

    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            setCollapsed(!isDesktopDevice);
        }
    }, [isDesktopDevice, mounted]);

    if (!mounted) {
        // Evita renderizar cosas dependientes de media query en SSR
        return null;
    }

    return (
        <PermissionsProvider>
            <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
                <Sidebar ref={sidebarRef} collapsed={collapsed} />
                <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
                    <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                    <div className="h-[calc(100vh-60px)] overflow-x-hidden overflow-y-auto p-6">
                        {children}
                    </div>
                </div>
            </div>
        </PermissionsProvider>
    );
};

export default Layout;
