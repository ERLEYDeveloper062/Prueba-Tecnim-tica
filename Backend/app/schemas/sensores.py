"""
Schemas para los endpoints de sensores.
"""

from datetime import date, datetime

from pydantic import (
    BaseModel,
    ConfigDict
)


class SensorBase(BaseModel):
    nombre: str
    tipo: str | None = None
    fabricante: str | None = None
    fecha_fabricacion: date | None = None


class CrearSensor(SensorBase):
    pass


class RespuestaSensor(SensorBase):
    sensor_id: int

    fecha_creacion: datetime | None = None

    model_config = ConfigDict(
        from_attributes=True
    )