from fastapi.testclient import TestClient
from main import app

cliente = TestClient(app)


def test_obtener_sensores_zona(datos_test):
    respuesta = cliente.get(f"/api/v1/zonas/{datos_test['zona_id']}/sensores")
    assert respuesta.status_code == 200


def test_zona_no_existe():
    respuesta = cliente.get("/api/v1/zonas/9999/sensores")
    assert respuesta.status_code == 404


def test_zona_inexistente(datos_test):
    datos = {
        "sensor_id": datos_test["sensor_id"],
        "zona_id": 9999,
        "fecha_instalacion": "2026-06-07",
        "tipo_lectura": "temperatura",
        "valor_umbral": 50,
    }
    respuesta = cliente.post("/api/v1/monitoreos/", json=datos)
    assert respuesta.status_code == 404
