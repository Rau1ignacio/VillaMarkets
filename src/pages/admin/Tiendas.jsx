import React, { useEffect, useState } from 'react';
import tiendaService from '../../services/tiendaService';
import '../../styles/Tiendas.css';

export default function Tiendas() {
	const [stores, setStores] = useState([]);
	const [name, setName] = useState('');
	const [address, setAddress] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	// Cargar tiendas al montar el componente
	useEffect(() => {
		loadStores();
	}, []);

	const loadStores = async () => {
		try {
			setLoading(true);
			setError('');
			const data = await tiendaService.listar();
			setStores(data || []);
		} catch (err) {
			const errorMsg = err.response?.data?.message || err.message || 'Error al cargar tiendas';
			setError(errorMsg);
			console.error('Error al cargar tiendas:', err);
		} finally {
			setLoading(false);
		}
	};

	const addStore = async (e) => {
		e && e.preventDefault();
		if (!name.trim()) {
			alert('Debes ingresar el nombre de la tienda');
			return;
		}

		try {
			setLoading(true);
			setError('');

			const newStore = {
				nombre: name.trim(),
				direccion: address.trim() || 'Sin dirección',
				region: 'Metropolitana',
				comuna: 'Santiago',
				horario: 'Lun-Dom 8:00-22:00',
				latitud: 0.0,
				longitud: 0.0
			};

			await tiendaService.crear(newStore);
			await loadStores(); // Recargar lista después de crear
			setName('');
			setAddress('');

			if (window.Swal) {
				window.Swal.fire({
					icon: 'success',
					title: '¡Tienda creada!',
					text: `La tienda "${name}" ha sido agregada exitosamente.`,
					confirmButtonColor: '#2d8f3c',
					timer: 3000
				});
			} else {
				alert(`Tienda "${name}" creada exitosamente`);
			}
		} catch (err) {
			const errorMsg = err.response?.data?.message || err.message || 'Error al crear tienda';
			setError(errorMsg);
			console.error('Error al crear tienda:', err);

			if (window.Swal) {
				window.Swal.fire({
					icon: 'error',
					title: 'Error',
					text: errorMsg,
					confirmButtonColor: '#dc3545'
				});
			} else {
				alert('Error: ' + errorMsg);
			}
		} finally {
			setLoading(false);
		}
	};

	const removeStore = async (id) => {
		if (!window.confirm('¿Estás seguro de eliminar esta tienda?')) return;

		try {
			setLoading(true);
			setError('');
			await tiendaService.eliminar(id);
			await loadStores(); // Recargar lista después de eliminar

			if (window.Swal) {
				window.Swal.fire({
					icon: 'success',
					title: 'Eliminada',
					text: 'La tienda ha sido eliminada exitosamente.',
					confirmButtonColor: '#2d8f3c',
					timer: 2000
				});
			}
		} catch (err) {
			const errorMsg = err.response?.data?.message || err.message || 'Error al eliminar tienda';
			setError(errorMsg);
			console.error('Error al eliminar tienda:', err);

			if (window.Swal) {
				window.Swal.fire({
					icon: 'error',
					title: 'Error',
					text: errorMsg,
					confirmButtonColor: '#dc3545'
				});
			} else {
				alert('Error: ' + errorMsg);
			}
		} finally {
			setLoading(false);
		}
	};

	// HTML ---------------------------------------------------------------------------------------
	return (
		<div className="container py-4">
			{/* Mensaje de error global */}
			{error && (
				<div className="alert alert-danger alert-dismissible fade show" role="alert">
					<i className="fas fa-exclamation-triangle me-2"></i>
					{error}
					<button type="button" className="btn-close" onClick={() => setError('')}></button>
				</div>
			)}

			{/* Encabezado */}
			<div className="bg-white rounded-3 shadow-sm p-4 mb-4">
				<div className="d-flex justify-content-between align-items-center">
					<div>
						<h2 className="mb-1">
							<i className="fas fa-store me-2 text-primary"></i>
							Gestión de Minimarkets
						</h2>
						<p className="text-muted mb-0">Administra las tiendas registradas en la plataforma</p>
					</div>
					{loading && (
						<div className="spinner-border text-primary" role="status">
							<span className="visually-hidden">Cargando...</span>
						</div>
					)}
				</div>
			</div>

			<div className="row">
				{/* Formulario */}
				<div className="col-md-4 mb-4">
					<div className="bg-white rounded-3 shadow-sm p-4">
						<h5 className="mb-3">
							<i className="fas fa-plus-circle me-2 text-success"></i>
							Agregar Minimarket
						</h5>
						<form onSubmit={addStore}>
							<div className="mb-3">
								<label className="form-label">Nombre del minimarket</label>
								<input
									className="form-control"
									placeholder="Ej: Villa Market Central"
									value={name}
									onChange={e => setName(e.target.value)}
									disabled={loading}
									required
								/>
							</div>
							<div className="mb-3">
								<label className="form-label">Dirección</label>
								<input
									className="form-control"
									placeholder="Ej: Av. Principal #123"
									value={address}
									onChange={e => setAddress(e.target.value)}
									disabled={loading}
								/>
							</div>
							<div className="d-grid gap-2">
								<button type="submit" className="btn btn-primary" disabled={loading}>
									<i className="fas fa-plus me-2"></i>
									{loading ? 'Agregando...' : 'Agregar tienda'}
								</button>
								<button
									type="button"
									className="btn btn-outline-secondary"
									onClick={() => { setName(''); setAddress(''); }}
									disabled={loading}
								>
									<i className="fas fa-broom me-2"></i>
									Limpiar campos
								</button>
							</div>
						</form>
					</div>
				</div>

				{/* Lista de tiendas */}
				<div className="col-md-8">
					<div className="bg-white rounded-3 shadow-sm p-4">
						<h5 className="mb-3">
							<i className="fas fa-list me-2 text-primary"></i>
							Tiendas registradas ({stores.length})
						</h5>

						{loading && stores.length === 0 ? (
							<div className="text-center py-5">
								<div className="spinner-border text-primary mb-3" role="status">
									<span className="visually-hidden">Cargando...</span>
								</div>
								<p className="text-muted">Cargando tiendas...</p>
							</div>
						) : stores.length === 0 ? (
							<div className="text-center py-5">
								<i className="fas fa-store-slash text-muted fs-1 mb-3"></i>
								<p className="text-muted mb-3">No hay tiendas registradas aún</p>
								<p className="small text-muted">Agrega una tienda usando el formulario de la izquierda</p>
							</div>
						) : (
							<div className="list-group">
								{stores.map(s => (
									<div key={s.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 border-start border-4 border-primary border-opacity-25">
										<div className="d-flex align-items-center gap-3">
											<div className="bg-light rounded-circle p-2">
												<i className="fas fa-store text-primary"></i>
											</div>
											<div>
												<h6 className="mb-0 fw-bold">{s.nombre}</h6>
												{s.direccion && (
													<div className="text-muted small">
														<i className="fas fa-map-marker-alt me-1"></i>
														{s.direccion}
													</div>
												)}
												{s.region && s.comuna && (
													<div className="text-muted small">
														<i className="fas fa-globe me-1"></i>
														{s.comuna}, {s.region}
													</div>
												)}
												{s.horario && (
													<div className="text-muted small">
														<i className="fas fa-clock me-1"></i>
														{s.horario}
													</div>
												)}
											</div>
										</div>
										<button
											onClick={() => removeStore(s.id)}
											className="btn btn-sm btn-light"
											title="Eliminar tienda"
											disabled={loading}
										>
											<i className="fas fa-trash text-danger"></i>
										</button>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
