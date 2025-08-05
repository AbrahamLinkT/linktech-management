"use client"
import { overviewData, topProducts } from '@/constants';
import { useTheme } from '@/hooks/use-theme';
import { Footer } from '@/layouts/footer';
import { DollarSign, Package, PencilLine, Star, Trash, TrendingUp, Users } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";


const DashboardPage = () => {
  const { theme } = useTheme()

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Inicio</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="card">
          <div className="card-header">
            <div className="w-fit rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
              <Package size={26} />
            </div>
            <p className="card-title">Total Proyectos</p>
          </div>
          <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">25,154</p>
            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
              <TrendingUp size={18} />
              25%
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
              <DollarSign size={26} />
            </div>
            <p className="card-title">Total Gananciass</p>
          </div>
          <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">$16,000</p>
            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
              <TrendingUp size={18} />
              12%
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
              <Users size={26} />
            </div>
            <p className="card-title">Total trabajadores</p>
          </div>
          <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">15,400k</p>
            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
              <TrendingUp size={18} />
              15%
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <div className="rounded-lg bg-blue-500/20 p-2 text-blue-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
              <Package size={26} />
            </div>
            <p className="card-title">Proyectos en proceso</p>
          </div>
          <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
            <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">12,340</p>
            <span className="flex w-fit items-center gap-x-2 rounded-full border border-blue-500 px-2 py-1 font-medium text-blue-500 dark:border-blue-600 dark:text-blue-600">
              <TrendingUp size={18} />
              19%
            </span>
          </div>
        </div>
      </div>
      {/*  Iinicio de segunda seccion */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* comienzo de grafica */}
        <div className="card col-span-2 md:col-span-2 lg:col-span-7">
          <div className="card-header">
            <p className="card-title">Overview</p>
          </div>
          <div className="card-body p-0">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={overviewData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Tooltip cursor={false} formatter={(value) => `$${value}`} />
                <XAxis dataKey="name" strokeWidth={0} stroke={theme === "light" ? "#475569" : "#94a3b8"} tickMargin={6} />
                <YAxis dataKey="total" strokeWidth={0} stroke={theme === "light" ? "#475569" : "#94a3b8"} tickFormatter={(value) => `$${value}`} tickMargin={6} />
                <Area type="monotone" dataKey="total" stroke="#2563eb" fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* fin de la grafica  */}
      </div>


      {/* Comienzo de top  */}
      <div className="card">
        <div className="card-header">
          <p className="card-title">Top Product Manager</p>
        </div>
        <div className="card-body p-0">
          <div className="relative h-[500px] w-full flex-shrink-0 overflow-auto rounded-none [scrollbar-width:thin]">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">#</th>
                  <th className="table-head">Product</th>
                  <th className="table-head">Price</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Rating</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {topProducts.map((product) => (
                  <tr
                    key={product.number}
                    className="table-row"
                  >
                    <td className="table-cell">{product.number}</td>
                    <td className="table-cell">
                      <div className="flex w-max gap-x-4">

                        <div className="flex flex-col">
                          <p>{product.name}</p>
                          <p className="font-normal text-slate-600 dark:text-slate-400">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">${product.price}</td>
                    <td className="table-cell">{product.status}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-2">
                        <Star
                          size={18}
                          className="fill-yellow-600 stroke-yellow-600"
                        />
                        {product.rating}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center gap-x-4">
                        <button className="text-blue-500 dark:text-blue-600">
                          <PencilLine size={20} />
                        </button>
                        <button className="text-red-500">
                          <Trash size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* final del top */}
      <Footer />
    </div>
  );
};

export default DashboardPage;
