import { useEffect, useState } from 'react'
import { getSensores, getZonasBySensor } from '../api/api'

export default function SensorList() {
  const [sensores, setSensores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [zonas, setZonas] = useState({})
  const [expandido, setExpandido] = useState(null)

  useEffect(() => {
    getSensores()
      .then(setSensores)
      .catch(() => setError('No se pudieron cargar los sensores.'))
      .finally(() => setLoading(false))
  }, [])

  async function toggleZonas(sensorId) {
    if (expandido === sensorId) {
      setExpandido(null)
      return
    }
    if (!zonas[sensorId]) {
      const data = await getZonasBySensor(sensorId).catch(() => [])
      setZonas(prev => ({ ...prev, [sensorId]: data }))
    }
    setExpandido(sensorId)
  }

  if (loading) return <p className="state-msg">Cargando sensores...</p>
  if (error)   return <p className="state-msg error">{error}</p>

  return (
    <div>
      <div className="section-header">
        <h2>Sensores ({sensores.length})</h2>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Fabricante</th>
                <th>Fecha fabricación</th>
                <th>Zonas</th>
              </tr>
            </thead>
            <tbody>
              {sensores.map(s => (
                <>
                  <tr key={s.sensor_id}>
                    <td>{s.sensor_id}</td>
                    <td>{s.nombre}</td>
                    <td><span className="badge badge-activo-op">{s.tipo}</span></td>
                    <td>{s.fabricante}</td>
                    <td>{s.fecha_fabricacion}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => toggleZonas(s.sensor_id)}
                      >
                        {expandido === s.sensor_id ? 'Ocultar' : 'Ver zonas'}
                      </button>
                    </td>
                  </tr>
                  {expandido === s.sensor_id && (
                    <tr key={`zonas-${s.sensor_id}`} className="zone-row">
                      <td colSpan={6}>
                        {zonas[s.sensor_id]?.length > 0 ? (
                          <div className="zone-chips">
                            {zonas[s.sensor_id].map(z => (
                              <span key={z.zona_id} className="zone-chip">
                                {z.nombre} — {z.ubicacion}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '.85rem' }}>
                            Sin zonas asociadas
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
    </div>
  )
}
