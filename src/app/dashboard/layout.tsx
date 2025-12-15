"use client";

import { useMediaQuery } from "react-responsive";
import { ReactNode, useEffect, useRef, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";
import { cn } from "@/utils/cn";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth();
    const isDesktopDevice = useMediaQuery({ query: '(min-width: 768px)' });

    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Obtener y mostrar datos de autenticación
    useEffect(() => {
        const logAuthData = async () => {
            if (isLoaded && user) {
                const token = await getToken();
                
                console.log('=== CLERK AUTHENTICATION DATA ===');
                console.log('📧 Email:', user.primaryEmailAddress?.emailAddress);
                console.log('👤 User ID:', user.id);
                console.log('👤 Full Name:', user.fullName);
                console.log('👤 First Name:', user.firstName);
                console.log('👤 Last Name:', user.lastName);
                console.log('🔑 JWT Token:', token);
                console.log('================================');
            }
        };

        logAuthData();
    }, [isLoaded, user, getToken]);

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
        <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
            <Sidebar ref={sidebarRef} collapsed={collapsed} />
            <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}>
                <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                <div className="h-[calc(100vh-60px)] overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
