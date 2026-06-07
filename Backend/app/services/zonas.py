"""
Lógica de negocio para zonas.
"""

from fastapi import HTTPException
from supabase import Client

from app.repositories import zonas as zona_repository


def obtener_todas(client: Client):
    return zona_repository.obtener_todas(client)


def obtener_por_id(zona_id: int, client: Client):
    zona = zona_repository.obtener_por_id(zona_id, client)
    if not zona:
        raise HTTPException(
            status_code=404,
            detail=f"Zona con id {zona_id} no encontrada",
        )
    return zona


def obtener_sensores(zona_id: int, client: Client):
    zona = zona_repository.obtener_por_id(zona_id, client)

    if not zona:
        raise HTTPException(
            status_code=404,
            detail=f"Zona con id {zona_id} no encontrada",
        )

    return zona_repository.obtener_sensores_por_zona(zona_id, client)
