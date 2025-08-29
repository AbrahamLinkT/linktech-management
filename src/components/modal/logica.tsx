/* import Asignados from "@/data/ProyectosAsignados.json";
import Projects from "@/data/Projects.json";
import horasData from "@/data/HorasAsignadas.json";
import { Table_1 } from "@/components/tables/table";
import { ContentDialog } from "@/components/modal/modals";
import { CalendarioHoras } from "@/components/ui/calender";


type RegistroHoras = {
    consultor?: string;
    trabajador?: string;
    horas: Record<string, number>;
    dias: string[];
};

type Trabajadores = {
    [userId: string]: RegistroHoras[] | undefined;
};

type EntradaHoras = {
    OI: string;
    trabajadores: Trabajadores;
};

type HorasAsignadasType = EntradaHoras[];

// ✅ Asignamos directamente como arreglo
const HorasAsignadas: HorasAsignadasType = horasData;

export function LogicaSwtich({ id, n }: { id: string | null; n: string | null }) {
    if (!id || !n) return null;

    const asignacionesUsuario = Asignados.ProyectosAsignados.find(
        (user) => user.id_usuario === id
    );

    const ProyectosAsignados = asignacionesUsuario
        ? Projects.proyectos.filter((projecto) =>
            asignacionesUsuario.ordenes_internas.includes(projecto.ordenInterna)
        )
        : [];

    const handleClick = (orden: string) => {
        TotalHoras(id!, orden);
    };

    const renderContent = () => {
        switch (n) {
            case "proyectos":
                return (
                    <ContentDialog
                        title="Proyectos asignados"
                        text="Si deseas ver los días asignados en el proyecto, da clic sobre el proyecto seleccionado"
                    >
                        {ProyectosAsignados.length > 0 ? (
                            <Table_1
                                headers={[
                                    "Orden Interna",
                                    "Proyecto",
                                    "Estado",
                                    "Fecha Inicio",
                                    "Fecha Final",
                                    "Horas",
                                ]}
                                rows={ProyectosAsignados.map((p) => [
                                    p.ordenInterna,
                                    p.titulo,
                                    p.estatus,
                                    p.fechaIn,
                                    p.fechaFn,
                                    "40",
                                ])}
                                EventOnclick={(row) => {
                                    const ordenInterna = typeof row[0] === "string" ? row[0] : "";
                                    handleClick(ordenInterna);
                                }}
                            />
                        ) : (
                            <p>No se encontraron proyectos asignados para este usuario.</p>
                        )}
                    </ContentDialog>
                );

            case "horas":
                const registrosPorFecha: { fecha: string; horas: number; orden: string }[] = [];

                HorasAsignadas.forEach((entrada) => {
                    const usuarioHoras = entrada.trabajadores[id!];
                    if (usuarioHoras) {
                        usuarioHoras.forEach((registro) => {
                            Object.entries(registro.horas).forEach(([fecha, cantidad]) => {
                                registrosPorFecha.push({
                                    fecha,
                                    horas: cantidad,
                                    orden: entrada.OI,
                                });
                            });
                        });
                    }
                });

                registrosPorFecha.sort((a, b) => a.fecha.localeCompare(b.fecha));

                return (
                    <ContentDialog
                        title="Horas por día"
                        text="Visualiza las horas asignadas en formato calendario mensual"
                    >
                        <CalendarioHoras registros={registrosPorFecha} />
                    </ContentDialog>
                );

            default:
                return null;
        }
    };

    return renderContent();
}

function TotalHoras(id: string, Oi: string) {
    console.log("Calculando horas para:", id, Oi);
}
 */