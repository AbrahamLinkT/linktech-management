"use client";

import { usePathname } from "next/navigation";
import Maintenance from "./statusPages/Maintenance";

// uso temporal 
const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE === "true";

export default function GlobalWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isHome = pathname === "/";

    if (isMaintenance && !isHome) {
        return <Maintenance />;
    }

    return <>{children}</>;
}
