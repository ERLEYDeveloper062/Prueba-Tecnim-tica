"""
FastAPI application — Sistema de Monitoreo Industrial.

Arrancar con:
    uvicorn app.main:app --reload
"""

import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routers import monitoreo, sensores, zonas

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Sistema de Monitoreo Industrial",
    description="API REST para gestión de sensores, zonas y monitoreos.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"

app.include_router(sensores.router, prefix=API_PREFIX)
app.include_router(zonas.router, prefix=API_PREFIX)
app.include_router(monitoreo.router, prefix=API_PREFIX)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error("Error no controlado en %s: %s", request.url, exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Error interno del servidor. Consulta los logs para más detalles."},
    )


@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok", "version": "1.0.0"}
