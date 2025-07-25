import { render, screen, fireEvent } from '@testing-library/react';
import Cargabilidad from '../app/dashboard/cargabilidad/page';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() })
}));

describe('Cargabilidad', () => {
  it('muestra el título principal', () => {
    render(<Cargabilidad />);
    expect(screen.getByText('Cargabilidad')).toBeInTheDocument();
  });

  it('muestra el botón "Ver resumen"', () => {
    render(<Cargabilidad />);
    expect(screen.getByText('Ver resumen')).toBeInTheDocument();
  });

  it('muestra el panel lateral al hacer click en "Mostrar"', () => {
    render(<Cargabilidad />);
    const mostrarBtn = screen.getAllByText('Mostrar')[0];
    fireEvent.click(mostrarBtn);
    expect(screen.getByText('Ocultar')).toBeInTheDocument();
    expect(screen.getByText('Informacion de horas y proyectos')).toBeInTheDocument();
  });
});
