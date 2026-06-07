"""
Acceso a datos de la tabla sensores via Supabase REST API.
No contiene lógica de negocio.
"""

from supabase import Client


def obtener_todos(client: Client):
    return client.table("sensores").select("*").execute().data


def obtener_por_id(sensor_id: int, client: Client):
    rows = (
        client.table("sensores")
        .select("*")
        .eq("sensor_id", sensor_id)
        .execute()
        .data
    )
    return rows[0] if rows else None


def obtener_zonas_por_sensor(sensor_id: int, client: Client):
    """Devuelve las zonas asociadas a un sensor a través de monitoreos."""
    rows = (
        client.table("monitoreos")
        .select("zonas(*)")
        .eq("sensor_id", sensor_id)
        .execute()
        .data
    )
    return [row["zonas"] for row in rows if row.get("zonas")]
