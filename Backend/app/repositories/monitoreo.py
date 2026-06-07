"""
Acceso a datos de la tabla monitoreos via Supabase REST API.
No contiene lógica de negocio.
"""

from typing import Optional

from supabase import Client

from app.schemas.monitoreo import CrearMonitoreo, ActualizarMonitoreo


def obtener_todos(client: Client, estado: Optional[str] = None):
    query = client.table("monitoreos").select("*")
    if estado:
        query = query.eq("estado", estado)
    return query.execute().data


def obtener_por_id(monitoreo_id: int, client: Client):
    rows = (
        client.table("monitoreos")
        .select("*")
        .eq("monitoreo_id", monitoreo_id)
        .execute()
        .data
    )
    return rows[0] if rows else None


def crear(datos: CrearMonitoreo, client: Client):
    datos_dict = datos.model_dump()
    # fecha_instalacion es un objeto date — PostgREST necesita string ISO
    datos_dict["fecha_instalacion"] = str(datos_dict["fecha_instalacion"])
    return client.table("monitoreos").insert(datos_dict).execute().data[0]


def actualizar(monitoreo_id: int, datos: ActualizarMonitoreo, client: Client):
    datos_dict = datos.model_dump(exclude_unset=True)
    return (
        client.table("monitoreos")
        .update(datos_dict)
        .eq("monitoreo_id", monitoreo_id)
        .execute()
        .data[0]
    )
