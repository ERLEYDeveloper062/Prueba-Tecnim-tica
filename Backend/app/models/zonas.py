"""Clase/modelo que representa la tabla ZONES en la base de datos, usando ORM (mapeo objeto-relacional)."""

import datetime
from sqlalchemy import Column, Integer, String, DateTime, CheckConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class Zona(Base):
    __tablename__ = "zonas"

    __table_args__ = (
        CheckConstraint(
            "estado_operativo IN ('activo', 'inactivo', 'mantenimiento')",
            name="ck_zona_estado"
        ),
    )

    zona_id = Column(Integer, primary_key=True, autoincrement=True)

    nombre = Column(String(100), nullable=False)

    descripcion = Column(String(500))

    ubicacion = Column(String(200))

    estado_operativo = Column(String(20))

    fecha_creacion = Column(
        DateTime,
        default=datetime.datetime.utcnow
    )

    monitoreos = relationship(
        "Monitoreo",
        back_populates="zona"
    )