"""ORM model for the SENSORS table."""

import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class Sensor(Base):
    __tablename__ = "sensores"

    __table_args__ = (
        CheckConstraint(
            "tipo IN ('temperatura', 'presion', 'vibracion', 'flujo')",
            name="ck_sensor_tipo"
        ),
    )

    sensor_id = Column(Integer, primary_key=True, autoincrement=True)

    nombre = Column(String(100), nullable=False)

    tipo = Column(String(20), nullable=False)

    fabricante = Column(String(100))

    fecha_fabricacion = Column(Date)

    fecha_creacion = Column(
        DateTime,
        default=datetime.datetime.utcnow
    )

    monitoreos = relationship(
        "Monitoreo",
        back_populates="sensor"
    )