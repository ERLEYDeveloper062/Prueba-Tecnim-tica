"""
Endpoints de zonas.
"""

from fastapi import APIRouter, Depends
from supabase import Client

from app.database import get_client
from app.schemas.sensores import RespuestaSensor
from app.schemas.zonas import RespuestaZona
from app.services import zonas as zona_service


router = APIRouter(
    prefix="/zonas",
    tags=["Zonas"]
)


@router.get(
    "/",
    response_model=list[RespuestaZona]
)
def obtener_zonas(
    client: Client = Depends(get_client)
):
    """Lista todas las zonas."""
    return zona_service.obtener_todas(client)


@router.get(
    "/{zona_id}",
    response_model=RespuestaZona
)
def obtener_zona(
    zona_id: int,
    client: Client = Depends(get_client)
):
    """Devuelve una zona por su ID."""
    return zona_service.obtener_por_id(zona_id, client)


@router.get(
    "/{zona_id}/sensores",
    response_model=list[RespuestaSensor]
)
def obtener_sensores_zona(
    zona_id: int,
    client: Client = Depends(get_client)
):
    """Devuelve los sensores activos de una zona."""
    return zona_service.obtener_sensores(zona_id, client)
