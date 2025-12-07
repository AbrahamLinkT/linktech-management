"use client";

import { useSearchParams } from 'next/navigation'
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ContentBody } from "@/components/containers/containers";
import { Btn_data } from "@/components/buttons/buttons";
import { useWorkers } from '@/hooks/useWorkers';
import { useState, useEffect } from 'react';

export default function Edit() {

    // =================== state ===================
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const route = useRouter();
    const { getWorkerById, updateWorker } = useWorkers();
    
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        status: true,
        location: '',
        description: '',
        roleId: null as number | null,
        schemeId: null as number | null,
        levelId: null as number | null,
    });
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Cargar datos del trabajador
    useEffect(() => {
        const loadWorker = async () => {
            if (!id) {
                route.push("/dashboard/workers");
                return;
            }

            try {
                const workerData = await getWorkerById(parseInt(id));
                if (workerData) {
                    setFormData({
                        name: workerData.name || '',
                        email: workerData.email || '',
                        phone: workerData.phone || '',
                        status: workerData.status,
                        location: workerData.location || '',
                        description: workerData.description || '',
                        roleId: workerData.roleId || null,
                        schemeId: workerData.schemeId || null,
                        levelId: workerData.levelId || null,
                    });
                } else {
                    console.error('Trabajador no encontrado');
                    route.push("/dashboard/workers");
                }
            } catch (error) {
                console.error('Error cargando trabajador:', error);
                route.push("/dashboard/workers");
            } finally {
                setLoading(false);
            }
        };

        loadWorker();
    }, [id, getWorkerById, route]);

    const handleClick = () => {
        route.push("/dashboard/workers");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const tagName = e.target.tagName.toLowerCase();
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                [name]: checked,
            }));
        } else if (tagName === 'select') {
            // Para selects que pueden tener valores numéricos
            const numValue = value === '' ? null : parseInt(value);
            setFormData(prev => ({
                ...prev,
                [name]: numValue,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!id) return;

        setSubmitting(true);
        try {
            const success = await updateWorker(parseInt(id), formData);
            if (success) {
                setSuccessMessage('Trabajador actualizado correctamente');
                setTimeout(() => {
                    route.push("/dashboard/workers");
                }, 1500);
            } else {
                alert('Error al actualizar el trabajador');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al actualizar el trabajador');
        } finally {
            setSubmitting(false);
        }
    };

    const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-2 
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;

    if (loading) {
        return (
            <ContentBody title='Editar trabajador'>
                <div className="flex justify-center items-center h-64">
                    <p>Cargando datos del trabajador...</p>
                </div>
            </ContentBody>
        );
    }

    return (
        <>
            <ContentBody
                title='Editar trabajador'
                btnReg={
                    <Btn_data
                        text="Regresar"
                        icon={<ArrowLeft />}
                        styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium hover:bg-blue-400 hover:text-white"
                        Onclick={handleClick}
                    />
                }
            >
                <div className="m-1">
                    <h2 className="text-2xl font-bold mb-6 ml-4">Datos del trabajador</h2>
                    {successMessage && (
                        <div className="mb-4 ml-4 p-4 bg-green-100 text-green-700 rounded">
                            {successMessage}
                        </div>
                    )}
                    <form className="space-y-10 ml-4 mr-4" onSubmit={handleSubmit}>

                        {/* Sección: Datos personales */}
                        <fieldset className="border border-gray-400 rounded-xl p-4" >
                            <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                                Datos personales
                            </legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="name" className="block font-medium mb-1">
                                        Nombre
                                    </label>
                                    <input 
                                        type="text" 
                                        id="name" 
                                        name="name" 
                                        className={stylesInput}
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block font-medium mb-1">
                                        Correo electrónico
                                    </label>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        className={stylesInput}
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block font-medium mb-1">
                                        Numero telefonico
                                    </label>
                                    <input 
                                        type="text" 
                                        id="phone" 
                                        name="phone" 
                                        placeholder="+528334652691" 
                                        className={stylesInput}
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="status" className="block font-medium mb-1">Status</label>
                                    <div className="flex items-center gap-4">
                                        <select 
                                            name="status" 
                                            id="status" 
                                            className={stylesInput}
                                            value={formData.status ? 'true' : 'false'}
                                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value === 'true' }))}
                                        >
                                            <option value="true">Activo</option>
                                            <option value="false">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label htmlFor="location" className="block font-medium mb-1">
                                        Ubicacion
                                    </label>
                                    <input 
                                        type="text" 
                                        id="location"
                                        name="location"
                                        className={stylesInput}
                                        value={formData.location}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </fieldset>
                        {/* Sección: Información laboral */}
                        <fieldset className="border border-gray-400 rounded-xl p-4">
                            <legend className="text-lg font-semibold px-2 ml-2 mt-4">Información laboral</legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="levelId" className="block font-medium mb-1">
                                        Nivel
                                    </label>
                                    <select 
                                        name="levelId" 
                                        id="levelId" 
                                        className={stylesInput}
                                        value={formData.levelId || ''}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Selecciona una opción</option>
                                        <option value="1">Junior</option>
                                        <option value="2">Senior</option>
                                        <option value="3">Lead</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="roleId" className="block font-medium mb-1">
                                        Rol
                                    </label>
                                    <select 
                                        name="roleId" 
                                        id="roleId" 
                                        className={stylesInput}
                                        value={formData.roleId || ''}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Selecciona una opción</option>
                                        <option value="1">Desarrollador</option>
                                        <option value="2">Diseñador</option>
                                        <option value="3">QA</option>
                                        <option value="4">PM</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="schemeId" className="block font-medium mb-1">
                                        Esquema
                                    </label>
                                    <select 
                                        name="schemeId" 
                                        id="schemeId" 
                                        className={stylesInput}
                                        value={formData.schemeId || ''}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Selecciona la opción</option>
                                        <option value="1">Asimilado</option>
                                        <option value="2">Indeterminado</option>
                                        <option value="3">Proveedor PF</option>
                                        <option value="4">Proveedor PM</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="description" className="block font-medium mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={3}
                                        className="w-full h-[70px] resize-none border border-gray-600 rounded px-3 py-2 
                                                 hover:border-blue-600 focus:border-blue-500 
                                                 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </fieldset>

                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleClick}
                                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
                            >
                                {submitting ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </ContentBody>

        </>
    );
}
