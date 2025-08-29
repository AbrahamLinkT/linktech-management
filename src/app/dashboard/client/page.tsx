"use client";
import { ContentBody } from "@/components/containers/containers";
import { Adduser } from "@/components/containers/modals_logic";
import { DataTable } from "@/components/tables/table_master"; // Asegúrate de tener este componente
import Clientes from "@/data/clientes.json";

export default function Client() {
    const columns = [
        //{ accessorKey: "id", header: "id", size: 150 },
        { accessorKey: "nombreCorto", header: "Nombre Corto", size: 150 },
        { accessorKey: "razonSocial", header: "Razon social", size: 250 },
        { accessorKey: "email", header: "Email", size: 200 },
        { accessorKey: "telefono", header: "Teléfono", size: 150 },
        { accessorKey: "direccion", header: "Dirección", size: 200 },
        { accessorKey: "contacto", header: "Contacto", size: 150 },
        { accessorKey: "cargo", header: "Cargo", size: 150 },
    ];

    const data = Clientes.map((p) => ({
        id: String(p.id),
        nombreCorto: p.nombre_corto,
        razonSocial: p.razon_social,
        email: p.detalles.email,
        telefono: p.detalles.telefono,
        direccion: p.detalles.direccion,
        contacto: p.detalles.contacto,
        cargo: p.detalles.cargo,
    }));

    return (
        <ContentBody title="Clientes">
            <DataTable urlRoute="/dashboard" title_add="Agregar nuevo cliente" columns={columns} data={data} ModalAdd={<Adduser />} />
        </ContentBody>
    );
}

