"use client";

import { useSearchParams } from 'next/navigation'
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
/* Importacion de componenetes propios */
import { ContentBody } from "@/components/containers/containers";
import { Btn_data } from "@/components/buttons/buttons";
/* impórtaciones de jsons */
import staffData from "@/data/staff.json"
import Image from 'next/image';
import cat from '@/assets/cat-photo-hd.png'

export default function Show() {

    // estados
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const route = useRouter();
    // ========= busqeuda de usuario ==================
    const user = staffData.staff.find((user) => user.id === id);

    const handleClick = () => {
        route.push("/dashboard/workers");
    };
    return (
        <>
            <ContentBody
                title={`Datos del trabajador`}
                btnReg={
                    <Btn_data
                        text="Regresar"
                        icon={<ArrowLeft />}
                        styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium hover:bg-blue-400 hover:text-white"
                        Onclick={handleClick}
                    />
                }
            >
                <div className="m-1 ">
                    <h2 className="text-2xl font-bold mb-6 ml-4">{user?.consultor}</h2>
                    <div className="flex items-start gap-8">
                        {/* Contenedor de la imagen alineado al inicio */}
                        <div className="w-48 h-48 flex-shrink-0 relative overflow-hidden rounded-full bg-amber-200">
                            <Image
                                src={user?.foto || cat}
                                alt={user?.consultor || ""}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Contenedor del texto */}
                        <div className="flex flex-col gap-2 pt-2">
                            <p><strong>Nombre:</strong> {user?.consultor}</p>
                            <p><strong>Correo:</strong> {user?.estatus}</p>
                            <p><strong>Teléfono:</strong> {user?.departamento}</p>
                            <p><strong>Departamento:</strong> {user?.especialidad}</p>
                            <p><strong>Departamento:</strong> {user?.esquema}</p>
                            <p><strong>Departamento:</strong> {user?.nivel}</p>
                        </div>
                    </div>
                </div>
            </ContentBody>


        </>
    );
}
