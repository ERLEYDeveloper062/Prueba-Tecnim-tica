import { useEffect, useState } from 'react'
import { getZonas, getSensoresByZona } from '../api/api'

const BADGE_ESTADO = {
  activo:       'badge badge-activo-op',
  inactivo:     'badge badge-inactivo',
  mantenimiento:'badge badge-mantenimiento',
}

export default function ZonaList() {
  const [zonas, setZonas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sensores, setSensores] = useState({})
  const [expandido, setExpandido] = useState(null)

  useEffect(() => {
    getZonas()
      .then(setZonas)
      .catch(() => setError('No se pudieron cargar las zonas.'))
      .finally(() => setLoading(false))
  }, [])

  async function toggleSensores(zonaId) {
    if (expandido === zonaId) {
      setExpandido(null)
      return
    }
    if (!sensores[zonaId]) {
      const data = await getSensoresByZona(zonaId).catch(() => [])
      setSensores(prev => ({ ...prev, [zonaId]: data }))
    }
    setExpandido(zonaId)
  }

  if (loading) return <p className="state-msg">Cargando zonas...</p>
  if (error)   return <p className="state-msg error">{error}</p>

  return (
    <div className="card">
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Ubicación</th>
              <th>Estado operativo</th>
              <th>Sensores activos</th>
            </tr>
          </thead>
          <tbody>
            {zonas.length === 0 && (
              <tr><td colSpan={6} className="state-msg">Sin zonas registradas.</td></tr>
            )}
            {zonas.map(z => (
              <>
                <tr key={z.zona_id}>
                  <td>{z.zona_id}</td>
                  <td>{z.nombre}</td>
                  <td>{z.descripcion ?? '—'}</td>
                  <td>{z.ubicacion ?? '—'}</td>
                  <td>
                    <span className={BADGE_ESTADO[z.estado_operativo] ?? 'badge badge-inactivo'}>
                      {z.estado_operativo}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleSensores(z.zona_id)}
                    >
                      {expandido === z.zona_id ? 'Ocultar' : 'Ver sensores'}
                    </button>
                  </td>
                </tr>
                {expandido === z.zona_id && (
                  <tr key={`sensores-${z.zona_id}`} className="zone-row">
                    <td colSpan={6}>
                      {sensores[z.zona_id]?.length > 0 ? (
                        <div className="zone-chips">
                          {sensores[z.zona_id].map(s => (
                            <span key={s.sensor_id} className="zone-chip">
                              {s.nombre} — {s.tipo}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '.85rem' }}>
                          Sin sensores activos en esta zona
                        </span>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
