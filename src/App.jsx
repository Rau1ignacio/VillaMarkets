import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/public/Login.jsx'
import Registro from './pages/public/Registro.jsx'
import Home from './pages/public/Home.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import ClienteInicio from './pages/cliente/ClienteInicio.jsx'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <Navbar />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/cliente/inicio" element={<ClienteInicio />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
