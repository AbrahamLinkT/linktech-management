"use client";

import { useState } from "react";
import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAsuetos } from "@/hooks/useAsuetos";
import { useEmployees } from "@/hooks/useEmployees";

interface FormData {
  employee_id: number | null;
  startDate: string;
  endDate: string;
}

export default function New() {
    const router = useRouter();
    const { createAsueto, isLoading, error } = useAsuetos();
    const { employees, useAutoLoadEmployees } = useEmployees();
    
    // Cargar empleados automáticamente
    useAutoLoadEmployees();
    
    const [formData, setFormData] = useState<FormData>({
        employee_id: null,
        startDate: '',
        endDate: ''
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
        router.push("/dashboard/asuetos");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'employee_id' 
                ? (value === '' ? null : parseInt(value))
                : value
        }));
    };

    const date = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Solo actualizar el estado del formulario sin restricciones de día
        handleInputChange(e);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        
        console.log('Form data before validation:', formData);
        
        // Validación
        if (!formData.employee_id || !formData.startDate || !formData.endDate) {
            alert('Por favor, completa todos los campos requeridos.');
            return;
        }

        // Validar que la fecha de fin sea posterior o igual a la fecha de inicio
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            alert('La fecha de fin debe ser posterior o igual a la fecha de inicio.');
            return;
        }

        try {
            // Convertir fechas a formato ISO con hora específica según el endpoint
            const startDateTime = new Date(formData.startDate + 'T00:00:00').toISOString();
            const endDateTime = new Date(formData.endDate + 'T23:59:59').toISOString();

            const asuetoData = {
                employee_id: formData.employee_id,
                startDate: startDateTime,
                endDate: endDateTime
            };

            console.log('Asueto data to be sent:', asuetoData);
            console.log('Start date formatted:', startDateTime);
            console.log('End date formatted:', endDateTime);

            const result = await createAsueto(asuetoData);
            
            if (result.success) {
                setSuccessMessage('Asueto creado exitosamente');
                // Reset form
                setFormData({
                    employee_id: null,
                    startDate: '',
                    endDate: ''
                });
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    router.push("/dashboard/asuetos");
                }, 2000);
            }
        } catch (error) {
            console.error('Error in form submission:', error);
        }
    };
    
    return (
        <ContentBody title="Nuevo asueto"
            btnReg={
                <Btn_data
                    icon={<ArrowLeft />}
                    text={"Regresar"}
                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                    Onclick={handleClickRoute}
                />
            }>
            <div className="m-1">
                <h2 className="text-2xl font-bold mb-6 ml-4">Alta de días de asueto</h2>
                
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

                    <fieldset className="border border-gray-400 rounded-xl p-4" >
                        <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                            Asignacion de dia asueto
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="empleado" className="block font-medium mb-1">
                                    Empleado *
                                </label>
                                <div className="flex items-center gap-4">
                                    <select 
                                        name="employee_id" 
                                        id="empleado" 
                                        value={formData.employee_id || ''}
                                        onChange={handleInputChange}
                                        className={stylesInput}
                                        required
                                    >
                                        <option value="">Seleccione empleado</option>
                                        {employees.map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="startDate" className="block font-medium mb-1">
                                    Fecha inicio *
                                </label>
                                <input 
                                    type="date" 
                                    id="startDate" 
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={date}
                                    className={stylesInput}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block font-medium mb-1">
                                    Fecha final *
                                </label>
                                <input 
                                    type="date" 
                                    id="endDate" 
                                    name="endDate" 
                                    value={formData.endDate}
                                    onChange={date}
                                    className={stylesInput}
                                    required
                                />
                            </div>
                            <div className="col-span-2">
                                {/* Campos eliminados: tiempo y descripción ya no son requeridos */}
                            </div>
                        </div>
                    </fieldset>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 px-6 rounded"
                        >
                            {isLoading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </ContentBody>
    );
}
