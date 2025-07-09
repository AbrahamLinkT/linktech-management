
import { Footer } from '@/layouts/footer';


const DashboardPage = () => {

  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="title">Inicio</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="card col-span-1 md:col-span-2 lg:col-span-4">
          <div className="card-header">
            <p className="card-title">Overview</p>
          </div>
          <div className="card-body p-0">
            
          </div>
        </div>

        <div className="card col-span-1 md:col-span-2 lg:col-span-3">
          <div className="card-header">
            <p className="card-title">Proyectos vendidos</p>
          </div>
          <div className="card-body h-[300px] overflow-auto p-0">
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardPage;
