import { useEffect, useState } from 'react'
import { getSensores, getZonas, crearMonitoreo } from '../api/api'

const TIPOS_LECTURA = ['temperatura', 'presion', 'vibracion', 'flujo']

const hoy = new Date().toISOString().split('T')[0]

const ESTADO_INICIAL = {
  sensor_id: '',
  zona_id: '',
  fecha_instalacion: hoy,
  tipo_lectura: 'temperatura',
  valor_umbral: '',
  estado: 'ACTIVO',
}

export default function CrearMonitoreoForm({ onCreado, onCancelar }) {
  const [form, setForm] = useState(ESTADO_INICIAL)
  const [sensores, setSensores] = useState([])
  const [zonas, setZonas] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getSensores().then(setSensores).catch(() => {})
    getZonas().then(setZonas).catch(() => {})
  }, [])

  function set(campo, valor) {
    setForm(f => ({ ...f, [campo]: valor }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.sensor_id || !form.zona_id || !form.valor_umbral) {
      setError('Completa todos los campos requeridos.')
      return
    }

    setEnviando(true)
    try {
      const nuevo = await crearMonitoreo({
        sensor_id: parseInt(form.sensor_id),
        zona_id: parseInt(form.zona_id),
        fecha_instalacion: form.fecha_instalacion,
        tipo_lectura: form.tipo_lectura,
        valor_umbral: parseFloat(form.valor_umbral),
        estado: form.estado,
      })
      onCreado(nuevo)
      setForm(ESTADO_INICIAL)
    } catch (err) {
      const msg = err.response?.data?.detail || 'Error al crear el monitoreo.'
      setError(msg)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="form-card">
      <h3>Nuevo Monitoreo</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Sensor *</label>
            <select value={form.sensor_id} onChange={e => set('sensor_id', e.target.value)} required>
              <option value="">Seleccionar sensor</option>
              {sensores.map(s => (
                <option key={s.sensor_id} value={s.sensor_id}>
                  #{s.sensor_id} — {s.nombre} ({s.tipo})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Zona *</label>
            <select value={form.zona_id} onChange={e => set('zona_id', e.target.value)} required>
              <option value="">Seleccionar zona</option>
              {zonas.map(z => (
                <option key={z.zona_id} value={z.zona_id}>
                  #{z.zona_id} — {z.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tipo de lectura *</label>
            <select value={form.tipo_lectura} onChange={e => set('tipo_lectura', e.target.value)}>
              {TIPOS_LECTURA.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Valor umbral *</label>
            <input
              type="number"
              step="0.01"
              placeholder="Ej: 75.5"
              value={form.valor_umbral}
              onChange={e => set('valor_umbral', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Fecha de instalación *</label>
            <input
              type="date"
              value={form.fecha_instalacion}
              onChange={e => set('fecha_instalacion', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Estado</label>
            <select value={form.estado} onChange={e => set('estado', e.target.value)}>
              <option value="ACTIVO">ACTIVO</option>
              <option value="PAUSADO">PAUSADO</option>
            </select>
          </div>
        </div>

        {error && (
          <p style={{ color: '#b91c1c', fontSize: '.85rem', marginTop: 12 }}>{error}</p>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={enviando}>
            {enviando ? 'Creando...' : 'Crear monitoreo'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={onCancelar} disabled={enviando}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
