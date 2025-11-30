import { render, screen, waitFor } from '@testing-library/react';
import MisPedidos from '../pages/cliente/MisPedidos';

jest.mock('../services/pedidoService', () => ({
  __esModule: true,
  default: {
    listarPorUsuario: jest.fn(() => Promise.resolve([]))
  }
}));

// IE2.3.2: asegura que el historial maneje escenarios sin sesión mostrando las alertas correctas.
describe('MisPedidos', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('muestra advertencia cuando no hay usuario autenticado', async () => {
    render(<MisPedidos />);
    await waitFor(() =>
      expect(screen.getByText(/Debes iniciar sesion para revisar tu historial/i)).toBeInTheDocument()
    );
  });
});
