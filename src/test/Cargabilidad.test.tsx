import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import CargabilidadSimple from '../components/cargabilidad/CargabilidadSimple';

describe('CargabilidadSimple', () => {
  it('debe renderizar el título correctamente', () => {
    render(<CargabilidadSimple />);
    const element = screen.getByText('Cargabilidad Test');
    expect(element).toBeInTheDocument();
  });

  it('debe renderizar el contenedor principal', () => {
    render(<CargabilidadSimple />);
    const container = screen.getByTestId('cargabilidad-container');
    expect(container).toBeInTheDocument();
  });
});
