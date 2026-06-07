import { useEffect, useState } from 'react'
import { getMonitoreos, getSensores } from '../api/api'
import ActualizarMonitoreoForm from './ActualizarMonitoreoForm'

function lecturaSimulada(id, umbral) {
  return +( umbral * (0.55 + (id * 17 % 90) / 100) ).toFixed(2)
}

export default function MonitoreoList({ refresh }) {
  const [monitoreos, setMonitoreos] = useState([])
  const [sensoresMap, setSensoresMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [editando, setEditando] = useState(null)

  function cargar(estado) {
    setLoading(true)
    setError(null)
    Promise.all([getMonitoreos(estado || undefined), getSensores()])
      .then(([monitoreos, sensores]) => {
        setMonitoreos(monitoreos)
        setSensoresMap(Object.fromEntries(sensores.map(s => [s.sensor_id, s])))
      })
      .catch(() => setError('No se pudieron cargar los monitoreos.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar(filtroEstado) }, [filtroEstado, refresh])

  function handleGuardado(actualizado) {
    setMonitoreos(prev =>
      prev.map(m => m.monitoreo_id === actualizado.monitoreo_id ? actualizado : m)
    )
    setEditando(null)
  }

  return (
    <div>
      <div className="filter-bar">
        <label>Filtrar por estado:</label>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
          <option value="">Todos</option>
          <option value="ACTIVO">ACTIVO</option>
          <option value="PAUSADO">PAUSADO</option>
        </select>
      </div>

      {loading && <p className="state-msg">Cargando monitoreos...</p>}
      {error   && <p className="state-msg error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Sensor</th>
                    <th>Zona</th>
                    <th>Tipo lectura</th>
                    <th>Umbral config.</th>
                    <th>Lectura actual *</th>
                    <th>Instalación</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {monitoreos.length === 0 && (
                    <tr>
                      <td colSpan={9} className="state-msg">Sin monitoreos registrados.</td>
                    </tr>
                  )}
                  {monitoreos.map(m => {
                    const sensor = sensoresMap[m.sensor_id]
                    const actual = lecturaSimulada(m.monitoreo_id, m.valor_umbral)
                    const supera = actual > m.valor_umbral

                    return (
                      <tr key={m.monitoreo_id} className={supera && m.estado === 'ACTIVO' ? 'row-alerta' : ''}>
                        <td>{m.monitoreo_id}</td>
                        <td>{sensor?.nombre ?? `#${m.sensor_id}`}</td>
                        <td>#{m.zona_id}</td>
                        <td>{m.tipo_lectura}</td>
                        <td>
                          {editando === m.monitoreo_id ? (
                            <ActualizarMonitoreoForm
                              monitoreo={m}
                              onGuardado={handleGuardado}
                              onCancelar={() => setEditando(null)}
                            />
                          ) : (
                            m.valor_umbral
                          )}
                        </td>
                        <td>
                          {editando !== m.monitoreo_id && (
                            <span className={supera && m.estado === 'ACTIVO' ? 'lectura-alerta' : 'lectura-ok'}>
                              {actual}
                              {supera && m.estado === 'ACTIVO'
                                ? <span className="alerta-tag"> ▲ Supera umbral</span>
                                : <span className="ok-tag"> ✓</span>}
                            </span>
                          )}
                        </td>
                        <td>{m.fecha_instalacion}</td>
                        <td>
                          <span className={m.estado === 'ACTIVO' ? 'badge badge-activo' : 'badge badge-pausado'}>
                            {m.estado}
                          </span>
                        </td>
                        <td>
                          {editando !== m.monitoreo_id && (
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => setEditando(m.monitoreo_id)}
                            >
                              Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="sim-note">* Lectura simulada con fines de demostración.</p>
        </>
      )}
    </div>
  )
}
