"use client";

import { ContentBody } from "@/components/containers/containers";
import { FilterStaff } from "@/components/filters/filters";

export default function Disponibilidad() {

    return (
        <>
            <ContentBody
                title="Disponibilidad de trabajadores"
            >
                <FilterStaff showFilters={true} />

            </ContentBody>
        </>
    )
}