import { ChartColumn, Home, NotepadText, Package, PackagePlus, Settings, UserCheck, UserPlus, Users } from "lucide-react";

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
                path: "/dashboard/project",
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
                label: "Product Manager",
                icon: Users,
                path: "/customers",
            },
            {
                label: "Nuevo trabajador",
                icon: UserPlus,
                path: "/new-customer",
            },
            {
                label: "Disponibilidad",
                icon: UserCheck,
                path: "/verified-customers",
            },
        ],
    },
    {
        title: "Proyectos",
        links: [
            {
                label: "Proyectos en curso",
                icon: Package,
                path: "/products",
            },
            {
                label: "Nuevo proyecto",
                icon: PackagePlus,
                path: "/new-product",
            },
        ],
    },
    {
        title: "Configuracion",
        links: [
            {
                label: "Configuracion",
                icon: Settings,
                path: "/settings",
            },
        ],
    },
];

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
