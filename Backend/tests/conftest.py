import pytest
from fastapi.testclient import TestClient

from main import app
from app.database import supabase


@pytest.fixture(scope="session")
def client():
    return TestClient(app)


@pytest.fixture(scope="session")
def datos_test():
    """Crea sensor, zona y monitoreo de prueba en Supabase y los elimina al finalizar."""

    sensor = supabase.table("sensores").insert({
        "nombre": "Sensor Pytest",
        "tipo": "temperatura",
        "fabricante": "Test",
    }).execute().data[0]
    sid = sensor["sensor_id"]

    zona = supabase.table("zonas").insert({
        "nombre": "Zona Pytest",
        "estado_operativo": "activo",
    }).execute().data[0]
    zid = zona["zona_id"]

    monitoreo = supabase.table("monitoreos").insert({
        "sensor_id": sid,
        "zona_id": zid,
        "fecha_instalacion": "2026-06-07",
        "tipo_lectura": "temperatura",
        "valor_umbral": 50.0,
        "estado": "ACTIVO",
    }).execute().data[0]
    mid = monitoreo["monitoreo_id"]

    yield {"sensor_id": sid, "zona_id": zid, "monitoreo_id": mid}

    # Limpieza: primero monitoreos (FK), luego sensor y zona
    supabase.table("monitoreos").delete().eq("sensor_id", sid).execute()
    supabase.table("sensores").delete().eq("sensor_id", sid).execute()
    supabase.table("zonas").delete().eq("zona_id", zid).execute()
