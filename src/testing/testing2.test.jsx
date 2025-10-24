import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tiendas from '../pages/admin/Tiendas.jsx';
import '@testing-library/jest-dom';
// 
// eslint-disable-next-line no-undef
describe('Gestión de Tiendas', () => {
  // eslint-disable-next-line no-undef
  afterEach(() => {
    window.localStorage.clear();
  });

  // eslint-disable-next-line no-undef
  it('muestra mensaje cuando no hay tiendas', () => {
    window.localStorage.setItem('vm_stores', JSON.stringify([]));
    render(<Tiendas />);
  // eslint-disable-next-line no-undef
  expect(screen.getByText(/no hay tiendas registradas/i)).toBeInTheDocument();
  });

  // eslint-disable-next-line no-undef
  it('agrega una tienda y la muestra en la lista', () => {
    window.localStorage.setItem('vm_stores', JSON.stringify([]));
    render(<Tiendas />);
    fireEvent.change(screen.getByPlaceholderText(/nombre del minimarket/i), { target: { value: 'Tienda Prueba' } });
    fireEvent.change(screen.getByPlaceholderText(/dirección/i), { target: { value: 'Calle Falsa 123' } });
    fireEvent.click(screen.getByText(/agregar tienda/i));
  // eslint-disable-next-line no-undef
  expect(screen.getByText(/tienda prueba/i)).toBeInTheDocument();
  // eslint-disable-next-line no-undef
  expect(screen.getByText(/calle falsa 123/i)).toBeInTheDocument();
  });

  // eslint-disable-next-line no-undef
  it('elimina una tienda de la lista', () => {
    // Pre-carga una tienda
    window.localStorage.setItem('vm_stores', JSON.stringify([
      { id: 1, name: 'Tienda Prueba', address: 'Calle Falsa 123' }
    ]));
    render(<Tiendas />);
    // Simula click en el botón eliminar
    fireEvent.click(screen.getByText(/eliminar/i));
    // Verifica que el mensaje de lista vacía aparece
  // eslint-disable-next-line no-undef
  expect(screen.getByText(/no hay tiendas registradas/i)).toBeInTheDocument();
  });
});
