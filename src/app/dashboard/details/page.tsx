"use client";

import { useSearchParams } from "next/navigation";
import ProjectDescription from "@/components/projects/Description";

export default function ProjecctDetails() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    return (
        <>
            <ProjectDescription id={id ?? "1"} />
        </>
    );
}
