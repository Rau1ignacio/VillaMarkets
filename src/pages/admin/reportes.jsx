// src/pages/admin/Reportes.jsx (por ejemplo)
import React, { useEffect, useMemo, useState } from 'react';
import tiendaService from '../../services/tiendaService';
import productoService from '../../services/productoService';

// =========================
// Utilidades
// =========================
const formatoCLP = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(Number(valor || 0));

function SvgBarChart({
  data = [],
  labels = [],
  color = '#16a34a',
  width = 700,
  height = 220,
}) {
  if (!data.length) {
    return (
      <div style={{ padding: 16, fontSize: 14, color: '#666' }}>
        No hay datos suficientes para generar el gráfico.
      </div>
    );
  }

  const max = Math.max(...data, 1);
  const pad = 32;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const bw = innerW / data.length;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* fondo */}
      <rect x={0} y={0} width={width} height={height} fill="white" rx={12} />
      {/* eje base */}
      <line
        x1={pad}
        y1={height - pad}
        x2={width - pad}
        y2={height - pad}
        stroke="#e5e7eb"
        strokeWidth={1}
      />
      {data.map((v, i) => {
        const h = (v / max) * innerH;
        const x = pad + i * bw + bw * 0.15;
        const w = bw * 0.7;
        const y = pad + (innerH - h);

        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill={color} rx={8} />
            <text
              x={x + w / 2}
              y={y - 6}
              fontSize={11}
              textAnchor="middle"
              fill="#374151"
            >
              {v}
            </text>
            <text
              x={x + w / 2}
              y={height - pad + 12}
              fontSize={11}
              textAnchor="middle"
              fill="#6b7280"
            >
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// =========================
// Componente principal
// =========================
export default function Reportes() {
  const [tiendas, setTiendas] = useState([]);
  const [selectedTiendaId, setSelectedTiendaId] = useState('');
  const [productos, setProductos] = useState([]);

  const [loadingTiendas, setLoadingTiendas] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [error, setError] = useState('');

  // Cargar tiendas desde el backend
  useEffect(() => {
    const fetchTiendas = async () => {
      try {
        setLoadingTiendas(true);
        setError('');
        const data = await tiendaService.listar(); // GET /api/minimarkets
        setTiendas(data || []);
        if (data && data.length > 0) {
          setSelectedTiendaId(data[0].id);
        }
      } catch (err) {
        console.error('Error cargando tiendas:', err);
        setError('No se pudieron cargar las tiendas desde el backend.');
      } finally {
        setLoadingTiendas(false);
      }
    };

    fetchTiendas();
  }, []);

  // Cargar productos de la tienda seleccionada
  useEffect(() => {
    const fetchProductos = async () => {
      if (!selectedTiendaId) {
        setProductos([]);
        return;
      }
      try {
        setLoadingProductos(true);
        setError('');
        const data = await productoService.listarPorTienda(selectedTiendaId);
        setProductos(data || []);
      } catch (err) {
        console.error('Error cargando productos:', err);
        setError('No se pudieron cargar los productos de la tienda seleccionada.');
        setProductos([]);
      } finally {
        setLoadingProductos(false);
      }
    };

    fetchProductos();
  }, [selectedTiendaId]);

  // Métricas calculadas
  const metricas = useMemo(() => {
    const totalProductos = productos.length;
    const totalStock = productos.reduce(
      (acc, p) => acc + (p.stock || 0),
      0
    );
    const valorInventario = productos.reduce((acc, p) => {
      const precio = Number(p.precio || 0);
      const stock = Number(p.stock || 0);
      return acc + precio * stock;
    }, 0);

    const precioPromedio =
      totalProductos > 0
        ? productos.reduce((acc, p) => acc + Number(p.precio || 0), 0) /
        totalProductos
        : 0;

    return {
      totalProductos,
      totalStock,
      valorInventario,
      precioPromedio,
    };
  }, [productos]);

  // Datos para el gráfico: top 7 productos por stock
  const chart = useMemo(() => {
    if (!productos.length) return { labels: [], data: [] };

    const ordenados = [...productos]
      .sort((a, b) => (b.stock || 0) - (a.stock || 0))
      .slice(0, 7);

    const labels = ordenados.map((p) =>
      (p.nombre || '').length > 10 ? (p.nombre || '').slice(0, 10) + '…' : p.nombre
    );
    const data = ordenados.map((p) => p.stock || 0);

    return { labels, data };
  }, [productos]);

  const tiendaActual = tiendas.find((t) => t.id === selectedTiendaId);

  // =========================
  // HTML
  // =========================
  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h2 className="mb-3">Reportes de Inventario por Tienda</h2>
      <p style={{ color: '#6b7280', fontSize: 14 }}>
        Estos reportes se generan en base a los datos reales de <strong>tiendas</strong> y
        <strong> productos</strong> del backend.
      </p>

      {/* Selector de tienda */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          marginTop: 12,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        <label style={{ fontWeight: 500 }}>Seleccionar tienda:</label>
        {loadingTiendas ? (
          <span>Cargando tiendas...</span>
        ) : (
          <select
            value={selectedTiendaId || ''}
            onChange={(e) => setSelectedTiendaId(Number(e.target.value))}
            style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db' }}
          >
            {tiendas.length === 0 ? (
              <option value="">(No hay tiendas registradas)</option>
            ) : (
              tiendas.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))
            )}
          </select>
        )}
      </div>

      {tiendaActual && (
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            backgroundColor: '#f9fafb',
            border: '1px solid #e5e7eb',
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          <strong>Tienda seleccionada:</strong> {tiendaActual.nombre}
          {tiendaActual.direccion && (
            <>
              {' · '}
              <span style={{ color: '#6b7280' }}>{tiendaActual.direccion}</span>
            </>
          )}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: 10,
            borderRadius: 6,
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {/* Métricas rápidas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div className="shadow-sm" style={cardStyle}>
          <span style={labelStyle}>Productos activos</span>
          <strong style={valueStyle}>{metricas.totalProductos}</strong>
        </div>
        <div className="shadow-sm" style={cardStyle}>
          <span style={labelStyle}>Stock total</span>
          <strong style={valueStyle}>{metricas.totalStock}</strong>
        </div>
        <div className="shadow-sm" style={cardStyle}>
          <span style={labelStyle}>Valor de inventario</span>
          <strong style={valueStyle}>{formatoCLP(metricas.valorInventario)}</strong>
        </div>
        <div className="shadow-sm" style={cardStyle}>
          <span style={labelStyle}>Precio promedio</span>
          <strong style={valueStyle}>{formatoCLP(metricas.precioPromedio)}</strong>
        </div>
      </div>

      {/* Gráfico */}
      <div
        style={{
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          padding: 16,
          backgroundColor: '#ffffff',
          marginBottom: 24,
        }}
      >
        <h4 style={{ marginBottom: 8 }}>Top productos por stock</h4>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>
          Se muestran los hasta 7 productos con mayor stock de la tienda seleccionada.
        </p>
        {loadingProductos ? (
          <p>Cargando productos...</p>
        ) : (
          <SvgBarChart data={chart.data} labels={chart.labels} />
        )}
      </div>

      {/* Tabla de productos */}
      <div
        style={{
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          padding: 16,
          backgroundColor: '#ffffff',
        }}
      >
        <h4 style={{ marginBottom: 8 }}>Detalle de productos</h4>
        {loadingProductos ? (
          <p>Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p style={{ fontSize: 14, color: '#6b7280' }}>
            No hay productos registrados para esta tienda.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="table table-sm table-striped align-middle">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th className="text-end">Precio</th>
                  <th className="text-end">Stock</th>
                  <th className="text-end">Total (Precio x Stock)</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => {
                  const totalLinea = Number(p.precio || 0) * Number(p.stock || 0);
                  return (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td>{p.categoria || '-'}</td>
                      <td className="text-end">{formatoCLP(p.precio)}</td>
                      <td className="text-end">{p.stock ?? 0}</td>
                      <td className="text-end">{formatoCLP(totalLinea)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 10 }}>
        Reporte generado en base a los datos del backend (tiendas y productos).
      </p>
    </div>
  );
}

// Estilos inline reutilizables
const cardStyle = {
  padding: '12px 14px',
  borderRadius: 10,
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
};

const labelStyle = {
  fontSize: 12,
  color: '#6b7280',
  marginBottom: 4,
  display: 'block',
};

const valueStyle = {
  fontSize: 18,
  color: '#111827',
};
