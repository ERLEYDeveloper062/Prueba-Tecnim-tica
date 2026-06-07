import { useEffect, useState } from 'react'
import { getMonitoreos } from '../api/api'
import ActualizarMonitoreoForm from './ActualizarMonitoreoForm'

function badgeEstado(estado) {
  return estado === 'ACTIVO' ? 'badge badge-activo' : 'badge badge-pausado'
}

export default function MonitoreoList({ refresh }) {
  const [monitoreos, setMonitoreos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [editando, setEditando] = useState(null)

  function cargar(estado) {
    setLoading(true)
    setError(null)
    getMonitoreos(estado || undefined)
      .then(setMonitoreos)
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
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Sensor</th>
                  <th>Zona</th>
                  <th>Tipo lectura</th>
                  <th>Valor umbral</th>
                  <th>Instalación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {monitoreos.length === 0 && (
                  <tr>
                    <td colSpan={8} className="state-msg">Sin monitoreos registrados.</td>
                  </tr>
                )}
                {monitoreos.map(m => (
                  <tr key={m.monitoreo_id}>
                    <td>{m.monitoreo_id}</td>
                    <td>{m.sensor_id}</td>
                    <td>{m.zona_id}</td>
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
                    <td>{m.fecha_instalacion}</td>
                    <td><span className={badgeEstado(m.estado)}>{m.estado}</span></td>
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
