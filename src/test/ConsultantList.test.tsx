import { render, screen } from '@testing-library/react';
import ConsultantList from '../components/consultants/ConsultantList';
import { useConsultantStore } from '../store/consultantStore';

jest.mock('../store/consultantStore');

const mockConsultants = [
  { nombre: 'Juan', especialidad: 'SAP', disponibilidad: 'Disponible' },
  { nombre: 'Ana', especialidad: 'ABAP', disponibilidad: 'No disponible' },
];

describe('ConsultantList', () => {
  beforeEach(() => {
    useConsultantStore.mockReturnValue({ consultants: mockConsultants, loading: false });
  });

  it('muestra los nombres de los consultores', () => {
    render(<ConsultantList />);
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  it('muestra mensaje si no hay consultores', () => {
    useConsultantStore.mockReturnValue({ consultants: [], loading: false });
    render(<ConsultantList />);
    expect(screen.getByText('No hay consultores disponibles')).toBeInTheDocument();
  });
});
