import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
})

// Sensores
export const getSensores = () =>
  api.get('/sensores/').then(r => r.data)

export const getZonasBySensor = (sensorId) =>
  api.get(`/sensores/${sensorId}/zonas`).then(r => r.data)

// Zonas
export const getZonas = () =>
  api.get('/zonas/').then(r => r.data)

export const getZona = (zonaId) =>
  api.get(`/zonas/${zonaId}`).then(r => r.data)

export const getSensoresByZona = (zonaId) =>
  api.get(`/zonas/${zonaId}/sensores`).then(r => r.data)

// Monitoreos
export const getMonitoreos = (estado) => {
  const params = estado ? { estado } : {}
  return api.get('/monitoreos/', { params }).then(r => r.data)
}

export const getMonitoreo = (monitoreoId) =>
  api.get(`/monitoreos/${monitoreoId}`).then(r => r.data)

export const crearMonitoreo = (datos) =>
  api.post('/monitoreos/', datos).then(r => r.data)

export const actualizarMonitoreo = (monitoreoId, datos) =>
  api.patch(`/monitoreos/${monitoreoId}`, datos).then(r => r.data)
