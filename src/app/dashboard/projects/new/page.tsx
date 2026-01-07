"use client";

import { useState } from "react";
import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { useClients } from "@/hooks/useClients";
import { useWorkers } from "@/hooks/useWorkers";

interface FormData {
  project_name: string;
  project_code: string;
  order_int: number;
  project_description: string;
  client_id: string;
  employee_id: string;
  status: string;
  project_type: string;
  estimated_hours: number;
  budget_amount: number;
  start_date: string;
  end_date: string;
  active: boolean;
}

export default function NewProject() {
  const router = useRouter();
  const { createProject, isLoading, error } = useProjects();
  const { data: clients } = useClients();
  const { data: workers } = useWorkers();
  
  const [formData, setFormData] = useState<FormData>({
    project_name: "",
    project_code: "",
    order_int: 0,
    project_description: "",
    client_id: "",
    employee_id: "",
    status: "PLANNED",
    project_type: "CLIENT",
    estimated_hours: 0,
    budget_amount: 0,
    start_date: "",
    end_date: "",
    active: true,
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
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' 
        ? parseFloat(value) || 0
        : type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    
    // Validation
    if (!formData.project_name.trim() || !formData.project_code.trim() || !formData.client_id || !formData.employee_id || !formData.start_date || !formData.end_date) {
      alert('Por favor, completa todos los campos requeridos marcados con *.');
      return;
    }

    if (formData.start_date > formData.end_date) {
      alert('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return;
    }

    const result = await createProject({
      project_name: formData.project_name.trim(),
      project_code: formData.project_code.trim(),
      order_int: formData.order_int,
      project_description: formData.project_description.trim(),
      client_id: parseInt(formData.client_id) || 0,
      employee_id: parseInt(formData.employee_id) || 0,
      status: formData.status as "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
      project_type: formData.project_type as "CLIENT" | "INTERNAL" | "RESEARCH",
      estimated_hours: formData.estimated_hours,
      budget_amount: formData.budget_amount,
      start_date: formData.start_date,
      end_date: formData.end_date,
      active: formData.active,
    });
    
    if (result.success) {
      setSuccessMessage('Proyecto creado exitosamente');
      // Reset form
      setFormData({
        project_name: "",
        project_code: "",
        order_int: 0,
        project_description: "",
        client_id: "",
        employee_id: "",
        status: "PLANNED",
        project_type: "CLIENT",
        estimated_hours: 0,
        budget_amount: 0,
        start_date: "",
        end_date: "",
        active: true,
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
          
          {/* Status messages */}
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

            {/* Project basic info section */}
            <fieldset className="border border-gray-400 rounded-xl p-4">
              <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                Información Básica
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="project_name" className="block font-medium mb-1">
                    Nombre del Proyecto *
                  </label>
                  <input 
                    type="text" 
                    id="project_name" 
                    name="project_name" 
                    value={formData.project_name}
                    onChange={handleInputChange}
                    maxLength={255}
                    className={stylesInput} 
                    required
                  />
                </div>

                <div>
                  <label htmlFor="project_code" className="block font-medium mb-1">
                    Código del Proyecto *
                  </label>
                  <input 
                    type="text" 
                    id="project_code" 
                    name="project_code" 
                    value={formData.project_code}
                    onChange={handleInputChange}
                    maxLength={50}
                    className={stylesInput} 
                    required
                  />
                </div>

                <div>
                  <label htmlFor="order_int" className="block font-medium mb-1">
                    Orden Interna
                  </label>
                  <input 
                    type="number" 
                    id="order_int" 
                    name="order_int" 
                    value={formData.order_int}
                    onChange={handleInputChange}
                    min="0"
                    className={stylesInput}
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="project_description" className="block font-medium mb-1">
                    Descripción
                  </label>
                  <textarea 
                    name="project_description"
                    id="project_description"
                    value={formData.project_description}
                    onChange={handleInputChange}
                    maxLength={1000}
                    className={stylesInput} 
                    rows={3}
                  />
                </div>

                <div>
                  <label htmlFor="active" className="block font-medium mb-1">
                    Activo
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <input 
                      type="checkbox" 
                      id="active" 
                      name="active" 
                      checked={formData.active}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <label htmlFor="active" className="text-sm">Proyecto activo</label>
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Client and Employee section */}
            <fieldset className="border border-gray-400 rounded-xl p-4">
              <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                Cliente y Responsable
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="client_id" className="block font-medium mb-1">
                    Cliente *
                  </label>
                  <select 
                    name="client_id" 
                    id="client_id" 
                    value={formData.client_id}
                    onChange={handleInputChange}
                    className={stylesInput}
                    required
                  >
                    <option value="">Seleccione un cliente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.clientName} {client.shortName ? `(${client.shortName})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="employee_id" className="block font-medium mb-1">
                    Responsable (Empleado) *
                  </label>
                  <select 
                    name="employee_id" 
                    id="employee_id" 
                    value={formData.employee_id}
                    onChange={handleInputChange}
                    className={stylesInput}
                    required
                  >
                    <option value="">Seleccione un empleado</option>
                    {workers?.map((worker) => (
                      <option key={worker.id} value={worker.id}>
                        {worker.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Project type and status section */}
            <fieldset className="border border-gray-400 rounded-xl p-4">
              <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                Tipo y Estado
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="project_type" className="block font-medium mb-1">
                    Tipo de Proyecto *
                  </label>
                  <select 
                    name="project_type" 
                    id="project_type" 
                    value={formData.project_type}
                    onChange={handleInputChange}
                    className={stylesInput}
                    required
                  >
                    <option value="CLIENT">Cliente</option>
                    <option value="INTERNAL">Interno</option>
                    <option value="RESEARCH">Investigación</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block font-medium mb-1">
                    Estado del Proyecto *
                  </label>
                  <select 
                    name="status" 
                    id="status" 
                    value={formData.status}
                    onChange={handleInputChange}
                    className={stylesInput}
                    required
                  >
                    <option value="PLANNED">Planeado</option>
                    <option value="IN_PROGRESS">En Progreso</option>
                    <option value="COMPLETED">Completado</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                </div>
              </div>
            </fieldset>

            {/* Timeline and budget section */}
            <fieldset className="border border-gray-400 rounded-xl p-4">
              <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
                Cronograma y Presupuesto
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="start_date" className="block font-medium mb-1">
                    Fecha de Inicio *
                  </label>
                  <input 
                    type="datetime-local" 
                    id="start_date" 
                    name="start_date" 
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className={stylesInput} 
                    required
                  />
                </div>

                <div>
                  <label htmlFor="end_date" className="block font-medium mb-1">
                    Fecha de Fin *
                  </label>
                  <input 
                    type="datetime-local" 
                    id="end_date" 
                    name="end_date" 
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className={stylesInput} 
                    required
                  />
                </div>

                <div>
                  <label htmlFor="estimated_hours" className="block font-medium mb-1">
                    Horas Estimadas
                  </label>
                  <input 
                    type="number" 
                    id="estimated_hours" 
                    name="estimated_hours" 
                    value={formData.estimated_hours}
                    onChange={handleInputChange}
                    min="0"
                    step="0.5"
                    className={stylesInput}
                  />
                </div>

                <div>
                  <label htmlFor="budget_amount" className="block font-medium mb-1">
                    Presupuesto
                  </label>
                  <input 
                    type="number" 
                    id="budget_amount" 
                    name="budget_amount" 
                    value={formData.budget_amount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={stylesInput}
                  />
                </div>
              </div>
            </fieldset>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleClickRoute}
                className="font-semibold py-2 px-6 rounded border border-gray-400 hover:bg-gray-100"
              >
                Cancelar
              </button>
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
