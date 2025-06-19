// pages/api/guardar-horas.ts
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";


 /* dat seguimiento a esta parte de post */
const DATA_PATH = path.join(process.cwd(), "src/data/HorasAsignadas.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    try {
        const { workerId, ordenInterna, horasPorDia, diasSeleccionados } = req.body;

        let fileData = { OI: [] };

        // Cargar JSON existente si existe
        if (fs.existsSync(DATA_PATH)) {
            const json = fs.readFileSync(DATA_PATH, "utf-8");
            fileData = JSON.parse(json);
        }

        const nuevaEntrada = {
            trabajador: workerId,
            horas: horasPorDia,
            dias: diasSeleccionados,
        };

        // Buscar si ya existe la orden interna
        const oiIndex = fileData.OI.findIndex((oi: any) =>
            Object.prototype.hasOwnProperty.call(oi, ordenInterna)
        );
        if (oiIndex === -1) {
            // No existe la orden: crearla desde cero
            fileData.OI.push({
                [ordenInterna]: [
                    {
                        [workerId]: [nuevaEntrada]
                    }
                ]
            });
        } else {
            // Orden existe
            const ordenData = fileData.OI[oiIndex][ordenInterna];

            // Suponiendo que es un array con 1 objeto (estructura definida)
            const trabajadorBloque = ordenData[0];

            if (trabajadorBloque[workerId]) {
                trabajadorBloque[workerId].push(nuevaEntrada); // Añadir al arreglo existente
            } else {
                trabajadorBloque[workerId] = [nuevaEntrada]; // Crear nueva clave de trabajador
            }
        }

        // Guardar actualizado
        fs.writeFileSync(DATA_PATH, JSON.stringify(fileData, null, 2), "utf-8");

        return res.status(200).json({ message: "Guardado exitosamente" });
    } catch (err) {
        console.error("Error al guardar:", err);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
}
