from fastapi.testclient import TestClient
from main import app

cliente = TestClient(app)


def test_obtener_monitoreos():
    respuesta = cliente.get("/api/v1/monitoreos/")
    assert respuesta.status_code == 200


def test_crear_monitoreo(datos_test):
    datos = {
        "sensor_id": datos_test["sensor_id"],
        "zona_id": datos_test["zona_id"],
        "fecha_instalacion": "2026-06-07",
        "tipo_lectura": "temperatura",
        "valor_umbral": 50,
    }
    respuesta = cliente.post("/api/v1/monitoreos/", json=datos)
    assert respuesta.status_code == 201


def test_monitoreo_no_existe():
    respuesta = cliente.get("/api/v1/monitoreos/9999")
    assert respuesta.status_code == 404


def test_actualizar_monitoreo(datos_test):
    datos = {"estado": "PAUSADO"}
    respuesta = cliente.patch(
        f"/api/v1/monitoreos/{datos_test['monitoreo_id']}",
        json=datos,
    )
    assert respuesta.status_code == 200


def test_estado_invalido(datos_test):
    datos = {"estado": "DETENIDO"}
    respuesta = cliente.patch(
        f"/api/v1/monitoreos/{datos_test['monitoreo_id']}",
        json=datos,
    )
    assert respuesta.status_code == 400


