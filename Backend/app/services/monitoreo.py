"""
Lógica de negocio para monitoreos.
"""

from fastapi import HTTPException
from supabase import Client

from app.repositories import (
    monitoreo as monitoreo_repository,
    sensores as sensor_repository,
    zonas as zona_repository,
)
from app.schemas.monitoreo import CrearMonitoreo, ActualizarMonitoreo


TIPOS_VALIDOS = {"temperatura", "presion", "vibracion", "flujo"}
ESTADOS_VALIDOS = {"ACTIVO", "PAUSADO"}


def validar_tipo_lectura(tipo: str):
    if tipo not in TIPOS_VALIDOS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"El tipo de lectura '{tipo}' no es válido. "
                "Valores permitidos: temperatura, presion, vibracion, flujo"
            )
        )


def validar_estado(estado: str):
    if estado not in ESTADOS_VALIDOS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"El estado '{estado}' no es válido. "
                "Valores permitidos: ACTIVO, PAUSADO"
            )
        )


def obtener_por_id(monitoreo_id: int, client: Client):
    monitoreo = monitoreo_repository.obtener_por_id(monitoreo_id, client)
    if not monitoreo:
        raise HTTPException(
            status_code=404,
            detail=f"Monitoreo con id {monitoreo_id} no encontrado"
        )
    return monitoreo


def obtener_todos(client: Client, estado: str | None = None):
    if estado:
        validar_estado(estado)
    return monitoreo_repository.obtener_todos(client, estado)


def crear(datos: CrearMonitoreo, client: Client):
    if not sensor_repository.obtener_por_id(datos.sensor_id, client):
        raise HTTPException(
            status_code=404,
            detail=f"Sensor con id {datos.sensor_id} no encontrado"
        )

    if not zona_repository.obtener_por_id(datos.zona_id, client):
        raise HTTPException(
            status_code=404,
            detail=f"Zona con id {datos.zona_id} no encontrada"
        )

    validar_tipo_lectura(datos.tipo_lectura)
    validar_estado(datos.estado)

    return monitoreo_repository.crear(datos, client)


def actualizar(monitoreo_id: int, datos: ActualizarMonitoreo, client: Client):
    if not monitoreo_repository.obtener_por_id(monitoreo_id, client):
        raise HTTPException(
            status_code=404,
            detail=f"Monitoreo con id {monitoreo_id} no encontrado"
        )

    if datos.estado:
        validar_estado(datos.estado)

    return monitoreo_repository.actualizar(monitoreo_id, datos, client)
