"""
Endpoints de monitoreos.
"""

from typing import Optional

from fastapi import APIRouter, Depends
from supabase import Client

from app.database import get_client
from app.schemas.monitoreo import (
    CrearMonitoreo,
    ActualizarMonitoreo,
    RespuestaMonitoreo,
)
from app.services import monitoreo as monitoreo_service


router = APIRouter(
    prefix="/monitoreos",
    tags=["Monitoreos"]
)


@router.get("/{monitoreo_id}", response_model=RespuestaMonitoreo)
def obtener_monitoreo(
    monitoreo_id: int,
    client: Client = Depends(get_client)
):
    """Devuelve un monitoreo por su ID."""
    return monitoreo_service.obtener_por_id(monitoreo_id, client)


@router.get("/", response_model=list[RespuestaMonitoreo])
def obtener_monitoreos(
    estado: Optional[str] = None,
    client: Client = Depends(get_client)
):
    """Lista todos los monitoreos."""
    return monitoreo_service.obtener_todos(client, estado)


@router.post(
    "/",
    response_model=RespuestaMonitoreo,
    status_code=201
)
def crear_monitoreo(
    datos: CrearMonitoreo,
    client: Client = Depends(get_client)
):
    """Crea un monitoreo."""
    return monitoreo_service.crear(datos, client)


@router.patch(
    "/{monitoreo_id}",
    response_model=RespuestaMonitoreo
)
def actualizar_monitoreo(
    monitoreo_id: int,
    datos: ActualizarMonitoreo,
    client: Client = Depends(get_client)
):
    """Actualiza un monitoreo."""
    return monitoreo_service.actualizar(monitoreo_id, datos, client)
