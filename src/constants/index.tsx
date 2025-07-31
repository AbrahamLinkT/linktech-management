import { ChartColumn, Home, NotepadText, Settings, UserCheck, Users } from "lucide-react";
/* Package, PackagePlus, */
export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Inicio",
                icon: Home,
                path: "/dashboard",
            },
            {
                label: "Analisis",
                icon: ChartColumn,
                path: "",
            },
            {
                label: "Proyectos",
                icon: NotepadText,
                path: "/dashboard/projects",
            },
        ],
    },
    {
        title: "Trabajadores",
        links: [
            {
                label: "Workers",
                icon: Users,
                path: "/dashboard/workers",
            },
            /* {
                label: "Nuevo trabajador",
                icon: UserPlus,
                path: "/dashboard/new_worker",
            }, */
            /* {
                label: "Disponibilidad",
                icon: UserCheck,
                path: "/dashboard/disponibilidad",
            }, */
            {
                label: "Cargabilidad ",
                icon: UserCheck,
                path: "/dashboard/cargabilidad",
            },
            {
                label: "Departamento",
                icon: Users,
                path: "/dashboard/departamento",
            },
            {
                label: "Esquema contractual",
                icon: UserCheck,
                path: "/dashboard/esquema-contratacion",
            },
            {
                label: "Especialidades",
                icon: UserCheck,
                path: "/dashboard/especialidades",
            },
            {
                label: "Asuetos",
                icon: UserCheck,
                path: "/dashboard/asuetos",
            },
        ],
    },
    {
        title: "Clientes",
        links: [
            {
                label: "Clientes",
                icon: Users,
                path: "/dashboard/client",
            },
        ],
    },
    {
        title: "Configuracion",
        links: [
            {
                label: "Roles",
                icon: Settings,
                path: "/settings/roles",
            },
            {
                label: "Permisos",
                icon: Settings,
                path: "/settings/permisos",
            },
            {
                label: "Configuracion",
                icon: Settings,
                path: "/settings",
            },
        ],
    },
];





/* datos del personal asignado por proyecto y su estatus */
export const workersAssigentdInTheProject: WorkerAssignment[] = [];

export const assignedHoursAndDates: AssignedHours[] = [];

export interface Project {
    id: string;
    titulo: string;
    nombre: string;
    ordenInterna: string;
    cliente: string;
    departamento: string;
    descripcion: string;
    responsable: string;
    estatus: string;
    fechaIn: string;
    fechaFn: string;
}
export interface WorkerAssignment {
    id: string;
    ordenInterna: string;
    id_consultor: string;
}
export interface AssignedHours {
    id: string;
    workerAssignmentId: string;
    fecha: string;
    horas: number;
}


export const overviewData = [
    {
        name: "Jan",
        total: 1500,
    },
    {
        name: "Feb",
        total: 2000,
    },
    {
        name: "Mar",
        total: 1000,
    },
    {
        name: "Apr",
        total: 5000,
    },
    {
        name: "May",
        total: 2000,
    },
    {
        name: "Jun",
        total: 5900,
    },
    {
        name: "Jul",
        total: 2000,
    },
    {
        name: "Aug",
        total: 5500,
    },
    {
        name: "Sep",
        total: 2000,
    },
    {
        name: "Oct",
        total: 4000,
    },
    {
        name: "Nov",
        total: 1500,
    },
    {
        name: "Dec",
        total: 2500,
    },
];