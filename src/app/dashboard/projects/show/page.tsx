"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ContentBody } from "@/components/containers/containers";
import { Btn_data } from "@/components/buttons/buttons";
import { useProjects } from "@/hooks/useProjects";

type ProjectDetail = {
    project_id: number;
    project_name: string;
    project_code: string;
    order_int: string | number;
    project_description: string;
    status: string;
    project_type: string;
    estimated_hours: number;
    budget_amount: number;
    start_date: string;
    end_date: string;
    active: boolean;
    created_at?: string | null;
    updated_at?: string | null;
    client_id?: number | null;
    employee_id?: number | null;
    department_id?: number | null;
    client_name?: string;
    employee_name?: string;
    department_name?: string;
};

export default function Project() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || "";
    const router = useRouter();
    const { getProjectById } = useProjects();
    const [project, setProject] = useState<ProjectDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!id) { setErr("ID de proyecto inválido"); setLoading(false); return; }
            const res = await getProjectById(id);
            if (res.success && res.data) {
                setProject(res.data as ProjectDetail);
            } else {
                setErr(res.error || "Proyecto no encontrado");
            }
            setLoading(false);
        };
        load();
    }, [id, getProjectById]);

    const handleClick = () => router.push("/dashboard/projects/");

    if (loading) {
        return (
            <ContentBody title="Proyecto">
                <div className="p-6">Cargando proyecto...</div>
            </ContentBody>
        );
    }

    if (err || !project) {
        return (
            <ContentBody title="Proyecto">
                <div className="p-6 text-red-600">{err || "Proyecto no encontrado"}</div>
            </ContentBody>
        );
    }

    return (
        <ContentBody
            title={project.project_name}
            btnReg={
                <Btn_data
                    text="Regresar"
                    icon={<ArrowLeft />}
                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium hover:bg-blue-400 hover:text-white"
                    Onclick={handleClick}
                />
            }
            subtitle={project.project_code}
            contentSubtitleComponent={
                <div className="pl-4 grid grid-cols-1 md:grid-cols-3 gap-4 w-full ">
                    <div>
                        <h2>Descripción:</h2>
                        <p>{project.project_description}</p>
                    </div>
                    <div>
                        <h2>Orden interna:</h2>
                        <p>{String(project.order_int)}</p>
                    </div>
                    <div>
                        <h2>Cliente:</h2>
                        <p>{project.client_name || "—"}</p>
                    </div>
                    <div>
                        <h2>Responsable:</h2>
                        <p>{project.employee_name || "—"}</p>
                    </div>
                    <div>
                        <h2>Departamento:</h2>
                        <p>{project.department_name || "—"}</p>
                    </div>
                    <div>
                        <h2>Estado / Tipo:</h2>
                        <p>{project.status} / {project.project_type}</p>
                    </div>
                    <div>
                        <h2>Inicio:</h2>
                        <p>{project.start_date ? new Date(project.start_date).toLocaleString() : "—"}</p>
                    </div>
                    <div>
                        <h2>Fin:</h2>
                        <p>{project.end_date ? new Date(project.end_date).toLocaleString() : "—"}</p>
                    </div>
                    <div>
                        <h2>Horas estimadas / Presupuesto:</h2>
                        <p>{project.estimated_hours} h / ${project.budget_amount}</p>
                    </div>
                    <div>
                        <h2>Activo:</h2>
                        <p>{project.active ? "Sí" : "No"}</p>
                    </div>
                </div>
            }
        >
            {/* Contenido adicional (timeline, asignaciones) puede ir aquí */}
        </ContentBody>
    );
}
