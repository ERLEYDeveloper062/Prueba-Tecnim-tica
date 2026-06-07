"""
Lógica de negocio para sensores.
"""

from fastapi import HTTPException
from supabase import Client

from app.repositories import sensores as sensor_repository


def obtener_todos(client: Client):
    return sensor_repository.obtener_todos(client)


def obtener_zonas(sensor_id: int, client: Client):
    sensor = sensor_repository.obtener_por_id(sensor_id, client)

    if not sensor:
        raise HTTPException(
            status_code=404,
            detail=f"Sensor con id {sensor_id} no encontrado"
        )

    return sensor_repository.obtener_zonas_por_sensor(sensor_id, client)
