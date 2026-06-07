"""
Acceso a datos de la tabla zonas via Supabase REST API.
No contiene lógica de negocio.
"""

from supabase import Client


def obtener_todas(client: Client):
    return client.table("zonas").select("*").execute().data


def obtener_por_id(zona_id: int, client: Client):
    rows = (
        client.table("zonas")
        .select("*")
        .eq("zona_id", zona_id)
        .execute()
        .data
    )
    return rows[0] if rows else None


def obtener_sensores_por_zona(zona_id: int, client: Client):
    """Devuelve los sensores activos de una zona a través de monitoreos."""
    rows = (
        client.table("monitoreos")
        .select("sensores(*)")
        .eq("zona_id", zona_id)
        .eq("estado", "ACTIVO")
        .execute()
        .data
    )
    return [row["sensores"] for row in rows if row.get("sensores")]
