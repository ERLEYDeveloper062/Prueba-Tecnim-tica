"""
Endpoints de sensores.
"""

from fastapi import APIRouter, Depends
from supabase import Client

from app.database import get_client
from app.schemas.sensores import RespuestaSensor
from app.schemas.zonas import RespuestaZona
from app.services import sensores


router = APIRouter(
    prefix="/sensores",
    tags=["Sensores"]
)


@router.get(
    "/",
    response_model=list[RespuestaSensor]
)
def obtener_sensores(
    client: Client = Depends(get_client)
):
    """Lista todos los sensores."""
    return sensores.obtener_todos(client)


@router.get(
    "/{sensor_id}/zonas",
    response_model=list[RespuestaZona]
)
def obtener_zonas_sensor(
    sensor_id: int,
    client: Client = Depends(get_client)
):
    """Devuelve las zonas asociadas a un sensor."""
    return sensores.obtener_zonas(sensor_id, client)
