# Sistema de Monitoreo Industrial

API REST + interfaz web para gestionar sensores industriales, zonas de operación y sus monitoreos activos.

---

## Tecnologías utilizadas

### Backend
| Tecnología | Versión | Rol |
|---|---|---|
| Python | 3.12 | Lenguaje base |
| FastAPI | ≥ 0.111 | Framework HTTP y documentación automática |
| Pydantic v2 | ≥ 2.7 | Validación de esquemas de entrada/salida |
| supabase-py | ≥ 2.0 | Cliente REST para la base de datos |
| Uvicorn | ≥ 0.29 | Servidor ASGI |
| python-dotenv | ≥ 1.0 | Gestión de variables de entorno |
| pytest | ≥ 7.0 | Suite de pruebas |

### Frontend
| Tecnología | Versión | Rol |
|---|---|---|
| React | 19 | Biblioteca de UI |
| Vite | 8 | Bundler y servidor de desarrollo |
| Axios | ≥ 1.17 | Cliente HTTP para consumir la API |

### Base de datos
| Tecnología | Rol |
|---|---|
| PostgreSQL (Supabase) | Motor relacional gestionado en la nube |

---

## Requisitos previos

- **Python 3.12** instalado y disponible en PATH
- **Node.js 18+** y **npm** instalados
- Una cuenta en [Supabase](https://supabase.com) con un proyecto creado y las tablas del `schema.sql` aplicadas

---

## Configuración de la base de datos

1. En tu proyecto de Supabase, abre el **SQL Editor** y ejecuta el contenido de `Backend/schema.sql` para crear las tablas e insertar los datos de prueba.

---

## Ejecución local

### Backend

```bash
# 1. Entrar al directorio
cd Backend

# 2. Crear y activar el entorno virtual
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Crear el archivo de variables de entorno
# Copia el ejemplo y rellena tus credenciales de Supabase
```

Crea el archivo `Backend/.env` con el siguiente contenido:

```env
SUPABASE_URL=https://<tu-proyecto>.supabase.co
SUPABASE_API_KEY=<tu-anon-o-service-key>
```

```bash
# 5. Iniciar el servidor
uvicorn main:app --reload
```

El servidor queda disponible en **http://localhost:8000**.  
Documentación interactiva: **http://localhost:8000/docs**

---

### Frontend

```bash
# 1. Entrar al directorio (en otra terminal)
cd Frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación queda disponible en **http://localhost:5173**.

> El backend debe estar corriendo en `localhost:8000` antes de abrir el frontend.

---

## Otros comandos útiles

### Backend

```bash
# Ejecutar todos los tests (requiere .env configurado)
cd Backend
pytest

# Ejecutar un archivo de tests específico
pytest tests/test_sensores.py

# Ejecutar un test puntual
pytest tests/test_monitoreo.py::test_crear_monitoreo

# Build de producción del frontend
cd Frontend
npm run build

# Lint del frontend
npm run lint
```

---

## Arquitectura

```
Prueba tecnica/
├── Backend/
│   ├── main.py                  # Punto de entrada: FastAPI app, CORS, routers
│   ├── requirements.txt
│   ├── schema.sql               # DDL + datos de prueba
│   ├── app/
│   │   ├── database.py          # Singleton del cliente Supabase + dependencia get_client()
│   │   ├── routers/             # Capa HTTP — recibe requests y devuelve responses
│   │   │   ├── sensores.py
│   │   │   ├── zonas.py
│   │   │   └── monitoreo.py
│   │   ├── services/            # Lógica de negocio — validaciones y guards 404
│   │   │   ├── sensores.py
│   │   │   ├── zonas.py
│   │   │   └── monitoreo.py
│   │   ├── repositories/        # Acceso a datos — queries puras a Supabase
│   │   │   ├── sensores.py
│   │   │   ├── zonas.py
│   │   │   └── monitoreo.py
│   │   └── schemas/             # Modelos Pydantic de entrada/salida
│   │       ├── sensores.py
│   │       ├── zonas.py
│   │       └── monitoreo.py
│   └── tests/
│       ├── conftest.py          # Fixture que crea y limpia datos reales en Supabase
│       ├── test_sensores.py
│       ├── test_zonas.py
│       └── test_monitoreo.py
│
└── Frontend/
    └── src/
        ├── api/
        │   └── api.js           # Cliente axios — una función por endpoint
        ├── pages/
        │   ├── SensoresPage.jsx
        │   ├── ZonasPage.jsx
        │   └── MonitoreosPage.jsx
        └── components/
            ├── SensorList.jsx
            ├── ZonaList.jsx
            ├── MonitoreoList.jsx
            ├── CrearMonitoreoForm.jsx
            └── ActualizarMonitoreoForm.jsx
```

### Flujo de una request en el backend

```
HTTP Request
    │
    ▼
Router          valida tipos con Pydantic, inyecta cliente Supabase
    │
    ▼
Service         aplica reglas de negocio, lanza HTTPException si algo falla
    │
    ▼
Repository      ejecuta la query REST contra Supabase, devuelve datos crudos
    │
    ▼
Supabase        PostgreSQL gestionado en la nube
```

---

## Endpoints de la API

Base URL: `http://localhost:8000/api/v1`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/sensores/` | Lista todos los sensores |
| GET | `/sensores/{id}/zonas` | Zonas asociadas a un sensor |
| GET | `/zonas/` | Lista todas las zonas |
| GET | `/zonas/{id}` | Detalle de una zona |
| GET | `/zonas/{id}/sensores` | Sensores activos en una zona |
| GET | `/monitoreos/` | Lista monitoreos (filtro opcional `?estado=ACTIVO\|PAUSADO`) |
| GET | `/monitoreos/{id}` | Detalle de un monitoreo |
| POST | `/monitoreos/` | Crea un nuevo monitoreo |
| PATCH | `/monitoreos/{id}` | Actualiza `valor_umbral` y/o `estado` |
