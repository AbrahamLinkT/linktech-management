"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody } from "@/components/containers/containers";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useClients } from "@/hooks/useClients";
import { useState } from "react";

export default function NewClient() {
  const router = useRouter();
  const { createClient, loading, error } = useClients();

  const [form, setForm] = useState({
    clientName: "",
    shortName: "",
    clientCode: "",
    contactEmail: "",
    contactPhone: "",
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
    router.push("/dashboard/client");
  };

  const validate = (values: typeof form) => {
    const errs: { [k: string]: string } = {};
    const clientName = values.clientName?.trim();
    const shortName = values.shortName?.trim();
    const clientCode = values.clientCode?.trim();
    const email = values.contactEmail?.trim();

    if (!clientName) errs.clientName = "El nombre es requerido";
    else if (clientName.length < 3) errs.clientName = "Mínimo 3 caracteres";
    else if (clientName.length > 250) errs.clientName = "Máximo 250 caracteres";

    if (!shortName) errs.shortName = "El nombre corto es requerido";
    else if (shortName.length > 100) errs.shortName = "Máximo 100 caracteres";

    if (!clientCode) errs.clientCode = "El código es requerido";
    else if (clientCode.length > 50) errs.clientCode = "Máximo 50 caracteres";

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.contactEmail = "Email inválido";
    }

    return errs;
  };

  const handleChange = (field: string, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    const v = validate(updated);
    setErrors((prev) => ({ ...prev, [field]: v[field] }));
  };

  const handleBlur = (field: string) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    setTouched({
      clientName: true,
      shortName: true,
      clientCode: true,
      contactEmail: true,
      contactPhone: true,
    });
    if (Object.keys(v).length > 0) return;

    const payload = {
      client_name: form.clientName.trim(),
      short_name: form.shortName.trim(),
      client_code: form.clientCode.trim(),
      contact_email: form.contactEmail.trim() || undefined,
      contact_phone: form.contactPhone.trim() || undefined,
      active: true,
    };

    const ok = await createClient(payload);

    if (ok) router.push("/dashboard/client");
  };

  return (
    <ContentBody
      title="Nuevo cliente"
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
        <h2 className="text-2xl font-bold mb-6 ml-4">Cliente</h2>

        <form
          className="space-y-10 ml-4 mr-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <fieldset className="border border-gray-400 rounded-xl p-4">
            <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">
              Datos del cliente
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium mb-1">
                  Nombre del Cliente <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.clientName}
                  onChange={(e) => handleChange("clientName", e.target.value)}
                  onBlur={() => handleBlur("clientName")}
                  aria-invalid={!!errors.clientName}
                  aria-describedby={
                    errors.clientName ? "err-clientName" : undefined
                  }
                  maxLength={250}
                />
                {touched.clientName && errors.clientName && (
                  <p
                    id="err-clientName"
                    className="text-red-600 text-sm mt-1"
                  >
                    {errors.clientName}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Nombre Corto <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.shortName}
                  onChange={(e) => handleChange("shortName", e.target.value)}
                  onBlur={() => handleBlur("shortName")}
                  aria-invalid={!!errors.shortName}
                  aria-describedby={errors.shortName ? "err-shortName" : undefined}
                  maxLength={100}
                />
                {touched.shortName && errors.shortName && (
                  <p
                    id="err-shortName"
                    className="text-red-600 text-sm mt-1"
                  >
                    {errors.shortName}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Código del Cliente <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  className={stylesInput}
                  value={form.clientCode}
                  onChange={(e) => handleChange("clientCode", e.target.value)}
                  onBlur={() => handleBlur("clientCode")}
                  aria-invalid={!!errors.clientCode}
                  aria-describedby={
                    errors.clientCode ? "err-clientCode" : undefined
                  }
                  maxLength={50}
                  placeholder="Ej: LT-001"
                />
                {touched.clientCode && errors.clientCode && (
                  <p
                    id="err-clientCode"
                    className="text-red-600 text-sm mt-1"
                  >
                    {errors.clientCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Email de Contacto
                </label>
                <input
                  type="email"
                  className={stylesInput}
                  value={form.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  onBlur={() => handleBlur("contactEmail")}
                  aria-invalid={!!errors.contactEmail}
                  aria-describedby={
                    errors.contactEmail ? "err-contactEmail" : undefined
                  }
                  maxLength={250}
                  placeholder="email@ejemplo.com"
                />
                {touched.contactEmail && errors.contactEmail && (
                  <p
                    id="err-contactEmail"
                    className="text-red-600 text-sm mt-1"
                  >
                    {errors.contactEmail}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Teléfono de Contacto
                </label>
                <input
                  type="tel"
                  className={stylesInput}
                  value={form.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  onBlur={() => handleBlur("contactPhone")}
                  maxLength={30}
                  placeholder="81 1234 5678"
                />
              </div>
            </div>
          </fieldset>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>

          {error && <p className="text-red-600">Error: {error}</p>}
        </form>
      </div>
    </ContentBody>
  );
}

