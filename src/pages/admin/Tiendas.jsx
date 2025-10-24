(function(){})();
import React, { useEffect, useState } from 'react'
import './Tiendas.css';

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

	return (
		<div style={{padding: 20, maxWidth: 900, margin: '0 auto'}}>
			<h2>Tiendas / Agregar Minimarket</h2>
			<form onSubmit={addStore} style={{display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr'}}>
				<input placeholder="Nombre del minimarket" value={name} onChange={e => setName(e.target.value)} />
				<input placeholder="Dirección (opcional)" value={address} onChange={e => setAddress(e.target.value)} />
				<div style={{gridColumn: '1 / -1'}}>
					<button type="submit">Agregar tienda</button>
					<button type="button" onClick={() => { setName(''); setAddress('') }} style={{marginLeft: 8}}>Limpiar</button>
				</div>
			</form>

			<section style={{marginTop: 20}}>
				<h3>Tiendas registradas</h3>
				{stores.length === 0 ? (
					<p>No hay tiendas registradas aún. Agrega una para que aparezca en Reportes.</p>
				) : (
					<ul style={{listStyle: 'none', padding: 0}}>
						{stores.map(s => (
							<li key={s.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee'}}>
								<div>
									<strong>{s.name}</strong>
									<div style={{fontSize: 12, color: '#555'}}>{s.address}</div>
								</div>
								<div>
									<button onClick={() => removeStore(s.id)} style={{color: '#b91c1c'}}>Eliminar</button>
								</div>
							</li>
						))}
					</ul>
				)}
			</section>
		</div>
	)
}

