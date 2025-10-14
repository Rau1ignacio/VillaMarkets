import React from 'react'
import './Home.css'

export default function Home() {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 text-center">
          <h1 className="display-5 fw-bold">Bienvenido a Villa Markets</h1>
          <p className="lead">Explora mini markets locales, encuentra productos y realiza pedidos fácilmente.</p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <a className="btn btn-primary" href="/miniMarkets">Ver Minimarkets</a>
            <a className="btn btn-outline-secondary" href="/productos">Ver Catálogo</a>
          </div>
        </div>
      </div>

      <hr className="my-5" />
      <div className="row">
        <div className="col-md-4">
          <h4>Rápido</h4>
          <p>Encuentra productos de cercanía y haz pedidos en minutos.</p>
        </div>
        <div className="col-md-4">
          <h4>Seguro</h4>
          <p>Pagos y confirmaciones seguras.</p>
        </div>
        <div className="col-md-4">
          <h4>Local</h4>
          <p>Apoya a minimarkets de tu barrio.</p>
        </div>
      </div>
    </div>
  )
}
