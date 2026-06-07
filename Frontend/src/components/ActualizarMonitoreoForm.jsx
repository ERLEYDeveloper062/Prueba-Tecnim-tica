import { useState } from 'react'
import { actualizarMonitoreo } from '../api/api'

export default function ActualizarMonitoreoForm({ monitoreo, onGuardado, onCancelar }) {
  const [valorUmbral, setValorUmbral] = useState(monitoreo.valor_umbral)
  const [estado, setEstado] = useState(monitoreo.estado)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      const actualizado = await actualizarMonitoreo(monitoreo.monitoreo_id, {
        valor_umbral: parseFloat(valorUmbral),
        estado,
      })
      onGuardado(actualizado)
    } catch {
      setError('Error al actualizar el monitoreo.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="inline-form">
      <input
        type="number"
        step="0.01"
        value={valorUmbral}
        onChange={e => setValorUmbral(e.target.value)}
        style={{ width: 100 }}
      />
      <select value={estado} onChange={e => setEstado(e.target.value)}>
        <option value="ACTIVO">ACTIVO</option>
        <option value="PAUSADO">PAUSADO</option>
      </select>
      <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={guardando}>
        {guardando ? 'Guardando...' : 'Guardar'}
      </button>
      <button className="btn btn-ghost btn-sm" onClick={onCancelar} disabled={guardando}>
        Cancelar
      </button>
      {error && <span style={{ color: '#b91c1c', fontSize: '.82rem' }}>{error}</span>}
    </div>
  )
}
