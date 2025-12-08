"use client";

import { useState, useEffect, useCallback } from "react";
import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAsuetos } from "@/hooks/useAsuetos";
import { useAutoLoadEmployees } from "@/hooks/useEmployees";

interface FormData {
  employee_id: number | null;
  startDate: string;
  endDate: string;
}

interface AsuetoData {
  id: string | number;
  employee_id: number;
  startDate: string;
  endDate: string;
}

export default function EditAsueto() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const asuetoId = searchParams.get('id');

  const { updateAsueto, isLoading, error } = useAsuetos();
  const { employees, isLoading: employeesLoading } = useAutoLoadEmployees();

  const [formData, setFormData] = useState<FormData>({
    employee_id: null,
    startDate: '',
    endDate: ''
  });
  
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [employeeName, setEmployeeName] = useState<string>('');

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

  // Función para encontrar el nombre del empleado
  const findEmployeeName = useCallback((employeeId: number) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : `Empleado ID: ${employeeId}`;
  }, [employees]);

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
        console.log('🔍 Cargando asueto con ID:', asuetoId);
        
        // Hacer la petición directamente a la API
        const response = await fetch(`${process.env.NODE_ENV === 'production' ? '/api/proxy' : process.env.NEXT_PUBLIC_API_URL || 'http://backend.linktech.com.mx'}/Non-Working-Days/${asuetoId}`);
        
        if (response.ok) {
          const asuetoData: AsuetoData = await response.json();
          console.log('✅ Asueto encontrado:', asuetoData);
          
          setFormData({
            employee_id: asuetoData.employee_id,
            startDate: asuetoData.startDate ? asuetoData.startDate.split('T')[0] : '',
            endDate: asuetoData.endDate ? asuetoData.endDate.split('T')[0] : ''
          });
          
          // Establecer el nombre del empleado
          setEmployeeName(findEmployeeName(asuetoData.employee_id));
        } else if (response.status === 404) {
          console.error('❌ Asueto no encontrado con ID:', asuetoId);
          alert('El asueto no fue encontrado');
          router.push("/dashboard/asuetos");
        } else {
          console.error('❌ Error en la respuesta:', response.status, response.statusText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('❌ Error cargando datos del asueto:', error);
        alert('Error al cargar los datos del asueto');
        router.push("/dashboard/asuetos");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadAsuetoData();
  }, [asuetoId, router, findEmployeeName]);

  // Actualizar el nombre del empleado cuando se cargan los empleados
  useEffect(() => {
    if (formData.employee_id && employees.length > 0) {
      setEmployeeName(findEmployeeName(formData.employee_id));
    }
  }, [formData.employee_id, employees, findEmployeeName]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const date = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo actualizar el estado del formulario sin restricciones de día
    handleInputChange(e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    
    if (!asuetoId) return;

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

      const updateData = {
        employee_id: formData.employee_id,
        startDate: startDateTime,
        endDate: endDateTime
      };

      console.log('Update data to be sent:', updateData);
      console.log('Start date formatted:', startDateTime);
      console.log('End date formatted:', endDateTime);

      const result = await updateAsueto(asuetoId, updateData);
      
      if (result.success) {
        setSuccessMessage('Asueto actualizado exitosamente');
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/dashboard/asuetos");
        }, 2000);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  if (isLoadingData) {
    return (
      <ContentBody title="Editar asueto"
        btnReg={
          <Btn_data
            icon={<ArrowLeft />}
            text={"Regresar"}
            styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
            Onclick={handleClickRoute}
          />
        }>
        <div className="flex justify-center items-center h-40">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando datos del asueto...</p>
          </div>
        </div>
      </ContentBody>
    );
  }

  return (
    <ContentBody title="Editar asueto"
      btnReg={
        <Btn_data
          icon={<ArrowLeft />}
          text={"Regresar"}
          styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
          Onclick={handleClickRoute}
        />
      }>
      <div className="m-1">
        <h2 className="text-2xl font-bold mb-6 ml-4">Editar días de asueto</h2>
        
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
          <fieldset className="border border-gray-400 rounded-xl p-4">
            <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
              Actualización de dia asueto
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="empleado" className="block font-medium mb-1">
                  Empleado
                </label>
                <div className="flex items-center gap-4">
                  <div className={`${stylesInput} bg-gray-100 cursor-not-allowed`}>
                    {employeesLoading ? 'Cargando empleados...' : employeeName || 'Empleado no encontrado'}
                  </div>
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
                {/* Espacio adicional si se necesita */}
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2 px-6 rounded"
            >
              {isLoading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </ContentBody>
  );
}