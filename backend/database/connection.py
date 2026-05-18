import os
import json
from pathlib import Path
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
import httpx
from urllib.parse import quote_plus

# Prefer loading backend/.env when the backend package is executed.
backend_env_path = Path(__file__).resolve().parents[1] / ".env"
root_env_path = Path(__file__).resolve().parents[2] / ".env.local"

if backend_env_path.exists():
    load_dotenv(dotenv_path=backend_env_path)
    print(f"[backend] Loaded env from {backend_env_path}")
elif root_env_path.exists():
    load_dotenv(dotenv_path=root_env_path)
    print(f"[backend] Loaded env from {root_env_path}")
else:
    print(f"[backend] No .env file found at {backend_env_path} or {root_env_path}")


class SupabaseResponse:
    """Simple response object to mimic the `.data` attribute used in services."""

    def __init__(self, data: Optional[List[Dict[str, Any]]] = None):
        self.data = data or []


class _Table:
    def __init__(self, client: "SupabaseClient", table_name: str):
        self.client = client
        self.table_name = table_name
        self._op = None
        self._payload = None
        self._select = "*"
        self._filters: List[str] = []
        self._on_conflict: Optional[str] = None

    def insert(self, payload: Dict[str, Any]):
        self._op = "insert"
        self._payload = payload
        self._on_conflict = None
        return self

    def upsert(self, payload: Dict[str, Any], on_conflict: Optional[str] = None):
        self._op = "upsert"
        self._payload = payload
        self._on_conflict = on_conflict
        return self

    def select(self, columns: str = "*"):
        self._op = "select"
        self._select = columns
        return self

    def update(self, payload: Dict[str, Any]):
        self._op = "update"
        self._payload = payload
        self._on_conflict = None
        return self

    def eq(self, field: str, value: Any):
        # Supabase/PostgREST eq filter format
        self._filters.append(f"{field}=eq.{value}")
        return self

    def _build_filter_query(self) -> str:
        return "&".join(self._filters) if self._filters else ""

    def execute(self) -> SupabaseResponse:
        base = f"{self.client.rest_url}/{self.table_name}"
        headers = self.client.headers.copy()
        print(f"[backend] Supabase request op={self._op} table={self.table_name} on_conflict={self._on_conflict}")

        if self._op == "insert":
            # Use Prefer header to return representation so we can mirror supabase client behavior
            headers["Prefer"] = "return=representation"
            body = self._payload if isinstance(self._payload, list) else [self._payload]
            print(f"[backend] Supabase POST body={body}")
            resp = httpx.post(base, headers=headers, json=body, timeout=10.0)
            try:
                resp.raise_for_status()
            except httpx.HTTPStatusError:
                print(f"[backend] Supabase insert error status={resp.status_code} text={resp.text}")
                raise RuntimeError(f"Supabase insert error {resp.status_code}: {resp.text}")
            return SupabaseResponse(data=resp.json())

        if self._op == "upsert":
            headers["Prefer"] = "return=representation,resolution=merge-duplicates"
            body = self._payload if isinstance(self._payload, list) else [self._payload]
            url = base
            if self._on_conflict:
                query = quote_plus(self._on_conflict)
                url = f"{base}?on_conflict={query}"
            print(f"[backend] Supabase UPSERT url={url} body={body}")
            resp = httpx.post(url, headers=headers, json=body, timeout=10.0)
            try:
                resp.raise_for_status()
            except httpx.HTTPStatusError:
                print(f"[backend] Supabase upsert error status={resp.status_code} text={resp.text}")
                raise RuntimeError(f"Supabase upsert error {resp.status_code}: {resp.text}")
            return SupabaseResponse(data=resp.json())

        if self._op == "select":
            filter_q = self._build_filter_query()
            if filter_q:
                url = f"{base}?{filter_q}&select={self._select}"
            else:
                url = f"{base}?select={self._select}"
            resp = httpx.get(url, headers=headers, timeout=10.0)
            try:
                resp.raise_for_status()
            except httpx.HTTPStatusError:
                print(f"[backend] Supabase select error status={resp.status_code} text={resp.text}")
                raise RuntimeError(f"Supabase select error {resp.status_code}: {resp.text}")
            return SupabaseResponse(data=resp.json())

        if self._op == "update":
            headers["Prefer"] = "return=representation"
            filter_q = self._build_filter_query()
            url = base
            if filter_q:
                url = f"{base}?{filter_q}"
            resp = httpx.patch(url, headers=headers, json=self._payload, timeout=10.0)
            try:
                resp.raise_for_status()
            except httpx.HTTPStatusError:
                print(f"[backend] Supabase update error status={resp.status_code} text={resp.text}")
                raise RuntimeError(f"Supabase update error {resp.status_code}: {resp.text}")
            return SupabaseResponse(data=resp.json())

        raise RuntimeError("Unsupported operation on Supabase table wrapper")


class SupabaseClient:
    """Lightweight Supabase REST client exposing a `.table(name)` interface.

    This minimal client is implemented with `httpx` and provides enough
    behavior for the backend services to perform simple `select`, `insert`,
    and `update` operations via the Supabase REST API.
    """

    def __init__(self, url: str, key: str):
        self.url = url.rstrip("/")
        self.key = key
        self.rest_url = f"{self.url}/rest/v1"
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
        }

    def table(self, name: str) -> _Table:
        return _Table(self, name)


def get_supabase_client() -> SupabaseClient:
    """
    Initialize and return a SupabaseClient using environment variables.

    Loads configuration from backend/.env first, with a fallback to root .env.local.
    It accepts either `SUPABASE_URL`/`SUPABASE_KEY` or the Expo names
    `EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_KEY`.
    """
    supabase_url: str = os.environ.get("SUPABASE_URL") or os.environ.get("EXPO_PUBLIC_SUPABASE_URL", "")
    supabase_key: str = os.environ.get("SUPABASE_KEY") or os.environ.get("EXPO_PUBLIC_SUPABASE_KEY", "")

    print(f"[backend] SUPABASE_URL loaded={bool(supabase_url)} SUPABASE_KEY loaded={bool(supabase_key)}")

    if not supabase_url or not supabase_key:
        raise RuntimeError(
            "Supabase configuration not found. Add SUPABASE_URL and SUPABASE_KEY to backend/.env or set EXPO_PUBLIC_SUPABASE_* variables."
        )

    return SupabaseClient(supabase_url, supabase_key)
