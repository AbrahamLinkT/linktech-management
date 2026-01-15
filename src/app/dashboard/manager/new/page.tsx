"use client";
import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUsuarios } from "@/hooks/useUsuarios";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ManagerNew() {
	const router = useRouter();
	const {
		departments,
		workers,
		createDepartmentHead,
		loading,
		error,
	} = useUsuarios();

	const [form, setForm] = useState({
		id_department: "",
		id_worker: "",
		start_date: "",
		end_date: "",
		active: true,
	});

	const [errors, setErrors] = useState<{ [k: string]: string }>({});
	const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

	const stylesInput = `
		w-full border border-gray-600 rounded px-3 py-2 
		hover:border-blue-600 
		focus:border-blue-500 
		focus:ring-2 focus:ring-blue-300 
		focus:outline-none
	`;

	const handleClickRoute = () => {
		router.push("/dashboard/manager");
	};

	const validate = (values: typeof form) => {
		const errs: { [k: string]: string } = {};
		if (!values.id_department) errs.id_department = "Selecciona un departamento";
		if (!values.id_worker) errs.id_worker = "Selecciona una persona";
		if (values.id_department && Number.isNaN(Number(values.id_department))) errs.id_department = "Departamento inválido";
		if (values.id_worker && Number.isNaN(Number(values.id_worker))) errs.id_worker = "Persona inválida";
		if (!values.start_date) errs.start_date = "Selecciona fecha de inicio";
		return errs;
	};

	const handleChange = (field: string, value: string) => {
		const updated = { ...form, [field]: value };
		setForm(updated);
		const v = validate(updated);
		setErrors((prev) => {
			const next = { ...prev };
			if (v[field]) {
				next[field] = v[field] as string;
			} else {
				delete next[field];
			}
			return next;
		});
	};

	const handleBlur = (field: string) => {
		setTouched((t) => ({ ...t, [field]: true }));
		const v = validate(form);
		setErrors(v);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const v = validate(form);
		setErrors(v);
		setTouched({ id_department: true, id_worker: true, start_date: true });
		if (Object.keys(v).length > 0) return;

		const payload = {
			id_department: Number(form.id_department),
			id_worker: Number(form.id_worker),
			start_date: form.start_date,
			end_date: form.end_date?.trim() ? form.end_date : null,
			active: form.active,
		};

		const ok = await createDepartmentHead(payload);
		if (ok) router.push("/dashboard/manager");
	};

	return (
		<ProtectedRoute requiredPermission="usuarios">
			<ContentBody
				title="Nuevo líder"
				btnReg={
					<Btn_data
						icon={<ArrowLeft />}
						text={"Regresar"}
						styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
						Onclick={handleClickRoute}
					/>
				}
			>
				<div className="m-1">
					<h2 className="text-2xl font-bold mb-6 ml-4">Líder de departamento</h2>
					<form className="space-y-10 ml-4 mr-4" onSubmit={handleSubmit} noValidate>
						<fieldset className="border border-gray-400 rounded-xl p-4">
							<legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
								Selección
							</legend>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label htmlFor="departamento" className="block font-medium mb-1">
										Departamento
									</label>
									<select
										id="departamento"
										className={stylesInput}
										value={form.id_department}
										onChange={(e) => handleChange("id_department", e.target.value)}
										onBlur={() => handleBlur("id_department")}
										aria-invalid={!!errors.id_department}
										aria-describedby={errors.id_department ? "err-departamento" : undefined}
									>
										<option value="">Selecciona un departamento</option>
										{departments.map((d) => (
											<option key={d.id} value={d.id}>
												{d.name}
											</option>
										))}
									</select>
									{touched.id_department && errors.id_department && (
										<p id="err-departamento" className="text-red-600 text-sm mt-1">{errors.id_department}</p>
									)}
								</div>

								<div>
									<label htmlFor="persona" className="block font-medium mb-1">
										Persona (Líder)
									</label>
									<select
										id="persona"
										className={stylesInput}
										value={form.id_worker}
										onChange={(e) => handleChange("id_worker", e.target.value)}
										onBlur={() => handleBlur("id_worker")}
										aria-invalid={!!errors.id_worker}
										aria-describedby={errors.id_worker ? "err-persona" : undefined}
									>
										<option value="">Selecciona una persona</option>
										{workers.map((w) => (
											<option key={w.id} value={w.id}>
												{w.name}
											</option>
										))}
									</select>
									{touched.id_worker && errors.id_worker && (
										<p id="err-persona" className="text-red-600 text-sm mt-1">{errors.id_worker}</p>
									)}
								</div>

								<div>
									<label htmlFor="start_date" className="block font-medium mb-1">
										Fecha de inicio
									</label>
									<input
										id="start_date"
										type="date"
										className={stylesInput}
										value={form.start_date}
										onChange={(e) => handleChange("start_date", e.target.value)}
										onBlur={() => handleBlur("start_date")}
										aria-invalid={!!errors.start_date}
										aria-describedby={errors.start_date ? "err-start_date" : undefined}
									/>
									{touched.start_date && errors.start_date && (
										<p id="err-start_date" className="text-red-600 text-sm mt-1">{errors.start_date}</p>
									)}
								</div>

								<div>
									<label htmlFor="end_date" className="block font-medium mb-1">
										Fecha de fin (opcional)
									</label>
									<input
										id="end_date"
										type="date"
										className={stylesInput}
										value={form.end_date}
										onChange={(e) => handleChange("end_date", e.target.value)}
									/>
								</div>

								<div className="col-span-1">
									<label className="block font-medium mb-1">Activo</label>
									<div className="flex items-center gap-3">
										<input
											id="active"
											type="checkbox"
											checked={form.active}
											onChange={(e) => setForm({ ...form, active: e.target.checked })}
										/>
										<span>Activo</span>
									</div>
								</div>
							</div>
						</fieldset>

						<div className="flex justify-end">
							<button
								type="submit"
								disabled={
									loading || Object.keys(validate(form)).length > 0
								}
								className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
							>
								{loading ? "Guardando..." : "Guardar"}
							</button>
						</div>

						{error && <p className="text-red-600">Error: {error}</p>}
					</form>
				</div>
			</ContentBody>
		</ProtectedRoute>
	);
}