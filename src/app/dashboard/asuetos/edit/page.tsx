"use client";

import { useState, useEffect } from "react";
import { ContentBody } from "@/components/containers/containers";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useAsuetos } from "@/hooks/useAsuetos";
import { useAutoLoadEmployees } from "@/hooks/useEmployees";

interface FormData {
  employee_id: number | null;
  startDate: string;
  endDate: string;
}

export default function EditAsueto() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const asuetoId = searchParams.get('id');

  const { updateAsueto, getAsuetos, isLoading, error } = useAsuetos();
  const { employees, isLoading: employeesLoading } = useAutoLoadEmployees();

  const [formData, setFormData] = useState<FormData>({
    employee_id: null,
    startDate: '',
    endDate: ''
  });
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const stylesInput = `
    w-full border border-gray-600 rounded px-3 py-2 
    hover:border-blue-600 
    focus:border-blue-500 
    focus:ring-2 focus:ring-blue-300 
    focus:outline-none
  `;

  // Cargar datos del asueto a editar
  useEffect(() => {
    const loadAsuetoData = async () => {
      if (!asuetoId) {
        console.error('No se proporcionó ID para editar');
        router.push("/dashboard/asuetos");
        return;
      }

      try {
        setIsLoadingData(true);
        const asuetos = await getAsuetos();
        const asuetoToEdit = asuetos.find(a => a.id === asuetoId);

        if (asuetoToEdit) {
          setFormData({
            employee_id: asuetoToEdit.employee_id,
            startDate: asuetoToEdit.startDate ? asuetoToEdit.startDate.split('T')[0] : '',
            endDate: asuetoToEdit.endDate ? asuetoToEdit.endDate.split('T')[0] : ''
          });
        } else {
          console.error('Asueto no encontrado');
          router.push("/dashboard/asuetos");
        }
      } catch (error) {
        console.error('Error cargando datos del asueto:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadAsuetoData();
  }, [asuetoId, getAsuetos, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'employee_id' ? (value ? parseInt(value) : null) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!asuetoId) return;

    if (!formData.employee_id || !formData.startDate || !formData.endDate) {
      alert('Por favor complete todos los campos');
      return;
    }

    try {
      const updateData = {
        employee_id: formData.employee_id,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString()
      };

      await updateAsueto(asuetoId, updateData);
      setSuccessMessage('Asueto actualizado exitosamente');
      
      setTimeout(() => {
        router.push("/dashboard/asuetos");
      }, 2000);
    } catch (error) {
      console.error('Error actualizando asueto:', error);
    }
  };

  if (isLoadingData) {
    return (
      <ContentBody>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando datos del asueto...</p>
          </div>
        </div>
      </ContentBody>
    );
  }

  return (
    <ContentBody>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/dashboard/asuetos")}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="ml-1">Volver</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Editar Asueto</h1>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Selection */}
          <div>
            <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-2">
              Empleado *
            </label>
            <select
              id="employee_id"
              name="employee_id"
              value={formData.employee_id || ''}
              onChange={handleInputChange}
              required
              disabled={employeesLoading}
              className={stylesInput}
            >
              <option value="">Selecciona un empleado</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.email}
                </option>
              ))}
            </select>
            {employeesLoading && (
              <p className="text-sm text-gray-500 mt-1">Cargando empleados...</p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Inicio *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              required
              className={stylesInput}
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Fin *
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              required
              min={formData.startDate}
              className={stylesInput}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {isLoading ? 'Actualizando...' : 'Actualizar Asueto'}
            </button>
            
            <button
              type="button"
              onClick={() => router.push("/dashboard/asuetos")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </ContentBody>
  );
}