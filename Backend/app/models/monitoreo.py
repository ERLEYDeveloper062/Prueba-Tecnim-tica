"""ORM model for MONITORINGS — tabla puente M:N con atributos propios (sensor ↔ zone)."""

import datetime
from sqlalchemy import (
    Column, Integer, Float, String, Date, DateTime,
    ForeignKey, CheckConstraint,
)
from sqlalchemy.orm import relationship
from app.database import Base


class Monitoreo(Base):
    __tablename__ = "monitoreos"

    __table_args__ = (
        CheckConstraint(
            "tipo_lectura IN ('temperatura','presion','vibracion','flujo')",
            name="ck_monitoreo_tipo"
        ),
        CheckConstraint(
            "estado IN ('ACTIVO','PAUSADO')",
            name="ck_monitoreo_estado"
        ),
    )

    monitoreo_id = Column(Integer, primary_key=True, autoincrement=True)

    sensor_id = Column(
        Integer,
        ForeignKey("sensores.sensor_id"),
        nullable=False
    )

    zona_id = Column(
        Integer,
        ForeignKey("zonas.zona_id"),
        nullable=False
    )

    fecha_instalacion = Column(Date, nullable=False)

    tipo_lectura = Column(String(20))

    valor_umbral = Column(Float, nullable=False)

    estado = Column(String(10), default="ACTIVO")

    fecha_creacion = Column(
        DateTime,
        default=datetime.datetime.utcnow
    )

    sensor = relationship(
        "Sensor",
        back_populates="monitoreos"
    )

    zona = relationship(
        "Zona",
        back_populates="monitoreos"
    )