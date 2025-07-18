"use client"

import { ContentBody } from "@/components/containers/containers"
import { Table_1 } from "@/components/tables/table"

export default function Client() {
    return (

        <ContentBody
            title="Clientes"

        >
            <Table_1
                headers={["Nombre Corto", "Razon social", "Empresa"]}
                rows={[["checo peres", "4546", "salchipapas"]]}
            />
        </ContentBody>

    )
}