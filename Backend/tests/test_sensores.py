from fastapi.testclient import TestClient
from main import app

cliente = TestClient(app)


def test_obtener_sensores():
    respuesta = cliente.get("/api/v1/sensores/")
    assert respuesta.status_code == 200
    assert isinstance(respuesta.json(), list)


def test_sensor_no_existe():
    respuesta = cliente.get("/api/v1/sensores/9999/zonas")
    assert respuesta.status_code == 404


def test_sensor_inexistente(datos_test):
    datos = {
        "sensor_id": 9999,
        "zona_id": datos_test["zona_id"],
        "fecha_instalacion": "2026-06-07",
        "tipo_lectura": "temperatura",
        "valor_umbral": 50,
    }
    respuesta = cliente.post("/api/v1/monitoreos/", json=datos)
    assert respuesta.status_code == 404
