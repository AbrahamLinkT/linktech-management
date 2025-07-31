"use client";
import React, { useState } from "react";
interface UserRole {
  email: string;
  rol: string;
}
const initialUsers: UserRole[] = [
  { email: "admin@empresa.com", rol: "Administrador" },
  { email: "consultor@empresa.com", rol: "Consultor" },
  { email: "cliente@empresa.com", rol: "Cliente" },
];
import { Pencil, Check, X, Plus } from "lucide-react";

interface Role {
  nombre: string;
  descripcion: string;
}

const initialRoles: Role[] = [
  { nombre: "Administrador", descripcion: "Acceso total a la plataforma y gestión de usuarios." },
  { nombre: "Consultor", descripcion: "Acceso a proyectos y registro de horas." },
  { nombre: "Cliente", descripcion: "Visualización de reportes y estado de proyectos." },
];

export default function RoleTable() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [form, setForm] = useState<Role>({ nombre: "", descripcion: "" });
  // Tabla de usuarios y roles
  const [users, setUsers] = useState<UserRole[]>(initialUsers);
  const [editUserIdx, setEditUserIdx] = useState<number | null>(null);
  const [editUserRole, setEditUserRole] = useState<string>("");

  const startEditUser = (idx: number) => {
    setEditUserIdx(idx);
    setEditUserRole(users[idx].rol);
  };

  const saveUserRole = (idx: number) => {
    const updated = [...users];
    updated[idx].rol = editUserRole;
    setUsers(updated);
    setEditUserIdx(null);
  };

  const cancelUserEdit = () => {
    setEditUserIdx(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.descripcion.trim()) return;
    setRoles([...roles, form]);
    setForm({ nombre: "", descripcion: "" });
  };


  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Role>({ nombre: "", descripcion: "" });

  const startEdit = (idx: number) => {
    setEditIdx(idx);
    setEditForm(roles[idx]);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = (idx: number) => {
    if (!editForm.nombre.trim() || !editForm.descripcion.trim()) return;
    const updated = [...roles];
    updated[idx] = editForm;
    setRoles(updated);
    setEditIdx(null);
  };

  const cancelEdit = () => {
    setEditIdx(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-8 flex flex-col gap-12">
      {/* Tabla de gestión de roles por correo */}
      <div>
        <h2 className="text-xl font-bold mb-4">Gestión de roles por cuenta</h2>
        <table className="w-full border-separate border-spacing-y-2 mb-10">
          <thead>
            <tr>
              <th className="text-left border-b-2 border-gray-200 pb-3 text-lg font-semibold w-2/5">Correo</th>
              <th className="text-left border-b-2 border-gray-200 pb-3 text-lg font-semibold w-2/5">Rol</th>
              <th className="text-left border-b-2 border-gray-200 pb-3 text-lg font-semibold w-1/5">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user.email} className="bg-gray-50 hover:bg-gray-100 transition">
                <td className="p-3 align-top text-base font-medium">{user.email}</td>
                <td className="p-3 align-top text-base">
                  {editUserIdx === idx ? (
                    <select
                      value={editUserRole}
                      onChange={e => setEditUserRole(e.target.value)}
                      className="border rounded px-3 py-2 w-full text-base focus:ring-2 focus:ring-blue-200"
                    >
                      {roles.map(r => (
                        <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
                      ))}
                    </select>
                  ) : (
                    user.rol
                  )}
                </td>
                <td className="p-3 align-top">
                  {editUserIdx === idx ? (
                    <div className="flex gap-2">
                      <button type="button" title="Guardar" className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center gap-1" onClick={() => saveUserRole(idx)}>
                        <Check size={18} /> Guardar
                      </button>
                      <button type="button" title="Cancelar" className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500 flex items-center gap-1" onClick={cancelUserEdit}>
                        <X size={18} /> Cancelar
                      </button>
                    </div>
                  ) : (
                    <button type="button" title="Editar" className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 flex items-center gap-1" onClick={() => startEditUser(idx)}>
                      <Pencil size={18} /> Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <table className="w-full border-separate border-spacing-y-2 mb-10">
        <thead>
          <tr>
            <th className="text-left border-b-2 border-gray-200 pb-3 text-lg font-semibold w-1/4">Nombre</th>
            <th className="text-left border-b-2 border-gray-200 pb-3 text-lg font-semibold w-2/4">Descripción</th>
            <th className="text-left border-b-2 border-gray-200 pb-3 text-lg font-semibold w-1/4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol, idx) => (
            <tr key={idx} className="bg-gray-50 hover:bg-gray-100 transition">
              {editIdx === idx ? (
                <>
                  <td className="p-3 align-top">
                    <input
                      name="nombre"
                      value={editForm.nombre}
                      onChange={handleEditChange}
                      className="border rounded px-3 py-2 w-full text-base focus:ring-2 focus:ring-blue-200"
                      required
                      autoFocus
                    />
                  </td>
                  <td className="p-3 align-top">
                    <input
                      name="descripcion"
                      value={editForm.descripcion}
                      onChange={handleEditChange}
                      className="border rounded px-3 py-2 w-full text-base focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </td>
                  <td className="p-3 flex gap-2 align-top">
                    <button type="button" title="Guardar" className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 flex items-center gap-1" onClick={() => saveEdit(idx)}>
                      <Check size={18} /> Guardar
                    </button>
                    <button type="button" title="Cancelar" className="bg-gray-400 text-white px-3 py-2 rounded hover:bg-gray-500 flex items-center gap-1" onClick={cancelEdit}>
                      <X size={18} /> Cancelar
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td className="p-3 align-top text-base font-medium">{rol.nombre}</td>
                  <td className="p-3 align-top text-base">{rol.descripcion}</td>
                  <td className="p-3 align-top">
                    <button type="button" title="Editar" className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 flex items-center gap-1" onClick={() => startEdit(idx)}>
                      <Pencil size={18} /> Editar
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col flex-1 min-w-[180px] max-w-[260px]">
          <label className="mb-1 font-semibold">Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full text-base focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <div className="flex flex-col flex-[2] min-w-[220px]">
          <label className="mb-1 font-semibold">Descripción</label>
          <input
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full text-base focus:ring-2 focus:ring-blue-200"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 w-full md:w-auto flex items-center gap-2 mt-2 md:mt-0">
          <Plus size={18} /> Agregar
        </button>
      </form>
    </div>
  );
}
