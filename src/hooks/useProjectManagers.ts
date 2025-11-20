import { useState, useEffect } from 'react';
import axios from 'axios';

// Interfaz para department-head
interface DepartmentHead {
  id: number;
  id_department: number;
  id_worker: number;
}

// Interfaz para worker
interface Worker {
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

// Interfaz para el resultado del join (Project Manager)
interface ProjectManager {
  id: number; // id del worker
  name: string;
  email: string;
  phone: string;
  location: string;
  department_id: number; // id del departamento
  department_head_id: number; // id del department-head
}

interface GetProjectManagersResponse {
  success: boolean;
  data?: ProjectManager[];
  error?: string;
}

export const useProjectManagers = () => {
  const [projectManagers, setProjectManagers] = useState<ProjectManager[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener todos los project managers (join)
  const getProjectManagers = async (): Promise<GetProjectManagersResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      // Obtener department-heads y workers en paralelo
      const [departmentHeadsResponse, workersResponse] = await Promise.all([
        axios.get('http://13.56.13.129/department-heads', {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        }),
        axios.get('http://13.56.13.129/worker', {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        })
      ]);

      console.log('Department Heads API Response:', departmentHeadsResponse.data);
      console.log('Workers API Response:', workersResponse.data);

      // Verificar si la respuesta tiene la estructura esperada y extraer los datos correctos
      let departmentHeads: DepartmentHead[] = [];
      let workers: Worker[] = [];

      // Para department-heads (parece que viene como array directo)
      if (Array.isArray(departmentHeadsResponse.data)) {
        departmentHeads = departmentHeadsResponse.data;
      } else if (departmentHeadsResponse.data && Array.isArray(departmentHeadsResponse.data.data)) {
        departmentHeads = departmentHeadsResponse.data.data;
      } else if (departmentHeadsResponse.data && typeof departmentHeadsResponse.data === 'object') {
        console.log('Department heads response structure:', Object.keys(departmentHeadsResponse.data));
      }

      // Para workers (viene con estructura paginada: {content: Array, pageable: ...})
      if (Array.isArray(workersResponse.data)) {
        workers = workersResponse.data;
      } else if (workersResponse.data && Array.isArray(workersResponse.data.content)) {
        // La estructura paginada tiene el array en .content
        workers = workersResponse.data.content;
        console.log('Found workers in paginated structure:', workers.length);
      } else if (workersResponse.data && Array.isArray(workersResponse.data.data)) {
        workers = workersResponse.data.data;
      } else if (workersResponse.data && typeof workersResponse.data === 'object') {
        console.log('Workers response structure:', Object.keys(workersResponse.data));
      }

      console.log('Department Heads processed (length):', departmentHeads.length);
      console.log('Workers processed (length):', workers.length);
      console.log('Sample department head:', departmentHeads[0]);
      console.log('Sample worker:', workers[0]);

      // Hacer el JOIN: buscar workers que sean department heads
      // id_worker de department-heads debe hacer match con id de worker
      if (departmentHeads.length === 0) {
        console.warn('No department heads found');
        setProjectManagers([]);
        setIsLoading(false);
        return {
          success: true,
          data: [],
        };
      }

      if (workers.length === 0) {
        console.warn('No workers found');
        setProjectManagers([]);
        setIsLoading(false);
        return {
          success: true,
          data: [],
        };
      }

      console.log('Starting JOIN process...');
      console.log('Department heads to process:', departmentHeads.length);
      console.log('Workers available:', workers.length);
      
      // Mostrar TODOS los datos para debug completo
      console.log('FULL Department heads data:', JSON.stringify(departmentHeads, null, 2));
      console.log('FULL Workers data:', JSON.stringify(workers, null, 2));
      
      // Mostrar todos los IDs disponibles
      console.log('Available worker IDs:', workers.map(w => `ID: ${w.id} (type: ${typeof w.id}) - Name: ${w.name}`));
      console.log('Department head id_worker values:', departmentHeads.map(dh => `id_worker: ${dh.id_worker} (type: ${typeof dh.id_worker})`));

      const projectManagersJoin: ProjectManager[] = [];
      const addedWorkerIds = new Set<number>(); // Para evitar duplicados

      // Procesar cada department head
      departmentHeads.forEach((deptHead, index) => {
        console.log(`\n=== Processing department head ${index + 1}/${departmentHeads.length} ===`);
        console.log('Department head data:', JSON.stringify(deptHead, null, 2));
        
        if (!deptHead || typeof deptHead !== 'object') {
          console.warn(`Department head ${index + 1} is not valid object:`, deptHead);
          return;
        }

        if (!deptHead.id_worker) {
          console.warn(`Department head ${index + 1} missing id_worker:`, deptHead);
          return;
        }

        console.log(`Looking for worker with id matching id_worker: ${deptHead.id_worker} (type: ${typeof deptHead.id_worker})`);
        
        // Buscar el worker que corresponde al id_worker
        const worker = workers.find(w => {
          if (!w || typeof w !== 'object') {
            console.log(`Skipping invalid worker:`, w);
            return false;
          }

          const workerId = w.id;
          const deptHeadIdWorker = deptHead.id_worker;
          
          // Probar diferentes tipos de comparación
          const exactMatch = workerId === deptHeadIdWorker;
          const looseMatch = workerId == deptHeadIdWorker;
          const stringMatch = String(workerId) === String(deptHeadIdWorker);
          const numberMatch = Number(workerId) === Number(deptHeadIdWorker);
          
          console.log(`  Checking worker: ID=${workerId} (${typeof workerId}), Name="${w.name}"`);
          console.log(`    vs dept_head id_worker=${deptHeadIdWorker} (${typeof deptHeadIdWorker})`);
          console.log(`    Exact match (===): ${exactMatch}`);
          console.log(`    Loose match (==): ${looseMatch}`);
          console.log(`    String match: ${stringMatch}`);
          console.log(`    Number match: ${numberMatch}`);
          
          return exactMatch || looseMatch || stringMatch || numberMatch;
        });
        
        if (!worker) {
          console.warn(`❌ No worker found for id_worker ${deptHead.id_worker}`);
          console.log('Available workers for reference:', workers.map(w => ({id: w.id, name: w.name})));
          return;
        }

        console.log(`✅ Worker found for id_worker ${deptHead.id_worker}:`, {
          id: worker.id, 
          name: worker.name, 
          status: worker.status,
          location: worker.location
        });
        
        // Verificar si el worker está activo
        if (!worker.status) {
          console.log(`⚠️ Worker ${worker.name} (id: ${worker.id}) is inactive, skipping`);
          return;
        }

        // Verificar si ya agregamos este worker (evitar duplicados)
        if (addedWorkerIds.has(worker.id)) {
          console.log(`⚠️ Worker ${worker.name} (id: ${worker.id}) already added, skipping duplicate`);
          return;
        }

        // Agregar el project manager
        const projectManager: ProjectManager = {
          id: worker.id,
          name: worker.name || 'Sin nombre',
          email: worker.email || '',
          phone: worker.phone || '',
          location: worker.location || 'Sin ubicación',
          department_id: deptHead.id_department,
          department_head_id: deptHead.id,
        };
        
        projectManagersJoin.push(projectManager);
        addedWorkerIds.add(worker.id);
        console.log(`✅ Added project manager:`, projectManager);
      });

      console.log(`JOIN completed. Found ${projectManagersJoin.length} project managers:`, projectManagersJoin);
      
      setProjectManagers(projectManagersJoin);
      setIsLoading(false);
      return {
        success: true,
        data: projectManagersJoin,
      };
    } catch (err: unknown) {
      console.error('Error fetching project managers:', err);
      let errorMessage = 'Error fetching project managers';
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else {
        const errorObj = err as { response?: { data?: { message?: string }; status?: number }; message?: string };
        errorMessage = errorObj?.response?.data?.message || errorObj?.message || 'Error fetching project managers';
      }
      
      setError(errorMessage);
      setIsLoading(false);
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Hook para cargar project managers automáticamente
  const useAutoLoadProjectManagers = () => {
    useEffect(() => {
      getProjectManagers();
    }, []);
  };

  return {
    projectManagers,
    getProjectManagers,
    useAutoLoadProjectManagers,
    isLoading,
    error,
  };
};