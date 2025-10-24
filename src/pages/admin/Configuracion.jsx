import React, { useEffect, useState } from 'react'

const KEY = 'vm_accessibility'

function readPref() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') } catch { return null }
}

export default function Configuracion() {
  const [daltonic, setDaltonic] = useState(() => !!readPref())

  useEffect(() => {
    if (daltonic) {
      document.body.classList.add('vm-daltonic')
    } else {
      document.body.classList.remove('vm-daltonic')
    }
  try { localStorage.setItem(KEY, JSON.stringify(daltonic)) } catch (err) { console.debug('Could not save accessibility pref', err) }
  }, [daltonic])

  return (
    <div style={{padding: 20, maxWidth: 900, margin: '0 auto'}}>
      <h2>Configuración</h2>
      <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
        <label style={{fontWeight: 600}}>Modo daltonico / alto contraste</label>
        <input type="checkbox" checked={daltonic} onChange={e => setDaltonic(e.target.checked)} />
      </div>

      <p style={{marginTop: 12, color: '#555'}}>Activa esto para ver colores con mayor contraste. La preferencia se guarda localmente.</p>
      
    </div>
  )
}
