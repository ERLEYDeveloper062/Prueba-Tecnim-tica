"""
Schemas para los endpoints de monitoreos.
"""

from datetime import date, datetime

from pydantic import (
    BaseModel,
    ConfigDict
)


class CrearMonitoreo(BaseModel):
    sensor_id: int
    zona_id: int
    fecha_instalacion: date
    tipo_lectura: str
    valor_umbral: float
    estado: str = "ACTIVO"


class ActualizarMonitoreo(BaseModel):
    valor_umbral: float | None = None
    estado: str | None = None


class RespuestaMonitoreo(BaseModel):
    monitoreo_id: int

    sensor_id: int
    zona_id: int

    fecha_instalacion: date

    tipo_lectura: str | None = None

    valor_umbral: float

    estado: str | None = None

    fecha_creacion: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )