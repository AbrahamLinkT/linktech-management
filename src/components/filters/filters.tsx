export function FilterStaff({ showFilters }: { showFilters: boolean }) {
    return (
        <>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    showFilters ? "mb-6 max-h-[1000px] opacity-100" : "mb-0 max-h-0 opacity-0"
                }`}
            >
                <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                    <p className="mb-3 text-lg font-semibold text-gray-700 dark:text-gray-100">Filtros</p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Consultor:</label>
                            <input
                                type="text"
                                placeholder="Ej. Barra Vaz"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Especialidad:</label>
                            <input
                                type="text"
                                placeholder="Ej. SD"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Nivel:</label>
                            <input
                                type="text"
                                placeholder="Ej. Sr"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">Departamento:</label>
                            <input
                                type="text"
                                placeholder="Ej. Delivery"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-slate-700 dark:text-white"
                            />
                        </div>
                        <div className="col-span-full flex justify-end px-1.5">
                            <button className="mb-2 rounded-lg border border-gray-400 bg-transparent px-4 py-2 text-sm font-medium transition hover:bg-blue-400 hover:text-white">
                                Aceptar cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
