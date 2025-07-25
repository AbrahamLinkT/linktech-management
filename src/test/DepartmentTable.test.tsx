import { render, screen, fireEvent } from '@testing-library/react';
import DepartmentTable from '../components/departments/DepartmentTable';

describe('DepartmentTable', () => {
  it('muestra el buscador y el botón de buscar', () => {
    render(<DepartmentTable />);
    expect(screen.getByPlaceholderText('Buscar')).toBeInTheDocument();
    expect(screen.getByText('Buscar')).toBeInTheDocument();
  });

  it('filtra departamentos por texto', () => {
    render(<DepartmentTable />);
    const input = screen.getByPlaceholderText('Buscar');
    fireEvent.change(input, { target: { value: 'Finanzas' } });
    fireEvent.click(screen.getByText('Buscar'));
    expect(screen.getByText('Finanzas')).toBeInTheDocument();
  });
});
