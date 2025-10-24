import '@testing-library/jest-dom';
import Producto from '../pages/cliente/Producto.jsx';
import { render, screen, fireEvent } from '@testing-library/react';

// eslint-disable-next-line no-undef
describe('Catálogo de Productos', () => {
  // eslint-disable-next-line no-undef
  afterEach(() => {
    window.localStorage.clear();
  });

  // eslint-disable-next-line no-undef
  it('muestra mensaje cuando no hay productos', () => {
    window.localStorage.setItem('productos', JSON.stringify([]));
  render(<Producto />);
  // Simula una búsqueda que no existe
  const input = screen.getByPlaceholderText(/buscar productos/i);
  fireEvent.change(input, { target: { value: 'zzzzzzzzzz' } });
  // eslint-disable-next-line no-undef
  expect(screen.getByText(/no se encontraron productos que coincidan con los criterios de búsqueda/i)).toBeInTheDocument();
  });

  // eslint-disable-next-line no-undef
  it('muestra un producto en el catálogo', () => {
    window.localStorage.setItem('productos', JSON.stringify([
      {
        id: 1,
        nombre: 'Arroz Integral',
        precio: 1290,
        imagen: 'arroz_integrall.webp',
        descripcion: 'Arroz integral 1kg, marca Villa Markets',
        categoria: 'abarrotes',
        stock: 15,
        minimarket: 'Villa Central'
      }
    ]));
    render(<Producto />);
    
    const arrozElements = screen.getAllByText(/arroz integral/i);
  // eslint-disable-next-line no-undef
  expect(arrozElements.length).toBeGreaterThan(0);
    // eslint-disable-next-line no-undef
    expect(screen.getByText(/villa central/i)).toBeInTheDocument();
    // eslint-disable-next-line no-undef
  expect(screen.getByText(/S\/\s*1\.290/i)).toBeInTheDocument();
  });
});