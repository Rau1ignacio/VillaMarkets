import React, { useEffect, useMemo, useState } from 'react';
import tiendaService from '../../services/tiendaService';
import productoService from '../../services/productoService';
import pedidoService from '../../services/pedidoService';

const formatearCLP = (valor) =>
  'CLP ' +
  new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(Number(valor || 0)));

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tiendas, setTiendas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError('');
        const [tiendasResp, productosResp, pedidosResp] = await Promise.all([
          tiendaService.listar(),
          productoService.listar(),
          pedidoService.listar()
        ]);
        setTiendas(Array.isArray(tiendasResp) ? tiendasResp : []);
        setProductos(Array.isArray(productosResp) ? productosResp : []);
        setPedidos(Array.isArray(pedidosResp) ? pedidosResp : []);
      } catch (err) {
        console.error('Error cargando dashboard admin:', err);
        setError('No se pudieron cargar los datos del dashboard.');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const tiendaMap = useMemo(() => {
    const map = new Map();
    tiendas.forEach((t) => map.set(t.id, t.nombre));
    return map;
  }, [tiendas]);

  const pedidosOrdenados = useMemo(() => {
    return [...pedidos].sort((a, b) => {
      const fechaA = a?.fechaPedido ? new Date(a.fechaPedido).getTime() : 0;
      const fechaB = b?.fechaPedido ? new Date(b.fechaPedido).getTime() : 0;
      return fechaB - fechaA;
    });
  }, [pedidos]);

  const totalTiendas = tiendas.length;
  const totalProductos = productos.length;
  const totalPedidos = pedidos.length;
  const totalVentas = pedidos.reduce(
    (acc, p) => acc + Number(p.total || 0),
    0
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Panel de Administracion</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Tiendas registradas</span>
                <i className="fas fa-store text-primary fs-4" />
              </div>
              <h2 className="fw-bold mb-0">{totalTiendas}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Productos activos</span>
                <i className="fas fa-box-open text-success fs-4" />
              </div>
              <h2 className="fw-bold mb-0">{totalProductos}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Pedidos totales</span>
                <i className="fas fa-receipt text-warning fs-4" />
              </div>
              <h2 className="fw-bold mb-0">{totalPedidos}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Ventas totales</span>
                <i className="fas fa-dollar-sign text-danger fs-4" />
              </div>
              <h2 className="fw-bold mb-0">{formatearCLP(totalVentas)}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h5 className="mb-0">Ultimos pedidos</h5>
        </div>
        <div className="card-body">
          {pedidosOrdenados.length === 0 ? (
            <p className="text-muted mb-0">Aun no hay pedidos registrados.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Tienda</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosOrdenados.slice(0, 10).map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.usuarioNombre || p.usuarioId || '-'}</td>
                      <td>{p.tiendaNombre || tiendaMap.get(p.tiendaId) || '-'}</td>
                      <td>
                        {p.fechaPedido
                          ? new Date(p.fechaPedido).toLocaleString('es-CL', {
                              dateStyle: 'short',
                              timeStyle: 'short'
                            })
                          : '-'}
                      </td>
                      <td>{p.estado || 'PENDIENTE'}</td>
                      <td>{formatearCLP(p.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
