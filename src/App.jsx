import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login.jsx'
import Registro from './pages/Registro.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import ClienteInicio from './pages/Cliente/ClienteInicio.jsx'
import Home from './Home.jsx'


function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/cliente/inicio" element={<ClienteInicio />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
