"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { buildApiUrl, API_CONFIG } from '../config/api';

export interface WorkerData {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  status: boolean;
  location?: string;
  description?: string;
  level_id?: number | null;
  scheme_id?: number | null;
  role_id?: number | null;
  // new fields
  employee_code?: string;
  hire_date?: string | null;
  termination_date?: string | null;
  active?: boolean;
  manager_id?: number | null;
  managerName?: string;
  createdAt?: string;
  updatedAt?: string;
  roleName?: string;
  schemeName?: string;
  levelName?: string;
}

export interface WorkerPayload {
  name: string;
  email?: string;
  phone?: string;
  status: boolean;
  location?: string;
  description?: string;
  level_id?: number | null;
  scheme_id?: number | null;
  role_id?: number | null;
  // new optional fields for API
  employee_code?: string;
  hire_date?: string | null;
  termination_date?: string | null;
  active?: boolean;
  manager_id?: number | null;
}

export interface LevelItem { id: number; name: string; short_name?: string; description?: string }
export interface SchemeItem { id: number; name: string; description?: string; hours?: string }
export interface RoleItem { id: number; name: string; short_name?: string }

export function useWorkers() {
  const [data, setData] = useState<WorkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  // list of possible managers (id + name)
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);

  // =====================================
  // Helpers to fetch auxiliary lists
  // =====================================
  const fetchLevels = async () => {
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LEVELS));
      if (!res.ok) throw new Error(`Error fetching levels: ${res.status}`);
      const json = await res.json();
      setLevels(Array.isArray(json) ? json : json.content || []);
    } catch (err) {
      console.error('Error fetching levels', err);
    }
  };

  const fetchSchemes = async () => {
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORK_SCHEDULE));
      if (!res.ok) throw new Error(`Error fetching schemes: ${res.status}`);
      const json = await res.json();
      setSchemes(Array.isArray(json) ? json : json.content || []);
    } catch (err) {
      console.error('Error fetching schemes', err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ROLES));
      if (!res.ok) throw new Error(`Error fetching roles: ${res.status}`);
      const json = await res.json();
      setRoles(Array.isArray(json) ? json : json.content || []);
    } catch (err) {
      console.error('Error fetching roles', err);
    }
  };

  // =====================================
  // GET workers + enrich with names
  // =====================================
  const fetchWorkers = async () => {
    setLoading(true);
    setError(null);
    try {
      // fetch lists in parallel
      const [workersRes, levelsRes, schemesRes, rolesRes] = await Promise.all([
        fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS)),
        fetch(buildApiUrl(API_CONFIG.ENDPOINTS.LEVELS)),
        fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORK_SCHEDULE)),
        fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ROLES)),
      ]);

      // parse lists safely
      const workersJson = workersRes.ok ? await workersRes.json() : [];
      const levelsJson = levelsRes.ok ? await levelsRes.json() : [];
      const schemesJson = schemesRes.ok ? await schemesRes.json() : [];
      const rolesJson = rolesRes.ok ? await rolesRes.json() : [];

      const rawWorkers = Array.isArray(workersJson) ? workersJson : (workersJson.content || []);
      const lvls = Array.isArray(levelsJson) ? levelsJson : (levelsJson.content || []);
      const sch = Array.isArray(schemesJson) ? schemesJson : (schemesJson.content || []);
      const rls = Array.isArray(rolesJson) ? rolesJson : (rolesJson.content || []);

      // set auxiliary lists
      setLevels(lvls);
      setSchemes(sch);
      setRoles(rls);

      // build id->name map to resolve manager names
      const idNameMap: Record<number, string> = {};
      rawWorkers.forEach((rw: any) => {
        const wid = Number(rw.id ?? rw.worker);
        const wname = rw.name ?? rw.worker_name ?? rw.workerName ?? '';
        if (!Number.isNaN(wid)) idNameMap[wid] = wname;
      });

      // map workers into WorkerData
      const mapped: WorkerData[] = rawWorkers.map((w: any) => {
        // API may return different field names, handle common cases
        const id = w.id ?? w.worker ?? null;
        const name = w.name ?? w.worker_name ?? w.workerName ?? '';
        const status = typeof w.status === 'boolean' ? w.status : (w.status === 1 || w.status === '1');
        const level_id = w.level_id ?? w.levelId ?? null;
        const scheme_id = w.scheme_id ?? w.schemeId ?? null;
        const role_id = w.role_id ?? w.roleId ?? w.role ?? null;
        const employee_code = w.employee_code ?? w.employeeCode ?? undefined;
        const hire_date = w.hire_date ?? w.hireDate ?? null;
        const termination_date = w.termination_date ?? w.terminationDate ?? null;
        const active = typeof w.active === 'boolean' ? w.active : (w.active === 1 || w.active === '1');
        const manager_id = w.manager_id ?? w.managerId ?? w.manager ?? null;
        const createdAt = w.createdAt ?? w.created_at ?? undefined;
        const updatedAt = w.updatedAt ?? w.updated_at ?? undefined;

        const levelName = level_id ? (lvls.find((x: any) => x.id === level_id)?.name ?? String(level_id)) : undefined;
        const schemeName = scheme_id ? (sch.find((x: any) => x.id === scheme_id)?.name ?? String(scheme_id)) : undefined;
        const roleName = role_id ? (rls.find((x: any) => x.id === role_id)?.name ?? String(role_id)) : undefined;
        const managerName = manager_id ? (idNameMap[Number(manager_id)] ?? String(manager_id)) : undefined;

        return {
          id: Number(id),
          name,
          email: w.email ?? undefined,
          phone: w.phone ?? undefined,
          status: status ?? false,
          location: w.location ?? undefined,
          description: w.description ?? undefined,
          employee_code,
          hire_date,
          termination_date,
          active,
          level_id,
          scheme_id,
          role_id,
          manager_id,
          managerName,
          createdAt,
          updatedAt,
          levelName,
          schemeName,
          roleName,
        } as WorkerData;
      });

      setData(mapped);
      // populate managers list (allow selecting another worker as manager)
      setManagers(mapped.map(m => ({ id: m.id, name: m.name })));
    } catch (e) {
      console.error('Error cargando workers:', e);
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  // Obtener un trabajador específico por ID
  const getWorkerById = async (id: number): Promise<WorkerData | null> => {
    try {
      const res = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS));
      if (!res.ok) return null;
      const json = await res.json();
      const raw = Array.isArray(json) ? json : (json.content || []);
      const found = raw.find((w: any) => Number(w.id ?? w.worker) === id);
      if (!found) return null;

      // enrich with names using current lists
      const level_id = found.level_id ?? found.levelId ?? null;
      const scheme_id = found.scheme_id ?? found.schemeId ?? null;
      const role_id = found.role_id ?? found.roleId ?? found.role ?? null;
      const employee_code = found.employee_code ?? found.employeeCode ?? undefined;
      const hire_date = found.hire_date ?? found.hireDate ?? null;
      const termination_date = found.termination_date ?? found.terminationDate ?? null;
      const active = typeof found.active === 'boolean' ? found.active : (found.active === 1 || found.active === '1');
      const manager_id = found.manager_id ?? found.managerId ?? found.manager ?? null;
      const createdAt = found.createdAt ?? found.created_at ?? undefined;
      const updatedAt = found.updatedAt ?? found.updated_at ?? undefined;

      const worker: WorkerData = {
        id: Number(found.id ?? found.worker),
        name: found.name ?? found.worker_name ?? '',
        email: found.email ?? undefined,
        phone: found.phone ?? undefined,
        status: typeof found.status === 'boolean' ? found.status : (found.status === 1 || found.status === '1'),
        location: found.location ?? undefined,
        description: found.description ?? undefined,
        employee_code,
        hire_date,
        termination_date,
        active,
        level_id,
        scheme_id,
        role_id,
        manager_id,
        managerName: manager_id ? (data.find(l => l.id === manager_id)?.name ?? String(manager_id)) : undefined,
        createdAt,
        updatedAt,
        levelName: level_id ? (levels.find(l => l.id === level_id)?.name ?? String(level_id)) : undefined,
        schemeName: scheme_id ? (schemes.find(s => s.id === scheme_id)?.name ?? String(scheme_id)) : undefined,
        roleName: role_id ? (roles.find(r => r.id === role_id)?.name ?? String(role_id)) : undefined,
      };

      return worker;
    } catch (error) {
      console.error('Error fetching worker:', error);
      return null;
    }
  };

  // Crear un nuevo trabajador
  const createWorker = async (payload: WorkerPayload): Promise<WorkerData | null> => {
    try {
      const body = {
        name: payload.name,
        email: payload.email ?? '',
        phone: payload.phone ?? '',
        status: payload.status,
        location: payload.location ?? '',
        description: payload.description ?? '',
        level_id: payload.level_id ?? null,
        scheme_id: payload.scheme_id ?? null,
        role_id: payload.role_id ?? null,
        // new fields
        employee_code: (payload as any).employee_code ?? undefined,
        hire_date: (payload as any).hire_date ?? null,
        termination_date: (payload as any).termination_date ?? null,
        active: (payload as any).active ?? true,
        manager_id: (payload as any).manager_id ?? null,
      };

      const response = await axios.post(
        buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS),
        body,
        { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
      );

      // refetch
      await fetchWorkers();
      return response.data;
    } catch (error) {
      console.error('Error creating worker:', error);
      return null;
    }
  };

  // Actualizar un trabajador
  const updateWorker = async (id: number, payload: WorkerPayload): Promise<boolean> => {
    try {
      const body = {
        name: payload.name,
        email: payload.email ?? '',
        phone: payload.phone ?? '',
        status: payload.status,
        location: payload.location ?? '',
        description: payload.description ?? '',
        level_id: payload.level_id ?? null,
        scheme_id: payload.scheme_id ?? null,
        role_id: payload.role_id ?? null,
        // new fields
        employee_code: (payload as any).employee_code ?? undefined,
        hire_date: (payload as any).hire_date ?? null,
        termination_date: (payload as any).termination_date ?? null,
        active: (payload as any).active ?? true,
        manager_id: (payload as any).manager_id ?? null,
      };

      await axios.put(
        `${buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS)}/${id}`,
        body,
        { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
      );

      await fetchWorkers();
      return true;
    } catch (error) {
      console.error('Error updating worker:', error);
      return false;
    }
  };

  // Eliminar múltiples workers
  const deleteWorkers = async (ids: string[]) => {
    if (ids.length === 0) return false;
    setDeleting(true);
    try {
      for (const id of ids) {
        const res = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.WORKERS)}/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error(`Failed to delete id=${id} status=${res.status}`);
      }
      await fetchWorkers();
      return true;
    } catch (err) {
      console.error('Error deleting workers', err);
      return false;
    } finally {
      setDeleting(false);
    }
  };

  // Carga inicial de workers y catálogos relacionados
  useEffect(() => {
    fetchWorkers();
  }, []);

  return {
    data,
    loading,
    error,
    deleting,
    levels,
    schemes,
    roles,
    managers,
    fetchWorkers,
    fetchLevels,
    fetchSchemes,
    fetchRoles,
    getWorkerById,
    createWorker,
    updateWorker,
    deleteWorkers,
  };
}
