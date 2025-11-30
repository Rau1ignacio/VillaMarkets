import { fireEvent, render, screen } from '@testing-library/react';
import MetodoPago from '../pages/cliente/MetodoPago';

// IE2.3.1: verifica que el formulario de pago valide y envíe los datos requeridos.
describe('MetodoPago', () => {
  it('envía los datos del formulario al confirmar', () => {
    const handleConfirmar = jest.fn();
    render(<MetodoPago total="CLP 10.000" onConfirmar={handleConfirmar} />);

    fireEvent.change(screen.getByLabelText(/Nombre completo/i), { target: { value: 'Cliente Demo' } });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), { target: { value: 'demo@test.com' } });
    fireEvent.change(screen.getByLabelText(/Método de pago/i), { target: { value: 'tarjeta' } });
    fireEvent.change(screen.getByLabelText(/Tipo de entrega/i), { target: { value: 'retiro' } });
    fireEvent.change(screen.getByLabelText(/Comentarios/i), { target: { value: 'Sin contacto' } });

    fireEvent.submit(screen.getByText(/Confirmar pedido/i));

    expect(handleConfirmar).toHaveBeenCalledWith(
      expect.objectContaining({
        nombre: 'Cliente Demo',
        correo: 'demo@test.com',
        metodoPago: 'tarjeta',
        tipoEntrega: 'retiro',
        comentarios: 'Sin contacto'
      })
    );
  });
});
