"use client"

import { ContentBody } from "@/components/containers/containers"

export default function NewWorker() {
    const stylesInput = `
  w-full border border-gray-600 rounded px-3 py-2 
  hover:border-blue-600 
  focus:border-blue-500 
  focus:ring-2 focus:ring-blue-300 
  focus:outline-none
`;
    return (
        <ContentBody title="Nuevo trabajador">
            <div className="m-8">
                <h1 className="text-2xl font-bold mb-6">Alta de Usuario</h1>
                <div className=" ml-4 mr-4">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div>
                            <label htmlFor="nombre" className="block font-medium mb-1 ">
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                className={stylesInput}
                            />
                        </div>

                        {/* Correo electrónico */}
                        <div>
                            <label htmlFor="correo" className="block font-medium mb-1 ">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                className={stylesInput}
                            />
                        </div>

                        {/* Nivel */}
                        <div>
                            <label htmlFor="nivel" className="block font-medium mb-1">
                                Nivel
                            </label>
                            <input
                                type="text"
                                id="nivel"
                                name="nivel"
                                className={stylesInput}
                            />
                        </div>

                        {/* Tipo de contrato */}
                        <div>
                            <label htmlFor="contrato" className="block font-medium mb-1">
                                Tipo de contrato
                            </label>
                            <select
                                id="contrato"
                                name="contrato"
                                className={stylesInput}
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="indefinido">Indefinido</option>
                                <option value="temporal">Temporal</option>
                                <option value="prácticas">Prácticas</option>
                            </select>
                        </div>

                        {/* Descripción */}
                        <div className="md:col-span-2">
                            <label htmlFor="descripcion" className="block font-medium mb-1">
                                Descripción
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                rows={3}
                                className="w-full border border-gray-600 rounded px-3 py-2 max-h-[70px] min-h-[50px]  hover:border-blue-600  focus:border-blue-500 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                            />
                        </div>

                        {/* Tiempo */}
                        <div>
                            <label htmlFor="tiempo" className="block font-medium mb-1">
                                Tiempo
                            </label>
                            <input
                                type="text"
                                id="tiempo"
                                name="tiempo"
                                className={stylesInput}
                            />
                        </div>

                        {/* Especialidad */}
                        <div>
                            <label htmlFor="especialidad" className="block font-medium mb-1">
                                Especialidad
                            </label>
                            <input
                                type="text"
                                id="especialidad"
                                name="especialidad"
                                className={stylesInput}
                            />
                        </div>

                        {/* Niveles */}
                        <div>
                            <label htmlFor="niveles" className="block font-medium mb-1">
                                Niveles
                            </label>
                            <input
                                type="text"
                                id="niveles"
                                name="niveles"
                                className={stylesInput}
                            />
                        </div>

                        {/* Departamento */}
                        <div>
                            <label htmlFor="departamento" className="block font-medium mb-1">
                                Departamento
                            </label>
                            <input
                                type="text"
                                id="departamento"
                                name="departamento"
                                className={stylesInput}
                            />
                        </div>

                        {/* Disponibilidad de carga */}
                        <div className="md:col-span-1">
                            <label htmlFor="disponibilidad" className="block font-medium mb-1">
                                Disponibilidad de carga
                            </label>
                            <input
                                type="text"
                                id="disponibilidad"
                                name="disponibilidad"
                                className={stylesInput}
                            />
                        </div>

                        {/* Botón */}
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ContentBody>
    )
}