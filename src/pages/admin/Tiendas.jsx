(function(){})();
import React, { useEffect, useState } from 'react'
import '../../styles/Tiendas.css';

const STORAGE_KEY = 'vm_stores'

function readStores() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		return raw ? JSON.parse(raw) : []
	} catch {
		return []
	}
}
// guardar tiendas en localStorage y disparar evento de actualización
function writeStores(stores) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(stores))
	window.dispatchEvent(new CustomEvent('vm_stores_updated'))
}

export default function Tiendas() {
	const [stores, setStores] = useState(() => readStores())
	const [name, setName] = useState('')
	const [address, setAddress] = useState('')

	useEffect(() => {
		function onUpdate() {
			setStores(readStores())
		}
		window.addEventListener('vm_stores_updated', onUpdate)
		return () => window.removeEventListener('vm_stores_updated', onUpdate)
	}, [])

	function addStore(e) {
		e && e.preventDefault()
		if (!name.trim()) return
		const newStore = { id: Date.now(), name: name.trim(), address: address.trim() }
		const next = [...stores, newStore]
		setStores(next)
		writeStores(next)
		setName('')
		setAddress('')
	}

	function removeStore(id) {
		const next = stores.filter(s => s.id !== id)
		setStores(next)
		writeStores(next)
	}


	// HTML ---------------------------------------------------------------------------------------
	return (
		<div className="container py-4">
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
								/>
							</div>
							<div className="d-grid gap-2">
								<button type="submit" className="btn btn-primary">
									<i className="fas fa-plus me-2"></i>
									Agregar tienda
								</button>
								<button 
									type="button" 
									className="btn btn-outline-secondary"
									onClick={() => { setName(''); setAddress('') }}
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
							Tiendas registradas
						</h5>
						
						{stores.length === 0 ? (
							<div className="text-center py-5">
								<i className="fas fa-store-slash text-muted fs-1 mb-3"></i>
								<p className="text-muted mb-3">No hay tiendas registradas aún</p>
								<p className="small text-muted">Agrega una tienda para que aparezca en los reportes</p>
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
												<h6 className="mb-0 fw-bold">{s.name}</h6>
												{s.address && (
													<div className="text-muted small">
														<i className="fas fa-map-marker-alt me-1"></i>
														{s.address}
													</div>
												)}
											</div>
										</div>
										<button 
											onClick={() => {
												if(window.confirm('¿Estás seguro de eliminar esta tienda?')) {
													removeStore(s.id)
												}
											}} 
											className="btn btn-sm btn-light"
											title="Eliminar tienda"
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
	)
}
