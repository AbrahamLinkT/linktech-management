"use client";

import { useState } from "react";
import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { useClients } from "@/hooks/useClients";
import { useProjectManagers } from "@/hooks/useProjectManagers";

interface FormData {
  name: string;
  description: string;
  status: boolean;
  start_date: string;
  end_date: string;
  oi: string;
  id_project_manager: number | null;
  client_id: number | null; // Puede ser null en el formulario hasta que se seleccione
}

export default function NewProject() {
  const router = useRouter();
  const { createProject, isLoading, error } = useProjects();
  const { data: clients } = useClients();
  const { projectManagers, useAutoLoadProjectManagers } = useProjectManagers();
  
  // Cargar project managers automáticamente
  useAutoLoadProjectManagers();
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    status: true,
    start_date: "",
    end_date: "",
    oi: "",
    id_project_manager: null,
    client_id: null
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-2 
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;

    const handleClickRoute = () => {
        router.push("/dashboard/projects");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'id_project_manager' || name === 'client_id' 
                ? (value === '' ? null : parseInt(value) || null)
                : name === 'status' 
                    ? value === 'activo'
                    : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        
        // Validation
        if (!formData.name || !formData.oi || !formData.start_date || !formData.end_date || !formData.client_id || !formData.id_project_manager) {
            alert('Por favor, completa todos los campos requeridos (incluyendo cliente y project manager).');
            return;
        }

        const result = await createProject({
            ...formData,
            client_id: formData.client_id! // Assert que no es null porque ya lo validamos
        });
        
        if (result.success) {
            setSuccessMessage('Proyecto creado exitosamente');
            // Reset form
            setFormData({
                name: "",
                description: "",
                status: true,
                start_date: "",
                end_date: "",
                oi: "",
                id_project_manager: null,
                client_id: null
            });
            
            // Redirect after 2 seconds
            setTimeout(() => {
                router.push("/dashboard/projects");
            }, 2000);
        }
    };
    return (
        <ContentBody title="Nuevo proyecto"
            btnReg={
                <Btn_data
                    icon={<ArrowLeft />}
                    text={"Regresar"}
                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                    Onclick={handleClickRoute}
                />
            }>
            <div className="m-1">
                <h2 className="text-2xl font-bold mb-6 ml-4">Alta de Proyecto</h2>
                
                {/* Mensajes de estado */}
                {error && (
                    <div className="ml-4 mr-4 mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        Error: {error}
                    </div>
                )}
                
                {successMessage && (
                    <div className="ml-4 mr-4 mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        {successMessage}
                    </div>
                )}

                <form className="space-y-10 ml-4 mr-4" onSubmit={handleSubmit}>

                    {/* Sección: Datos personales */}
                    <fieldset className="border border-gray-400 rounded-xl p-4" >
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                            Datos del proyecto
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="nombre" className="block font-medium mb-1">
                                    Nombre del proyecto *
                                </label>
                                <input 
                                    type="text" 
                                    id="nombre" 
                                    name="name" 
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={stylesInput} 
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="orden_interna" className="block font-medium mb-1">
                                    Orden interna *
                                </label>
                                <input 
                                    type="text" 
                                    id="orden_interna" 
                                    name="oi" 
                                    value={formData.oi}
                                    onChange={handleInputChange}
                                    className={stylesInput} 
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="cliente" className="block font-medium mb-1">
                                    Cliente *
                                </label>
                                <select 
                                    name="client_id" 
                                    id="cliente" 
                                    value={formData.client_id || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            client_id: value === '' ? null : parseInt(value)
                                        }));
                                    }}
                                    className={stylesInput}
                                    required
                                >
                                    <option value="">Seleccione un cliente</option>
                                    {clients.map((client) => (
                                        <option key={client.id} value={client.id}>
                                            {client.nombre} {client.nombreCorto ? `- ${client.nombreCorto}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="status" className="block font-medium mb-1">Status *</label>
                                <div className="flex items-center gap-4">
                                    <select 
                                        name="status" 
                                        id="status" 
                                        value={formData.status ? 'activo' : 'inactivo'}
                                        onChange={handleInputChange}
                                        className={stylesInput}
                                        required
                                    >
                                        <option value="">Seleccione su opción</option>
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label htmlFor="descripcion" className="block font-medium mb-1">
                                    Descripción
                                </label>
                                <textarea 
                                    name="description"
                                    id="descripcion"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className={stylesInput} 
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label htmlFor="id_project_manager" className="block font-medium mb-1">
                                    Project Manager *
                                </label>
                                <select 
                                    name="id_project_manager" 
                                    id="id_project_manager" 
                                    value={formData.id_project_manager || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            id_project_manager: value === '' ? null : parseInt(value)
                                        }));
                                    }}
                                    className={stylesInput}
                                    required
                                >
                                    <option value="">Seleccione un project manager</option>
                                    {projectManagers.map((pm) => (
                                        <option key={pm.id} value={pm.id}>
                                            {pm.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="fecha_inicio" className="block font-medium mb-1">
                                    Fecha de inicio *
                                </label>
                                <input 
                                    type="datetime-local" 
                                    id="fecha_inicio" 
                                    name="start_date" 
                                    value={formData.start_date}
                                    onChange={handleInputChange}
                                    className={stylesInput} 
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="fecha_fin" className="block font-medium mb-1">
                                    Fecha de fin *
                                </label>
                                <input 
                                    type="datetime-local" 
                                    id="fecha_fin" 
                                    name="end_date" 
                                    value={formData.end_date}
                                    onChange={handleInputChange}
                                    className={stylesInput} 
                                    required
                                />
                            </div>
                        </div>
                    </fieldset>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`font-semibold py-2 px-6 rounded ${
                                isLoading 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {isLoading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </ContentBody>
    );
}
