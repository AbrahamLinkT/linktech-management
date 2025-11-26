"use client";"use client";"use client";



import { useState, useEffect } from "react";

import { Btn_data } from "@/components/buttons/buttons";

import { ContentBody } from "@/components/containers/containers";import { useState, useEffect } from "react";import { useState, useEffect } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { useAsuetos } from "@/hooks/useAsuetos";import { Btn_data } from "@/components/buttons/buttons";import { Btn_data } from "@/components/buttons/buttons";

import { useAutoLoadEmployees } from "@/hooks/useEmployees";

import { ContentBody } from "@/components/containers/containers";import { ContentBody } from "@/components/containers/containers";

interface FormData {

  employee_id: number | null;import { useRouter, useSearchParams } from "next/navigation";import { ArrowLeft } from "lucide-react";

  startDate: string;

  endDate: string;import { useAsuetos } from "@/hooks/useAsuetos";import { useRouter, useSearchParams } from "next/navigation";

}

import { useAutoLoadEmployees } from "@/hooks/useEmployees";import { useAsuetos } from "@/hooks/useAsuetos";

export default function Edit() {

    const router = useRouter();import { useAutoLoadEmployees } from "@/hooks/useEmployees";

    const searchParams = useSearchParams();

    const asuetoId = searchParams.get('id');interface FormData {

    

    const { updateAsueto, getAsuetos, isLoading, error } = useAsuetos();  employee_id: number | null;interface FormData {

    const { employees, isLoading: employeesLoading } = useAutoLoadEmployees();

      startDate: string;  employee_id: number | null;

    const [formData, setFormData] = useState<FormData>({

        employee_id: null,  endDate: string;  startDate: string;

        startDate: '',

        endDate: ''}  endDate: string;

    });

}

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [isLoadingData, setIsLoadingData] = useState(true);export default function Edit() {



    const stylesInput = `    const router = useRouter();export default function Edit() {

        w-full border border-gray-600 rounded px-3 py-2 

        hover:border-blue-600     const searchParams = useSearchParams();    const router = useRouter();

        focus:border-blue-500 

        focus:ring-2 focus:ring-blue-300     const asuetoId = searchParams.get('id');    const searchParams = useSearchParams();

        focus:outline-none

    `;        const asuetoId = searchParams.get('id');



    // Cargar datos del asueto a editar    const { updateAsueto, getAsuetos, isLoading, error } = useAsuetos();    

    useEffect(() => {

        const loadAsuetoData = async () => {    const { employees, isLoading: employeesLoading } = useAutoLoadEmployees();    const { updateAsueto, getAsuetos, isLoading, error } = useAsuetos();

            if (!asuetoId) {

                console.error('No se proporcionó ID para editar');        const { employees, isLoading: employeesLoading } = useAutoLoadEmployees();

                router.push("/dashboard/asuetos");

                return;    const [formData, setFormData] = useState<FormData>({    

            }

        employee_id: null,    const [formData, setFormData] = useState<FormData>({

            try {

                setIsLoadingData(true);        startDate: '',        employee_id: null,

                const asuetos = await getAsuetos();

                const asueto = asuetos.find(a => a.id === asuetoId);        endDate: ''        startDate: '',

                

                if (asueto) {    });        endDate: ''

                    const startDate = new Date(asueto.startDate).toISOString().split('T')[0];

                    const endDate = new Date(asueto.endDate).toISOString().split('T')[0];    });

                    

                    setFormData({    const [successMessage, setSuccessMessage] = useState<string | null>(null);

                        employee_id: asueto.employee_id,

                        startDate: startDate,    const [isLoadingData, setIsLoadingData] = useState(true);    const [successMessage, setSuccessMessage] = useState<string | null>(null);

                        endDate: endDate

                    });    const [isLoadingData, setIsLoadingData] = useState(true);

                } else {

                    console.error('Asueto no encontrado');    const stylesInput = `

                    router.push("/dashboard/asuetos");

                }        w-full border border-gray-600 rounded px-3 py-2     const stylesInput = `

            } catch (error) {

                console.error('Error cargando asueto:', error);        hover:border-blue-600         w-full border border-gray-600 rounded px-3 py-2 

                router.push("/dashboard/asuetos");

            } finally {        focus:border-blue-500         hover:border-blue-600 

                setIsLoadingData(false);

            }        focus:ring-2 focus:ring-blue-300         focus:border-blue-500 

        };

        focus:outline-none        focus:ring-2 focus:ring-blue-300 

        loadAsuetoData();

    }, [asuetoId, getAsuetos, router]);    `;        focus:outline-none

    

    const handleClickRoute = () => {    `;

        router.push("/dashboard/asuetos");

    };    // Cargar datos del asueto a editar



    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {    useEffect(() => {    // Cargar datos del asueto a editar

        const { name, value } = e.target;

        setFormData(prev => ({        const loadAsuetoData = async () => {    useEffect(() => {

            ...prev,

            [name]: name === 'employee_id'             if (!asuetoId) {        const loadAsuetoData = async () => {

                ? (value === '' ? null : parseInt(value))

                : value                console.error('No se proporcionó ID para editar');            if (!asuetoId) {

        }));

    };                router.push("/dashboard/asuetos");                console.error('No se proporcionó ID para editar');



    const handleSubmit = async (e: React.FormEvent) => {                return;                router.push("/dashboard/asuetos");

        e.preventDefault();

                    }                return;

        if (!asuetoId) {

            console.error('No se puede actualizar: ID no disponible');            }

            return;

        }            try {



        if (!formData.employee_id || !formData.startDate || !formData.endDate) {                setIsLoadingData(true);            try {

            alert('Por favor complete todos los campos obligatorios');

            return;                const asuetos = await getAsuetos();                setIsLoadingData(true);

        }

                const asueto = asuetos.find(a => a.id === asuetoId);                const asuetos = await getAsuetos();

        try {

            const startDateTime = new Date(formData.startDate + 'T00:00:00').toISOString();                                const asueto = asuetos.find(a => a.id === asuetoId);

            const endDateTime = new Date(formData.endDate + 'T23:59:59').toISOString();

                if (asueto) {                

            const asuetoData = {

                employee_id: formData.employee_id,                    // Convertir las fechas ISO a formato YYYY-MM-DD para el input                if (asueto) {

                startDate: startDateTime,

                endDate: endDateTime                    const startDate = new Date(asueto.startDate).toISOString().split('T')[0];                    // Convertir las fechas ISO a formato YYYY-MM-DD para el input

            };

                    const endDate = new Date(asueto.endDate).toISOString().split('T')[0];                    const startDate = new Date(asueto.startDate).toISOString().split('T')[0];

            console.log('Asueto data to be updated:', asuetoData);

            console.log('Asueto ID:', asuetoId);                                        const endDate = new Date(asueto.endDate).toISOString().split('T')[0];



            const result = await updateAsueto(asuetoId, asuetoData);                    setFormData({                    

            

            if (result.success) {                        employee_id: asueto.employee_id,                    setFormData({

                setSuccessMessage('Asueto actualizado exitosamente');

                                        startDate: startDate,                        employee_id: asueto.employee_id,

                setTimeout(() => {

                    router.push("/dashboard/asuetos");                        endDate: endDate                        startDate: startDate,

                }, 2000);

            }                    });                        endDate: endDate

        } catch (error) {

            console.error('Error in form submission:', error);                } else {                    });

        }

    };                    console.error('Asueto no encontrado');                } else {



    if (isLoadingData || employeesLoading) {                    router.push("/dashboard/asuetos");                    console.error('Asueto no encontrado');

        return (

            <ContentBody title="Editar asueto">                }                    router.push("/dashboard/asuetos");

                <div className="flex justify-center items-center h-40">

                    <p>Cargando datos del asueto...</p>            } catch (error) {                }

                </div>

            </ContentBody>                console.error('Error cargando asueto:', error);            } catch (error) {

        );

    }                router.push("/dashboard/asuetos");                console.error('Error cargando asueto:', error);

    

    return (            } finally {                router.push("/dashboard/asuetos");

        <ContentBody title="Editar asueto"

            btnReg={                setIsLoadingData(false);            } finally {

                <Btn_data

                    icon={<span>←</span>}            }                setIsLoadingData(false);

                    text={"Regresar"}

                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"        };            }

                    click={handleClickRoute}

                />        };

            }

        >        loadAsuetoData();

            {successMessage && (

                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">    }, [asuetoId, getAsuetos, router]);        loadAsuetoData();

                    {successMessage}

                </div>        }, [asuetoId, getAsuetos, router]);

            )}

                const handleClickRoute = () => {    

            {error && (

                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">        router.push("/dashboard/asuetos");    const handleClickRoute = () => {

                    Error: {error}

                </div>    };        router.push("/dashboard/asuetos");

            )}

    };

            <div className="border-gray-400 rounded-xl border p-2">

                <form className="space-y-10 ml-4 mr-4" onSubmit={handleSubmit}>    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

                    <fieldset className="border border-gray-400 rounded-xl p-4" >

                        <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">        const { name, value } = e.target;    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {

                            Editar día asueto

                        </legend>        setFormData(prev => ({        const { name, value } = e.target;

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div>            ...prev,        setFormData(prev => ({

                                <label htmlFor="empleado" className="block font-medium mb-1">

                                    Empleado *            [name]: name === 'employee_id'             ...prev,

                                </label>

                                <select                 ? (value === '' ? null : parseInt(value))            [name]: name === 'employee_id' 

                                    name="employee_id" 

                                    id="empleado"                 : value                ? (value === '' ? null : parseInt(value))

                                    value={formData.employee_id || ''}

                                    onChange={handleInputChange}        }));                : value

                                    className={stylesInput}

                                    required    };        }));

                                >

                                    <option value="">Seleccione empleado</option>    };

                                    {employees.map((employee) => (

                                        <option key={employee.id} value={employee.id}>    const handleSubmit = async (e: React.FormEvent) => {

                                            {employee.name}

                                        </option>        e.preventDefault();    const handleSubmit = async (e: React.FormEvent) => {

                                    ))}

                                </select>                e.preventDefault();

                            </div>

        if (!asuetoId) {        

                            <div>

                                <label htmlFor="startDate" className="block font-medium mb-1">            console.error('No se puede actualizar: ID no disponible');        if (!asuetoId) {

                                    Fecha inicio *

                                </label>            return;            console.error('No se puede actualizar: ID no disponible');

                                <input 

                                    type="date"         }            return;

                                    id="startDate" 

                                    name="startDate"        }

                                    value={formData.startDate}

                                    onChange={handleInputChange}        if (!formData.employee_id || !formData.startDate || !formData.endDate) {

                                    className={stylesInput}

                                    required            alert('Por favor complete todos los campos obligatorios');        if (!formData.employee_id || !formData.startDate || !formData.endDate) {

                                />

                            </div>            return;            alert('Por favor complete todos los campos obligatorios');



                            <div>        }            return;

                                <label htmlFor="endDate" className="block font-medium mb-1">

                                    Fecha fin *        }

                                </label>

                                <input         try {

                                    type="date" 

                                    id="endDate"             // Formatear las fechas a ISO string con hora        try {

                                    name="endDate"

                                    value={formData.endDate}            const startDateTime = new Date(formData.startDate + 'T00:00:00').toISOString();            // Formatear las fechas a ISO string con hora

                                    onChange={handleInputChange}

                                    className={stylesInput}            const endDateTime = new Date(formData.endDate + 'T23:59:59').toISOString();            const startDateTime = new Date(formData.startDate + 'T00:00:00').toISOString();

                                    required

                                />            const endDateTime = new Date(formData.endDate + 'T23:59:59').toISOString();

                            </div>

                        </div>            const asuetoData = {

                    </fieldset>

                employee_id: formData.employee_id,            const asuetoData = {

                    <div className="flex justify-center pb-4">

                        <button                startDate: startDateTime,                employee_id: formData.employee_id,

                            type="submit"

                            disabled={isLoading}                endDate: endDateTime                startDate: startDateTime,

                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"

                        >            };                endDate: endDateTime

                            {isLoading ? 'Actualizando...' : 'Actualizar Asueto'}

                        </button>            };

                    </div>

                </form>            console.log('Asueto data to be updated:', asuetoData);

            </div>

        </ContentBody>            console.log('Asueto ID:', asuetoId);            console.log('Asueto data to be updated:', asuetoData);

    );

}            console.log('Asueto ID:', asuetoId);

            const result = await updateAsueto(asuetoId, asuetoData);

                        const result = await updateAsueto(asuetoId, asuetoData);

            if (result.success) {            

                setSuccessMessage('Asueto actualizado exitosamente');            if (result.success) {

                                setSuccessMessage('Asueto actualizado exitosamente');

                // Redirect after 2 seconds                

                setTimeout(() => {                // Redirect after 2 seconds

                    router.push("/dashboard/asuetos");                setTimeout(() => {

                }, 2000);                    router.push("/dashboard/asuetos");

            }                }, 2000);

        } catch (error) {            }

            console.error('Error in form submission:', error);        } catch (error) {

        }            console.error('Error in form submission:', error);

    };        }

    };

    // Mostrar loading mientras se cargan los datos

    if (isLoadingData || employeesLoading) {    // Mostrar loading mientras se cargan los datos

        return (    if (isLoadingData || employeesLoading) {

            <ContentBody title="Editar asueto">        return (

                <div className="flex justify-center items-center h-40">            <ContentBody title="Editar asueto">

                    <p>Cargando datos del asueto...</p>                <div className="flex justify-center items-center h-40">

                </div>                    <p>Cargando datos del asueto...</p>

            </ContentBody>                </div>

        );            </ContentBody>

    }        );

        }

    return (        const fecha = new Date(e.target.value);

        <ContentBody title="Editar asueto"        const dia = fecha.getDay(); // 0 = domingo, 6 = sábado

            btnReg={        if (dia === 0 || dia === 6) {

                <Btn_data            alert("No se permiten sábados ni domingos");

                    icon={<span>←</span>}            e.target.value = ""; // limpia el input

                    text={"Regresar"}        }

                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"    }

                    click={handleClickRoute}    return (

                />        <ContentBody title="Editar asueto"

            }            btnReg={

        >                <Btn_data

            {successMessage && (                    icon={<ArrowLeft />}

                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">                    text={"Regresar"}

                    {successMessage}                    styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"

                </div>                    Onclick={handleClickRoute}

            )}                />

                        }>

            {error && (            <div className="m-1">

                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">                <h2 className="text-2xl font-bold mb-6 ml-4">Editar días de asueto</h2>

                    Error: {error}                <form className="space-y-10 ml-4 mr-4">

                </div>

            )}                    <fieldset className="border border-gray-400 rounded-xl p-4" >

                        <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">

            <div className="border-gray-400 rounded-xl border p-2">                            Asignacion de dia asueto

                <form className="space-y-10 ml-4 mr-4" onSubmit={handleSubmit}>                        </legend>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    <fieldset className="border border-gray-400 rounded-xl p-4" >                            <div>

                        <legend className="text-lg font-semibold px-2 ml-2 mt-4 bg-white">                                <label htmlFor="nombre" className="block font-medium mb-1">

                            Editar día asueto                                    Empleado

                        </legend>                                </label>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">                                <div className="flex items-center gap-4">

                            <div>                                    <select name="empleado" id="empleado" className={stylesInput}>

                                <label htmlFor="empleado" className="block font-medium mb-1">                                        <option value="">Seleccione empleado</option>

                                    Empleado *                                        <option value="activo">Jazmin</option>

                                </label>                                        <option value="inactivo">Ivan</option>

                                <div className="flex items-center gap-4">                                    </select>

                                    <select                                 </div>

                                        name="employee_id"                             </div>

                                        id="empleado" 

                                        value={formData.employee_id || ''}                            <div>

                                        onChange={handleInputChange}                                <label htmlFor="correo" className="block font-medium mb-1">

                                        className={stylesInput}                                    Fecha inicio

                                        required                                </label>

                                    >                                <input type="date" id="fechaInicio" name="fechaInicio"

                                        <option value="">Seleccione empleado</option>                                    className={stylesInput}

                                        {employees.map((employee) => (                                    onChange={date} />

                                            <option key={employee.id} value={employee.id}>                            </div>

                                                {employee.name}                            <div>

                                            </option>                                <label htmlFor="correo" className="block font-medium mb-1">

                                        ))}                                    Fecha final

                                    </select>                                </label>

                                </div>                                <input type="date" id="fechaFinal" name="fechaFinal" className={stylesInput} onChange={date} />

                            </div>                            </div>

                            <div>

                            <div>                                <label htmlFor="tiempo" className="block font-medium mb-1">Tiempo</label>

                                <label htmlFor="startDate" className="block font-medium mb-1">                                <div className="flex items-center gap-4">

                                    Fecha inicio *                                    <select name="tiempo" id="tiempo" className={stylesInput}>

                                </label>                                        <option value="">Seleccione su opción</option>

                                <input                                         <option value="activo">completo</option>

                                    type="date"                                         <option value="inactivo">medio tiempo</option>

                                    id="startDate"                                     </select>

                                    name="startDate"                                </div>

                                    value={formData.startDate}                            </div>

                                    onChange={handleInputChange}                            <div className="col-span-2">

                                    className={stylesInput}                                <label htmlFor="descripcion" className="block font-medium mb-1">

                                    required                                    Descripcion

                                />                                </label>

                            </div>                                <input type="text" id="descripcion" name="descripcion" className={stylesInput} />

                            </div>

                            <div>                        </div>

                                <label htmlFor="endDate" className="block font-medium mb-1">                    </fieldset>

                                    Fecha fin *

                                </label>                    <div className="flex justify-end">

                                <input                         <button

                                    type="date"                             type="submit"

                                    id="endDate"                             className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"

                                    name="endDate"                        >

                                    value={formData.endDate}                            Guardar

                                    onChange={handleInputChange}                        </button>

                                    className={stylesInput}                    </div>

                                    required                </form>

                                />            </div>

                            </div>        </ContentBody>

                        </div>    );

                    </fieldset>}


                    <div className="flex justify-center pb-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {isLoading ? 'Actualizando...' : 'Actualizar Asueto'}
                        </button>
                    </div>
                </form>
            </div>
        </ContentBody>
    );
}