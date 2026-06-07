import { useState } from 'react'
import MonitoreoList from '../components/MonitoreoList'
import CrearMonitoreoForm from '../components/CrearMonitoreoForm'

export default function MonitoreosPage() {
  const [mostrarForm, setMostrarForm] = useState(false)
  const [refresh, setRefresh] = useState(0)

  function handleCreado() {
    setMostrarForm(false)
    setRefresh(n => n + 1)
  }

  return (
    <div>
      <div className="section-header">
        <h2>Monitoreos</h2>
        {!mostrarForm && (
          <button className="btn btn-primary" onClick={() => setMostrarForm(true)}>
            + Nuevo monitoreo
          </button>
        )}
      </div>

      {mostrarForm && (
        <CrearMonitoreoForm
          onCreado={handleCreado}
          onCancelar={() => setMostrarForm(false)}
        />
      )}

      <MonitoreoList refresh={refresh} />
    </div>
  )
}
