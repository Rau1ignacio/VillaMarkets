import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';

import { expect, test, beforeAll } from '@jest/globals';

let AdminDashboard;
let AdminLayout;
// Cargar los componentes de forma asíncrona antes de las pruebas
beforeAll(async () => {
  AdminDashboard = (await import('../pages/admin/AdminDashboard')).default;
  AdminLayout = (await import('../components/layout/AdminLayout')).default;
});
// renderizar el botón Gestión de Pedidos
test('renderiza el botón Gestión de Pedidos', () => {
  render(
    <MemoryRouter>
      <AdminDashboard />
    </MemoryRouter>
  );
  expect(screen.getByRole('button', { name: /ver pedidos|ver pedidos/i })).toBeInTheDocument();
});
// Test navigation to /admin/gestion-pedidos on button click
test('al hacer click en Gestión de Pedidos navega a /admin/gestion-pedidos', () => {
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/gestion-pedidos" element={<div data-testid="location">/admin/gestion-pedidos</div>} />
      </Routes>
    </MemoryRouter>
  );
/// Simular el click en el botón
  const btn = screen.getByRole('button', { name: /ver pedidos/i });
  fireEvent.click(btn);
// Verificar que la URL ha cambiado
  expect(screen.getByTestId('location').textContent).toBe('/admin/gestion-pedidos');
});
///  Test para el botón de perfil
test('muestra el botón Perfil en el layout del admin', () => {
  render(
    <MemoryRouter>
      <AdminLayout />
    </MemoryRouter>
  );
  // The Perfil option exists in the DOM within the layout's dropdown menu
  expect(screen.getByRole('button', { name: /perfil/i })).toBeInTheDocument();
});