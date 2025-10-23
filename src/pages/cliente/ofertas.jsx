import React from "react";
// import { minimarketsData } from "./Minimarket.jsx";

function Ofertas() {
    // generar / mostrar producto de la semana (si no hay productos, crear uno simple)
    // Ejemplo de datos de minimarkets si no tienes el import:
    const minimarketsData = [
        { id: 1, nombre: "Tienda Uno", productos: [{ id: 101, nombre: "Manzana", imagen: "https://via.placeholder.com/80.png?text=Manzana", precio: 1200 }] },
        { id: 2, nombre: "Tienda Dos", productos: [{ id: 102, nombre: "Pera", imagen: "https://via.placeholder.com/80.png?text=Pera", precio: 1500 }] },
        { id: 3, nombre: "Tienda Tres", productos: [{ id: 103, nombre: "Naranja", imagen: "https://via.placeholder.com/80.png?text=Naranja", precio: 1300 }] }
    ];

    const weekly = minimarketsData.map((m) => {
        const p = (m.productos && m.productos[0]) || {
            id: `week-${m.id}`,
            nombre: `Producto de la semana en ${m.nombre}`,
            imagen: "https://via.placeholder.com/80.png?text=Oferta",
            precio: Math.floor(Math.random() * 5000) + 500
        };
        return { tienda: m.nombre, producto: p };
    });

    return (
        <div style={{ maxWidth: 900, margin: "16px auto", padding: 12 }}>
            <h2>Ofertas - Producto de la semana</h2>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", marginTop: 12 }}>
                {weekly.map((w) => (
                    <div key={w.producto.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 12 }}>
                        <img src={w.producto.imagen} alt={w.producto.nombre} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }} />
                        <h4 style={{ margin: "8px 0 4px" }}>{w.producto.nombre}</h4>
                        <div className="small text-muted">{w.tienda}</div>
                        <div style={{ marginTop: 8, fontWeight: 600 }}>${w.producto.precio}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Ofertas;