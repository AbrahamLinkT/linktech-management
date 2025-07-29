import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ConsultantList from '../components/consultants/ConsultantList';
import { useConsultantStore } from '../store/consultantStore';

jest.mock('../store/consultantStore', () => ({
  useConsultantStore: jest.fn()
}));


const mockConsultants = [
  { id: 1, name: 'Juan', specialization: ['SAP'], disponibilidad: 'Disponible' },
  { id: 2, name: 'Ana', specialization: ['ABAP'], disponibilidad: 'No disponible' },
];



describe('ConsultantList', () => {
  beforeEach(() => {
    (useConsultantStore as jest.MockedFunction<typeof useConsultantStore>).mockReturnValue({ consultants: mockConsultants, loading: false });
  });

  it('muestra los nombres de los consultores', () => {
    render(<ConsultantList />);
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
  });

  it('muestra mensaje si no hay consultores', () => {
    (useConsultantStore as jest.MockedFunction<typeof useConsultantStore>).mockReturnValue({ consultants: [], loading: false });
    render(<ConsultantList />);
    expect(screen.getByText('No hay consultores disponibles')).toBeInTheDocument();
  });
});
