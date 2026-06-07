"""
Conexión a Supabase mediante el cliente REST oficial (supabase-py).
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# La URL puede venir con /rest/v1/ al final; create_client necesita solo la URL base.
_raw_url = os.getenv("SUPABASE_URL", "")
SUPABASE_URL = _raw_url.split("/rest/v1")[0]
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "SUPABASE_URL y SUPABASE_API_KEY deben estar configurados en el archivo .env"
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def get_client() -> Client:
    """Dependencia FastAPI que provee el cliente Supabase."""
    return supabase
