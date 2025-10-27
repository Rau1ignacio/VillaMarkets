import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Tiendas from '../pages/admin/Tiendas.jsx';
import '@testing-library/jest-dom';

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
    // Los inputs usan placeholders como ejemplo (Ej: Villa Market Central, Ej: Av. Principal #123)
    fireEvent.change(screen.getByPlaceholderText(/Ej:\s*Villa Market Central/i), { target: { value: 'Tienda Prueba' } });
    fireEvent.change(screen.getByPlaceholderText(/Ej:\s*Av\. Principal/i), { target: { value: 'Calle Falsa 123' } });
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
  const { container } = render(<Tiendas />);

  // Forzar confirmación afirmativa (jsdom/jest no muestra el diálogo)
  window.confirm = jest.fn(() => true);

  // Buscar el botón de eliminar por el atributo title (existe en el componente)
  const btnEliminar = container.querySelector('button[title="Eliminar tienda"]');
  expect(btnEliminar).toBeInTheDocument();
  fireEvent.click(btnEliminar);

    // Verifica que el mensaje de lista vacía aparece
    expect(screen.getByText(/no hay tiendas registradas/i)).toBeInTheDocument();
  });
});
