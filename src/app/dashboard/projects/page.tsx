"use client";

import { Btn_data } from "@/components/buttons/buttons";
import { ContentBody, ContentTable, ContentTrasition } from "@/components/containers/containers";
import { SearchWorkers } from "@/components/filters/filters";
import ConfirmModal, { PanelLateral } from "@/components/modal/modals";
import { Table_3 } from "@/components/tables/table";

import Proj from "@/data/Projects.json";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Projects() {
  const [isPanelOpen, setIstPanelOpen] = useState(false);
  const [isProyect, setIsProyect] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false);


  const router = useRouter()
  const togglePanel = () => {
    setIstPanelOpen(!isPanelOpen)
  }
  const handleClick = () => {
    setShowModal(true);
  };
  const handleConfirm = () => {
    setShowModal(false);
    router.push(`/dashboard/project?id=${isProyect}`);
  };

  const handleCancel = () => {
    setShowModal(false);
  };


  const stylesInput = `
        w-full border border-gray-600 rounded px-3 py-1
        hover:border-blue-600 
        focus:border-blue-500 
        focus:ring-2 focus:ring-blue-300 
        focus:outline-none
    `;
  return (
    <ContentTrasition
      IspanelOpen={isPanelOpen ? togglePanel : undefined}
      body={
        <ContentBody
          title="Proyectos">
          <ContentTable
            header={
              <div className="flex">
                <SearchWorkers />
                <Btn_data
                  text={"Nuevo Proyecto"} styles="mb-2 whitespace-nowrap rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white"
                  Onclick={togglePanel}
                />
              </div>
            }
            Body={
              <>
                <Table_3
                  headers={["Orden Interna", "Empresa", "Cliente", "Descripcion", "Fechas", "Estatus", "Responsable"]}
                  rows={Proj.proyectos.map((p) => [p.ordenInterna, p.titulo, p.cliente, p.descripcion, `${p.fechaIn} - ${p.fechaFn}`, p.estatus, p.responsable])}
                  EventOnclick={(index) => {
                    const id = Proj.proyectos[index].id;
                    setIsProyect(id)
                    handleClick()
                  }}
                />
                <ConfirmModal
                  isOpen={showModal}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                  message="¿Deseas salir de Proyectos? Se perderán los cambios no guardados."
                />
              </>

            }
          />
        </ContentBody>
      }

      /* panel lateral */
      panel={
        <PanelLateral
          Open={isPanelOpen}
          close={togglePanel}
          title="Creacion de nuevo proyecto"
          content={
            <>
              <div>
                <form action="">
                  {/* seccion de informacion del cliente */}
                  <fieldset className="border border-gray-400 rounded-xl p-4 mb-1">
                    <legend className="text-lg font-semibold px-2 ml-2 mt-4">
                      Proyecto
                    </legend>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="OI" className="block font-medium mb-1">OI</label>
                        <input type="text" className={stylesInput} id="OI" name="OI" />
                      </div>
                      <div>
                        <label htmlFor="Empresa" className="block font-medium mb-1">Empresa</label>
                        <input type="text" className={stylesInput} name="Empresa" id="Empresa" />
                      </div>
                      <div>
                        <label htmlFor="proyecto" className="block font-medium mb-1">Proyecto</label>
                        <input type="text" className={stylesInput} name="proyecto" id="proyecto" />
                      </div>

                      {/* Cliente como opción */}
                      <div>
                        <label htmlFor="cliente" className="block font-medium mb-1">Cliente</label>
                        <select id="cliente" name="cliente" className={stylesInput}>
                          <option value="">Selecciona un cliente</option>
                          <option value="cliente1">Cliente 1</option>
                          <option value="cliente2">Cliente 2</option>
                          <option value="cliente3">Cliente 3</option>
                        </select>
                      </div>

                      {/* Fecha inicio como calendario */}
                      <div>
                        <label htmlFor="fechIn" className="block font-medium mb-1">Fecha Inicio</label>
                        <input type="date" className={stylesInput} name="fechIn" id="fechIn" />
                      </div>

                      {/* Fecha final como calendario */}
                      <div>
                        <label htmlFor="fechFn" className="block font-medium mb-1">Fecha Final</label>
                        <input type="date" className={stylesInput} name="fechFn" id="fechFn" />
                      </div>

                      {/* Responsable como opción */}
                      <div>
                        <label htmlFor="responsable" className="block font-medium mb-1">Responsable</label>
                        <select id="responsable" name="responsable" className={stylesInput}>
                          <option value="">Selecciona un responsable</option>
                          <option value="juan">Juan Pérez</option>
                          <option value="ana">Ana García</option>
                          <option value="luis">Luis Martínez</option>
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="descripcion" className="block font-medium mb-1">Descripción</label>
                        <textarea
                          name="descripcion"
                          id="descripcion"
                          placeholder="Ej. Descripción detallada del proyecto..."
                          className="w-full border border-gray-600 
                resize-none rounded px-3 py-1
                hover:border-blue-600 
                focus:border-blue-500 
                focus:ring-2 focus:ring-blue-300 
                focus:outline-none"
                        ></textarea>
                      </div>
                    </div>
                  </fieldset>

                  {/* Botón de guardar */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded"
                    >
                      Registrar
                    </button>
                  </div>
                </form>
              </div>
            </>

          }
        />
      }

    />
    /* final de trasition */
  );
}
