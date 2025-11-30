import React, { useEffect, useMemo, useState } from 'react';
import tiendaService from '../../services/tiendaService';
import productoService from '../../services/productoService';
import pedidoService from '../../services/pedidoService';
import '../../styles/Reportes.css';

const formatoCLP = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  }).format(Number(valor || 0));

const obtenerAdminActual = () => {
  try {
    const stored = localStorage.getItem('usuarioActual');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const SvgBarChart = ({ data = [], labels = [], color = '#16a34a', width = 700, height = 220 }) => {
  if (!data.length) {
    return <div className="reportes-chart-empty">No hay datos suficientes para generar el gráfico.</div>;
  }

  const max = Math.max(...data, 1);
  const pad = 32;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const bw = innerW / data.length;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x={0} y={0} width={width} height={height} fill="white" rx={12} />
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="#e5e7eb" strokeWidth={1} />
      {data.map((v, i) => {
        const h = (v / max) * innerH;
        const x = pad + i * bw + bw * 0.15;
        const w = bw * 0.7;
        const y = pad + (innerH - h);
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill={color} rx={8} />
            <text x={x + w / 2} y={y - 6} fontSize={11} textAnchor="middle" fill="#374151">
              {v}
            </text>
            <text x={x + w / 2} y={height - pad + 12} fontSize={11} textAnchor="middle" fill="#6b7280">
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default function Reportes() {
  const [admin] = useState(() => obtenerAdminActual());
  const [tiendas, setTiendas] = useState([]);
  const [selectedTiendaId, setSelectedTiendaId] = useState('');
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [loadingTiendas, setLoadingTiendas] = useState(false);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!admin?.id) {
      setError('Debes iniciar sesión como administrador para revisar tus reportes.');
      setTiendas([]);
      setSelectedTiendaId('');
      return;
    }

    const cargarTiendas = async () => {
      try {
        setLoadingTiendas(true);
        setError('');
        const data = await tiendaService.listar(admin.id);
        setTiendas(data || []);
        if (data && data.length > 0) {
          setSelectedTiendaId(String(data[0].id));
        } else {
          setSelectedTiendaId('');
        }
      } catch (err) {
        console.error('Error cargando tiendas:', err);
        setError('No se pudieron cargar las tiendas asociadas a tu cuenta.');
      } finally {
        setLoadingTiendas(false);
      }
    };

    cargarTiendas();
  }, [admin?.id]);

  useEffect(() => {
    const tiendaId = Number(selectedTiendaId);
    if (!tiendaId) {
      setProductos([]);
      setPedidos([]);
      return;
    }

    const cargarDetalle = async () => {
      try {
        setLoadingDetalle(true);
        setError('');
        const [productosResp, pedidosResp] = await Promise.all([
          productoService.listarPorTienda(tiendaId),
          pedidoService.listarPorTienda(tiendaId)
        ]);
        setProductos(productosResp || []);
        setPedidos(pedidosResp || []);
      } catch (err) {
        console.error('Error cargando detalle de tienda:', err);
        setError('No se pudo cargar la información de inventario/pedidos para la tienda seleccionada.');
        setProductos([]);
        setPedidos([]);
      } finally {
        setLoadingDetalle(false);
      }
    };

    cargarDetalle();
  }, [selectedTiendaId]);

  const metricasInventario = useMemo(() => {
    const totalProductos = productos.length;
    const totalStock = productos.reduce((acc, p) => acc + Number(p.stock || 0), 0);
    const valorInventario = productos.reduce(
      (acc, p) => acc + Number(p.precio || 0) * Number(p.stock || 0),
      0
    );
    const precioPromedio =
      totalProductos > 0
        ? productos.reduce((acc, p) => acc + Number(p.precio || 0), 0) / totalProductos
        : 0;
    return { totalProductos, totalStock, valorInventario, precioPromedio };
  }, [productos]);

  const metricasPedidos = useMemo(() => {
    if (!pedidos.length) {
      return { total: 0, totalVentas: 0, clientes: 0 };
    }
    const totalVentas = pedidos.reduce((acc, p) => acc + Number(p.total || 0), 0);
    const clientesUnicos = new Set(
      pedidos.map((p) => p.usuarioNombre || p.usuarioId || 'Cliente desconocido')
    ).size;
    return { total: pedidos.length, totalVentas, clientes: clientesUnicos };
  }, [pedidos]);

  const chart = useMemo(() => {
    if (!productos.length) return { labels: [], data: [] };
    const ordenados = [...productos]
      .sort((a, b) => (b.stock || 0) - (a.stock || 0))
      .slice(0, 7);
    const labels = ordenados.map((p) =>
      (p.nombre || '').length > 12 ? `${p.nombre.substring(0, 12)}…` : p.nombre
    );
    const data = ordenados.map((p) => p.stock || 0);
    return { labels, data };
  }, [productos]);

  const pedidosRecientes = useMemo(
    () =>
      [...pedidos]
        .sort((a, b) => new Date(b.fechaPedido || 0) - new Date(a.fechaPedido || 0))
        .slice(0, 6),
    [pedidos]
  );

  const tiendaActual = tiendas.find((t) => String(t.id) === selectedTiendaId);

  if (!admin?.id) {
    return (
      <div className="reportes-container">
        <div className="reportes-alert reportes-alert-warning">
          Debes iniciar sesión como administrador para revisar tus reportes.
        </div>
      </div>
    );
  }

  return (
    <div className="reportes-container">
      <section className="reportes-header">
        <div>
          <p className="reportes-eyebrow">Panel de control</p>
          <h1>Reportes de Inventario y Ventas</h1>
          <p>
            Visualiza el estado de tus tiendas, productos y pedidos en tiempo real usando los datos
            del backend.
          </p>
        </div>
        <div className="reportes-badge">
          <i className="fas fa-user-shield me-2" />
          {admin?.nombres || admin?.username}
        </div>
      </section>

      {error && <div className="reportes-alert reportes-alert-error">{error}</div>}

      <div className="reportes-selector">
        <label htmlFor="tienda-select">Seleccionar tienda</label>
        {loadingTiendas ? (
          <span className="reportes-muted">Cargando tiendas...</span>
        ) : (
          <select
            id="tienda-select"
            className="reportes-select"
            value={selectedTiendaId}
            onChange={(e) => setSelectedTiendaId(e.target.value)}
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
        <div className="reportes-selected-store">
          <div>
            <h3>{tiendaActual.nombre}</h3>
            <p>{tiendaActual.direccion || 'Sin dirección registrada'}</p>
          </div>
          <div className="reportes-store-meta">
            {tiendaActual.comuna && <span>{tiendaActual.comuna}</span>}
            {tiendaActual.region && <span>{tiendaActual.region}</span>}
            {tiendaActual.horario && <span>{tiendaActual.horario}</span>}
          </div>
        </div>
      )}

      <div className="reportes-grid">
        <div className="reportes-card reportes-card-kpi">
          <p>Productos activos</p>
          <strong>{metricasInventario.totalProductos}</strong>
        </div>
        <div className="reportes-card reportes-card-kpi">
          <p>Stock total</p>
          <strong>{metricasInventario.totalStock}</strong>
        </div>
        <div className="reportes-card reportes-card-kpi">
          <p>Valor inventario</p>
          <strong>{formatoCLP(metricasInventario.valorInventario)}</strong>
        </div>
        <div className="reportes-card reportes-card-kpi">
          <p>Precio promedio</p>
          <strong>{formatoCLP(metricasInventario.precioPromedio)}</strong>
        </div>
        <div className="reportes-card reportes-card-kpi reportes-card-accent">
          <p>Pedidos totales</p>
          <strong>{metricasPedidos.total}</strong>
        </div>
        <div className="reportes-card reportes-card-kpi reportes-card-accent">
          <p>Ventas de la tienda</p>
          <strong>{formatoCLP(metricasPedidos.totalVentas)}</strong>
        </div>
        <div className="reportes-card reportes-card-kpi reportes-card-accent">
          <p>Clientes únicos</p>
          <strong>{metricasPedidos.clientes}</strong>
        </div>
      </div>

      <section className="reportes-card">
        <div className="reportes-card-head">
          <div>
            <h4>Top productos por stock</h4>
            <p>Se muestran los productos con mayor stock para la tienda seleccionada.</p>
          </div>
        </div>
        {loadingDetalle ? (
          <p className="reportes-muted">Cargando información...</p>
        ) : (
          <div className="reportes-chart-wrapper">
            <SvgBarChart data={chart.data} labels={chart.labels} />
          </div>
        )}
      </section>

      <div className="reportes-flex">
        <section className="reportes-card reportes-table-card">
          <div className="reportes-card-head">
            <div>
              <h4>Detalle de productos</h4>
              <p>
                Información real proveniente del backend. Ajusta stock y precios desde Gestión de
                Productos.
              </p>
            </div>
          </div>
          {loadingDetalle ? (
            <p className="reportes-muted">Cargando productos...</p>
          ) : productos.length === 0 ? (
            <p className="reportes-muted">No hay productos registrados para esta tienda.</p>
          ) : (
            <div className="reportes-table-wrapper">
              <table className="table table-sm align-middle mb-0">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">Stock</th>
                    <th className="text-end">Total (P x S)</th>
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
        </section>

        <section className="reportes-card reportes-orders-card">
          <div className="reportes-card-head">
            <div>
              <h4>Pedidos recientes</h4>
              <p>Basado en los datos reales de pedidos por tienda desde el backend.</p>
            </div>
          </div>
          {loadingDetalle ? (
            <p className="reportes-muted">Cargando pedidos...</p>
          ) : pedidosRecientes.length === 0 ? (
            <p className="reportes-muted">Esta tienda aún no registra pedidos.</p>
          ) : (
            <ul className="reportes-orders-list">
              {pedidosRecientes.map((pedido) => (
                <li key={pedido.id}>
                  <div>
                    <strong>#{pedido.id}</strong>
                    <span>{pedido.usuarioNombre || pedido.usuarioId || 'Cliente'}</span>
                    <span className="reportes-muted">{new Date(pedido.fechaPedido).toLocaleString('es-CL')}</span>
                  </div>
                  <div className="text-end">
                    <span className="reportes-order-badge">{pedido.estado || 'PENDIENTE'}</span>
                    <div>{formatoCLP(pedido.total)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="reportes-footer-note">
        Reporte alimentado directamente desde los endpoints reales de tiendas, productos y pedidos.
      </p>
    </div>
  );
}
