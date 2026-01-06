"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { useClients } from "@/hooks/useClients";
import { useProjectManagers } from "@/hooks/useProjectManagers";
import { buildApiUrl, API_CONFIG } from '../../../../../config/api';

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

export default function EditProject() {
  const params = useParams();
  const router = useRouter();
  const { updateProject, isUpdating, error } = useProjects();
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
  const [isLoadingProject, setIsLoadingProject] = useState(true);

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

    // Cargar datos del proyecto
    useEffect(() => {
        const loadProject = async () => {
            if (params.id) {
                setIsLoadingProject(true);
                try {
                    const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.PROJECTS)}/${params.id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const project = await response.json();
                        setFormData({
                            name: project.name,
                            description: project.description || "",
                            status: project.status,
                            start_date: project.start_date ? new Date(project.start_date).toISOString().slice(0, 16) : "",
                            end_date: project.end_date ? new Date(project.end_date).toISOString().slice(0, 16) : "",
                            oi: project.oi || "",
                            id_project_manager: project.id_project_manager,
                            client_id: project.client_id
                        });
                    } else {
                        console.error('Error fetching project');
                    }
                } catch (error) {
                    console.error('Error:', error);
                } finally {
                    setIsLoadingProject(false);
                }
            }
        };
        
        loadProject();
    }, [params.id]);

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

        const result = await updateProject(params.id as string, {
            ...formData,
            client_id: formData.client_id! // Assert que no es null porque ya lo validamos
        });
        
        if (result.success) {
            setSuccessMessage('Proyecto actualizado exitosamente');
            
            // Redirect after 2 seconds
            setTimeout(() => {
                router.push("/dashboard/projects");
            }, 2000);
        }
    };

    if (isLoadingProject) {
        return (
            <ContentBody title="Editar Proyecto">
                <div className="flex justify-center items-center p-8">
                    <div className="text-lg">Cargando datos del proyecto...</div>
                </div>
            </ContentBody>
        );
    }

    return (
        <ContentBody title="Editar proyecto"
            btnReg={
                <Btn_data
                    icon={<ArrowLeft />}
                    text={"Regresar"}
                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                    Onclick={handleClickRoute}
                />
            }>
            <div className="m-1">
                <h2 className="text-2xl font-bold mb-6 ml-4">Editar Proyecto</h2>
                
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

                    {/* Sección: Datos del proyecto */}
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
                                            {client.clientName} {client.shortName ? `- ${client.shortName}` : ''}
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
                            disabled={isUpdating}
                            className={`font-semibold py-2 px-6 rounded ${
                                isUpdating 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {isUpdating ? 'Actualizando...' : 'Actualizar'}
                        </button>
                    </div>
                </form>
            </div>
        </ContentBody>
    );
}