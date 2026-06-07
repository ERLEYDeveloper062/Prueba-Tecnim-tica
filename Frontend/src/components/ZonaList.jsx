import { useEffect, useState, Fragment } from 'react'
import { getZonas, getMonitoreos, getSensores } from '../api/api'

const BADGE_ZONA = {
  activo:        'badge badge-activo-op',
  inactivo:      'badge badge-inactivo',
  mantenimiento: 'badge badge-mantenimiento',
}

export default function ZonaList() {
  const [zonas, setZonas] = useState([])
  const [detallePorZona, setDetallePorZona] = useState({})   // zonaId → [{monitoreo, sensor}]
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandido, setExpandido] = useState(null)

  useEffect(() => {
    Promise.all([getZonas(), getMonitoreos('ACTIVO'), getSensores()])
      .then(([zonas, monitoreos, sensores]) => {
        setZonas(zonas)

        const sMap = Object.fromEntries(sensores.map(s => [s.sensor_id, s]))

        const detalle = {}
        monitoreos.forEach(m => {
          if (!detalle[m.zona_id]) detalle[m.zona_id] = []
          detalle[m.zona_id].push({ monitoreo: m, sensor: sMap[m.sensor_id] })
        })
        setDetallePorZona(detalle)
      })
      .catch(() => setError('No se pudieron cargar las zonas.'))
      .finally(() => setLoading(false))
  }, [])

  function toggle(zonaId) {
    setExpandido(prev => prev === zonaId ? null : zonaId)
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
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {zonas.length === 0 && (
              <tr><td colSpan={7} className="state-msg">Sin zonas registradas.</td></tr>
            )}
            {zonas.map(z => {
              const items = detallePorZona[z.zona_id] ?? []
              const activos = z.sensores_activos ?? items.length
              return (
                <Fragment key={z.zona_id}>
                  <tr>
                    <td>{z.zona_id}</td>
                    <td><strong>{z.nombre}</strong></td>
                    <td>{z.descripcion ?? '—'}</td>
                    <td>{z.ubicacion ?? '—'}</td>
                    <td>
                      <span className={BADGE_ZONA[z.estado_operativo] ?? 'badge badge-inactivo'}>
                        {z.estado_operativo}
                      </span>
                    </td>
                    <td>
                      {activos > 0
                        ? <span className="badge badge-activo">{activos} activo{activos !== 1 ? 's' : ''}</span>
                        : <span className="badge badge-inactivo">0 activos</span>
                      }
                    </td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => toggle(z.zona_id)}
                        disabled={items.length === 0}
                      >
                        {expandido === z.zona_id ? 'Ocultar' : 'Ver detalle'}
                      </button>
                    </td>
                  </tr>

                  {expandido === z.zona_id && items.length > 0 && (
                    <tr className="zone-row">
                      <td colSpan={7} style={{ padding: '12px 16px' }}>
                        <table className="inner-table">
                          <thead>
                            <tr>
                              <th>Sensor</th>
                              <th>Tipo sensor</th>
                              <th>Tipo lectura</th>
                              <th>Umbral</th>
                              <th>Lectura actual</th>
                              <th>Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {items.map(({ monitoreo: m, sensor: s }) => {
                              const actual = m.lectura_actual
                              const supera = actual > m.valor_umbral
                              return (
                                <tr key={m.monitoreo_id} className={supera ? 'row-alerta' : ''}>
                                  <td>{s?.nombre ?? `Sensor #${m.sensor_id}`}</td>
                                  <td>{s?.tipo ?? '—'}</td>
                                  <td>{m.tipo_lectura}</td>
                                  <td>{m.valor_umbral}</td>
                                  <td>
                                    <span className={supera ? 'lectura-alerta' : 'lectura-ok'}>
                                      {actual}
                                      {supera
                                        ? <span className="alerta-tag"> ▲ Supera umbral</span>
                                        : <span className="ok-tag"> ✓</span>}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={m.estado === 'ACTIVO' ? 'badge badge-activo' : 'badge badge-pausado'}>
                                      {m.estado}
                                    </span>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
