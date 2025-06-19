export function FilterOfProjects({ showFilters }: { showFilters: boolean }) {
  return (
    <div
      className={`transition-all duration-300 ease-in-out overflow-hidden ${
        showFilters
          ? "max-h-[1000px] opacity-100 mb-6"
          : "max-h-0 opacity-0 mb-0"
      }`}
    >
      <div className="p-4 bg-white rounded-xl border border-gray-300 shadow-sm dark:bg-slate-800 dark:border-slate-700">
        <p className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-100">
          Filtros
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Orden interna:
            </label>
            <input
              type="text"
              placeholder="Ej. Barra Vaz"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Titulo:
            </label>
            <input
              type="text"
              placeholder="Ej. SD"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Pendiente:
            </label>
            <input
              type="text"
              placeholder="Ej. Sr"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Responsable:
            </label>
            <input
              type="text"
              placeholder="Ej. Delivery"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
            />
          </div>
          <div className="col-span-full flex justify-end px-1.5">
            <button className="mb-2 px-4 py-2 text-sm font-medium border border-gray-400 bg-transparent rounded-lg hover:bg-blue-400 hover:text-white transition">
              Aceptar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
