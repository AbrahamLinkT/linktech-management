import { render, screen } from '@testing-library/react';
import Sidebar from '../components/dashboard/Sidebar';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Sidebar', () => {
  it('resalta el menú activo', () => {
    usePathname.mockReturnValue('/dashboard');
    render(<Sidebar />);
    expect(screen.getByText('Panel')).toHaveClass('bg-blue-700 text-white');
  });

  it('muestra todos los elementos del menú', () => {
    usePathname.mockReturnValue('/dashboard');
    render(<Sidebar />);
    expect(screen.getByText('Panel')).toBeInTheDocument();
    expect(screen.getByText('Gestión de Proyectos')).toBeInTheDocument();
    expect(screen.getByText('Plan de Facturación')).toBeInTheDocument();
    expect(screen.getByText('Métricas')).toBeInTheDocument();
    expect(screen.getByText('Consultores')).toBeInTheDocument();
  });
});
