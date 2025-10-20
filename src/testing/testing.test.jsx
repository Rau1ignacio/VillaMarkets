import AdminDashboard from '../pages/admin/AdminDashboard';
import React from 'react';
import { render, screen, fireEvent,test } from '@testing-library/react';
import '@testing-library/jest-dom';
import { expect, jest } from '@jest/globals';
import AdminLayout from '../components/layout/AdminLayout';

// mock de useNavigate antes de importar el componente
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});





// ...existing code...

test('renderiza el botón Gestión de Pedidos', () => {
  render(<AdminDashboard />);
  expect(screen.getByRole('button', { name: /gestionPedidos/i })).toBeInTheDocument();
});

test('al hacer click en Ver Pedidos llama a navigate con /admin/gestion-pedidos', () => {
  render(<AdminDashboard />);
  const btn = screen.getByRole('button', { name: /ver pedidos/i });
  fireEvent.click(btn);
  expect(mockNavigate).toHaveBeenCalledWith('/admin/gestion-pedidos');
});

test('muestra el botón Perfil al abrir el menú de usuario', () => {
  render(<AdminLayout />);
  const userMenuButton = screen.getByRole('button', { name: /administrador/i });
  fireEvent.click(userMenuButton);
  expect(screen.getByRole('button', { name: /perfil/i })).toBeInTheDocument();
});