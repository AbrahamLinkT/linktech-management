import { useState, useEffect } from 'react';
import axios from 'axios';

// Interfaz para worker/empleado
interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: boolean;
  location: string;
  description: string;
  roleId: number | null;
  schemeId: number | null;
  levelId: number | null;
  roleName: string | null;
  schemeName: string | null;
  levelName: string | null;
}

interface GetEmployeesResponse {
  success: boolean;
  data?: Employee[];
  error?: string;
}

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todos los empleados
  const getEmployees = async (): Promise<GetEmployeesResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching employees from API...');
      
      const response = await axios.get('http://13.56.13.129/worker', {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      });

      console.log('Employees API Response:', response.data);

      // La API devuelve estructura paginada: {content: Array, pageable: ...}
      let employeesData: Employee[] = [];

      if (Array.isArray(response.data)) {
        employeesData = response.data;
      } else if (response.data && Array.isArray(response.data.content)) {
        employeesData = response.data.content;
        console.log('Found employees in paginated structure:', employeesData.length);
      } else {
        console.warn('Unexpected response structure:', response.data);
      }

      // Filtrar solo empleados activos y ordenar por nombre
      const activeEmployees = employeesData
        .filter(emp => emp.status === true)
        .sort((a, b) => a.name.localeCompare(b.name));

      console.log(`Filtered active employees: ${activeEmployees.length}`, activeEmployees);
      
      setEmployees(activeEmployees);
      setIsLoading(false);
      return {
        success: true,
        data: activeEmployees,
      };
    } catch (err: unknown) {
      console.error('Error fetching employees:', err);
      let errorMessage = 'Error fetching employees';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
        errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error fetching employees';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Hook para cargar empleados automáticamente
  const useAutoLoadEmployees = () => {
    useEffect(() => {
      getEmployees();
    }, []);
  };

  return {
    employees,
    getEmployees,
    useAutoLoadEmployees,
    isLoading,
    error,
  };
};

// Hook separado para auto-cargar empleados
export const useAutoLoadEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching employees from API...');
        
        const response = await axios.get('http://13.56.13.129/worker', {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        });

        console.log('Employees API Response status:', response.status);

        // La API devuelve estructura paginada: {content: Array, pageable: ...}
        let employeesData: Employee[] = [];

        if (Array.isArray(response.data)) {
          employeesData = response.data;
          console.log('📋 Employees data structure: Array directo');
        } else if (response.data && Array.isArray(response.data.content)) {
          employeesData = response.data.content;
          console.log('📋 Found employees in paginated structure:', employeesData.length);
        } else {
          console.warn('⚠️ Unexpected response structure:', response.data);
        }

        // Filtrar solo empleados activos y ordenar por nombre
        const activeEmployees = employeesData
          .filter(emp => emp.status === true)
          .sort((a, b) => a.name.localeCompare(b.name));

        console.log(`✅ Filtered active employees: ${activeEmployees.length} employees loaded`);
        setEmployees(activeEmployees);
        setError(null);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Error al cargar empleados');
        setEmployees([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployees();
  }, []);

  return { employees, isLoading, error };
};