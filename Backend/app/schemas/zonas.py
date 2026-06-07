"""
Schemas para los endpoints de zonas.
"""

from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict
)


class ZonaBase(BaseModel):
    nombre: str
    descripcion: str | None = None
    ubicacion: str | None = None
    estado_operativo: str | None = None


class CrearZona(ZonaBase):
    pass


class RespuestaZona(ZonaBase):
    zona_id: int

    fecha_creacion: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )