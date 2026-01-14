import { BarChart2, DollarSign, NotepadText, Percent, Presentation, Receipt, Settings, TrendingDown, TrendingUp, UserCheck, Users } from "lucide-react";
import { ReactNode } from "react";
/* Package, PackagePlus, */
export const navbarLinks = [
    {
        title: "Dashboard",
        links: [
            {
                label: "Proyección",
                icon: Presentation,
                path: "/dashboard/proyeccion",
                description: "Consulta horas por trabajador",
            },
            {
                label: "Proyectos",
                icon: NotepadText,
                path: "/dashboard/projects",
                description: "Administra el estado y avance de los proyectos.",
            },
            {
                label: "Disponibilidad",
                icon: UserCheck,
                path: "/dashboard/disponibilidad",
                description: "Consulta la disponibilidad de los trabajadores.",
            },
        ],
    },
    {
        title: "Trabajadores",
        links: [
            {
                label: "Trabajadores",
                icon: Users,
                path: "/dashboard/workers",
                description: "Consulta y gestiona la información del personal.",
            },
            {
                label: "Cargabilidad ",
                icon: UserCheck,
                path: "/dashboard/cargabilidad",
                description: "Controla la carga de trabajo del equipo.",
            },
            {
                label: "Departamento",
                icon: Users,
                path: "/dashboard/departamento",
                description: "Visualiza los distintos departamentos",
            },
            {
                label: "Esquema contractual",
                icon: UserCheck,
                path: "/dashboard/esquema-contratacion",
                description: "Administra los tipos de contratación.",
            },/*SE ELIMINA DE FORMA PROVICIONAL
            {
                label: "Especialidades",
                icon: UserCheck,
                path: "/dashboard/especialidades",
                description: "Consulta las habilidades y roles del equipo.",
            },*/
            {
                label: "Asuetos",
                icon: UserCheck,
                path: "/dashboard/asuetos",
                description: "Gestiona los días festivos y permisos de cada trabajador.",
            },
            {
                label: "Horas por aprobar",
                icon: NotepadText,
                path: "/dashboard/horas-por-aprobar",
                description: "Revisa y aprueba las horas trabajadas."
            },
            {
                label: "Lider de departamentos",
                icon: Users,
                path: "/dashboard/usuarios",
                description: "Administra accesos y perfiles de usuario.",
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
                description: "Consulta y gestiona la información de los clientes.",
            },
        ],
    },
    {
        title: "Configuracion",
        links: [
            {
                label: "Roles",
                icon: Settings,
                path: "/dashboard/settings/roles",
                description: "Define y asigna roles en la organización.",
            },
            {
                label: "Permisos",
                icon: Settings,
                path: "/dashboard/settings/permisos",
                description: "Configura niveles de acceso y seguridad a la aplicación.",
            },
            {
                label: "Configuracion",
                icon: Settings,
                path: "/settings",
                description: "Ajusta las preferencias del sistema.",
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
export const topProducts = [
    {
        number: 1,
        name: "Wireless Headphones",
        description: "High-quality noise-canceling wireless headphones.",
        price: 99.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 2,
        name: "Smartphone",
        description: "Latest 5G smartphone with excellent camera features.",
        price: 799.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 3,
        name: "Gaming Laptop",
        description: "Powerful gaming laptop with high-end graphics.",
        price: 1299.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 4,
        name: "Smartwatch",
        description: "Stylish smartwatch with fitness tracking features.",
        price: 199.99,
        status: "Out of Stock",
        rating: 4.4,
    },
    {
        number: 5,
        name: "Bluetooth Speaker",
        description: "Portable Bluetooth speaker with deep bass sound.",
        price: 59.99,
        status: "In Stock",
        rating: 4.3,
    },
    {
        number: 6,
        name: "4K Monitor",
        description: "Ultra HD 4K monitor with stunning color accuracy.",
        price: 399.99,
        status: "In Stock",
        rating: 4.6,
    },
    {
        number: 7,
        name: "Mechanical Keyboard",
        description: "Mechanical keyboard with customizable RGB lighting.",
        price: 89.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 8,
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with precision tracking.",
        price: 49.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 9,
        name: "Action Camera",
        description: "Waterproof action camera with 4K video recording.",
        price: 249.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 10,
        name: "External Hard Drive",
        description: "Portable 2TB external hard drive for data storage.",
        price: 79.99,
        status: "Out of Stock",
        rating: 4.5,
    },
];

export const recentSalesData = [
    {
        id: 1,
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        image: "",
        total: 1500,
    },
];
export const tarjetas = [
    {
        titulo: "Total Ingresos",
        valor: "$25,000",
        porcentaje: "+18%",
        icono: <DollarSign size={26} />,
        color: "green",
        tendencia: <TrendingUp size={18} />,
    },
    {
        titulo: "Total Costos",
        valor: "$16,200",
        porcentaje: "-5%",
        icono: <Receipt size={26} />,
        color: "red",
        tendencia: <TrendingDown size={18} />,
    },
    {
        titulo: "Ganancia",
        valor: "$8,800",
        porcentaje: "+12%",
        icono: <BarChart2 size={26} />,
        color: "blue",
        tendencia: <TrendingUp size={18} />,
    },
    {
        titulo: "Margen",
        valor: "35%",
        porcentaje: "+3%",
        icono: <Percent size={26} />,
        color: "yellow",
        tendencia: <TrendingUp size={18} />,
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
export interface CardResumProps {
    titulo: string;
    valor: string;
    porcentaje: string;
    icono: ReactNode;
    color: string;
}