import React, { useEffect, useMemo, useState } from 'react'

const STORE_KEY = 'vm_stores'

function readStores() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// generate sample sales data based on store id
function sampleSales(seed) {
  // deterministic-ish simple pseudo-random based on seed
  let s = seed % 1000
  const vals = []
  for (let i = 0; i < 7; i++) {
    s = (s * 9301 + 49297) % 233280
    vals.push(20 + Math.floor((s / 233280) * 180))
  }
  return vals
}
// 
function SvgBarChart({ data = [], labels = [], color = '#2563eb', width = 700, height = 220 }) {
  const max = Math.max(...data, 1)
  const pad = 24
  const innerW = width - pad * 2
  const innerH = height - pad * 2
  const bw = innerW / data.length

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <rect x={0} y={0} width={width} height={height} fill="transparent" />
      {data.map((v, i) => {
        const h = (v / max) * innerH
        const x = pad + i * bw + bw * 0.15
        const w = bw * 0.7
        const y = pad + (innerH - h)
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill={color} rx={6} />
            <text x={x + w / 2} y={height - 6} fontSize={12} textAnchor="middle" fill="#333">{labels[i]}</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function Reportes() {
  const stores = useMemo(() => readStores(), [])
  const [selected, setSelected] = useState(stores[0]?.id || null)

  useEffect(() => {
    function onUpdate() {
      const s = readStores()
      if (s.length && !selected) setSelected(s[0].id)
    }
    window.addEventListener('vm_stores_updated', onUpdate)
    return () => window.removeEventListener('vm_stores_updated', onUpdate)
  }, [selected])

  const sales = useMemo(() => {
    const seed = selected || 1
    return sampleSales(seed)
  }, [selected])

  const labels = ['Lun','Mar','Mie','Jue','Vie','Sab','Dom']

  return (
    <div style={{padding: 20, maxWidth: 900, margin: '0 auto'}}>
      <h2>Reportes - Ventas semanales</h2>
      <div style={{display: 'flex', gap: 12, alignItems: 'center'}}>
        <label>Seleccionar tienda:</label>
        <select value={selected ?? ''} onChange={e => setSelected(Number(e.target.value))}>
          {stores.length === 0 ? (
            <option value="">(No hay tiendas)</option>
          ) : stores.map(s => (
            <option value={s.id} key={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div style={{marginTop: 18}}>
        <SvgBarChart data={sales} labels={labels} />
      </div>

      <p style={{fontSize: 13, color: '#555', marginTop: 8}}>Los datos mostrados son de ejemplo (generados localmente) para la tienda seleccionada.</p>
    </div>
  )
}
