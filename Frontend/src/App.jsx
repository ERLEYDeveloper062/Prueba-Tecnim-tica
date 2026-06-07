import { useState } from 'react'
import SensoresPage    from './pages/SensoresPage'
import ZonasPage       from './pages/ZonasPage'
import MonitoreosPage  from './pages/MonitoreosPage'

const TABS = [
  { id: 'sensores',   label: 'Sensores',   Page: SensoresPage },
  { id: 'zonas',      label: 'Zonas',      Page: ZonasPage },
  { id: 'monitoreos', label: 'Monitoreos', Page: MonitoreosPage },
]

function App() {
  const [tab, setTab] = useState('sensores')

  const { Page } = TABS.find(t => t.id === tab)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sistema de Monitoreo Industrial</h1>
      </header>

      <nav className="app-nav">
        {TABS.map(t => (
          <button
            key={t.id}
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="app-main">
        <Page />
      </main>
    </div>
  )
}

export default App
