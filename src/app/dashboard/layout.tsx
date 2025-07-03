"use client";

/* import { useMediaQuery } from "@uidotdev/usehooks";*/
import { useMediaQuery } from 'react-responsive'
import { ReactNode, useEffect, useRef, useState } from "react";
import { Sidebar } from "@/layouts/sidebar";
import { Header } from "@/layouts/header";

import { cn } from "@/utils/cn";

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {

    const isDesktopDevice = useMediaQuery({ query: '(min-width: 768px)' });
    const [collapsed, setCollapsed] = useState(!isDesktopDevice);

    const sidebarRef = useRef<HTMLDivElement>(null);
    
    useEffect(()=>{
        setCollapsed(!isDesktopDevice)
    },[isDesktopDevice])

    return (
        <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
            <div />
            <Sidebar 
            ref={sidebarRef}
            collapsed={collapsed} />
            <div className={cn("transition-[margin] duration-300", collapsed ? "md:ml-[70px]" : "md:ml-[240px]")}> 
                <Header collapsed={collapsed} setCollapsed={setCollapsed} />
                <div className="h-[calc(100vh-60px)] overflow-x-hidden overflow-y-auto p-6">{children}</div>
            </div>
        </div>
    );
};

export default Layout;
