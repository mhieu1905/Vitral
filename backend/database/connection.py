import os
import json
from pathlib import Path
from typing import Any, Dict, List, Optional

from dotenv import load_dotenv
import httpx
from urllib.parse import quote_plus


# ── Load .env ─────────────────────────────────────────────────────────────────
backend_env_path = Path(__file__).resolve().parents[1] / ".env"
root_env_path    = Path(__file__).resolve().parents[2] / ".env.local"

if backend_env_path.exists():
    load_dotenv(dotenv_path=backend_env_path)
    print(f"[backend] Loaded env from {backend_env_path}")
elif root_env_path.exists():
    load_dotenv(dotenv_path=root_env_path)
    print(f"[backend] Loaded env from {root_env_path}")
else:
    print(f"[backend] No .env file found at {backend_env_path} or {root_env_path}")


# ── Response wrapper ──────────────────────────────────────────────────────────
class SupabaseResponse:
    def __init__(self, data: Optional[List[Dict[str, Any]]] = None):
        self.data = data or []


# ── Auth user wrapper ─────────────────────────────────────────────────────────
class UserObject:
    """Giống response của supabase-py: resp.user.id"""
    def __init__(self, user_data: Dict[str, Any]):
        self.id            = user_data.get("id", "")
        self.email         = user_data.get("email", "")
        self.role          = user_data.get("role", "")
        self.created_at    = user_data.get("created_at", "")

class UserResponse:
    def __init__(self, user_data: Dict[str, Any]):
        self.user = UserObject(user_data)


# ── Auth class ────────────────────────────────────────────────────────────────
class _Auth:
    """Minimal auth helper — chỉ cần get_user() để verify JWT."""

    def __init__(self, url: str, service_role_key: str):
        self.auth_url          = f"{url.rstrip('/')}/auth/v1"
        self.service_role_key  = service_role_key

    def get_user(self, token: str) -> UserResponse:
        """
        Gọi GET /auth/v1/user với user's JWT token.
        Supabase verify token phía server và trả về user data.
        Cần service_role_key trong apikey header để có quyền verify.
        """
        headers = {
            "apikey":        self.service_role_key,
            "Authorization": f"Bearer {token}",   # ← token của user, không phải service key
            "Content-Type":  "application/json",
        }

        print(f"[AUTH] Calling {self.auth_url}/user")
        resp = httpx.get(f"{self.auth_url}/user", headers=headers, timeout=10.0)

        print(f"[AUTH] Response status={resp.status_code}")

        if resp.status_code == 401:
            raise Exception(f"Token invalid or expired: {resp.text}")

        if resp.status_code != 200:
            raise Exception(f"Auth error {resp.status_code}: {resp.text}")

        data = resp.json()
        print(f"[AUTH] User id={data.get('id')} email={data.get('email')}")
        return UserResponse(data)


# ── Table builder ─────────────────────────────────────────────────────────────
class _Table:
    def __init__(self, client: "SupabaseClient", table_name: str):
        self.client     = client
        self.table_name = table_name
        self._op        = None
        self._payload   = None
        self._select    = "*"
        self._filters:  List[str] = []
        self._order:    Optional[str] = None
        self._limit:    Optional[int] = None
        self._on_conflict: Optional[str] = None

    def insert(self, payload: Dict[str, Any]):
        self._op      = "insert"
        self._payload = payload
        return self

    def upsert(self, payload: Dict[str, Any], on_conflict: Optional[str] = None):
        self._op          = "upsert"
        self._payload     = payload
        self._on_conflict = on_conflict
        return self

    def select(self, columns: str = "*"):
        self._op     = "select"
        self._select = columns
        return self

    def update(self, payload: Dict[str, Any]):
        self._op      = "update"
        self._payload = payload
        return self

    def eq(self, field: str, value: Any):
        self._filters.append(f"{field}=eq.{value}")
        return self

    def gte(self, field: str, value: Any):
        self._filters.append(f"{field}=gte.{value}")
        return self

    def order(self, field: str, desc: bool = False):
        direction    = "desc" if desc else "asc"
        self._order  = f"{field}.{direction}"
        return self

    def limit(self, n: int):
        self._limit = n
        return self

    def maybeSingle(self):
        """Giới hạn 1 kết quả, trả None nếu không có (không raise lỗi)."""
        self._limit = 1
        result = self.execute()
        return result.data[0] if result.data else None

    def single(self):
        """Giới hạn 1 kết quả, raise nếu không có."""
        self._limit = 1
        result = self.execute()
        if not result.data:
            raise RuntimeError(f"No rows found in {self.table_name}")
        return result.data[0]

    def _build_query(self) -> str:
        parts = []
        if self._filters:
            parts.extend(self._filters)
        if self._select and self._op == "select":
            parts.append(f"select={self._select}")
        if self._order:
            parts.append(f"order={self._order}")
        if self._limit:
            parts.append(f"limit={self._limit}")
        return "&".join(parts)

    def execute(self) -> SupabaseResponse:
        base    = f"{self.client.rest_url}/{self.table_name}"
        headers = self.client.headers.copy()
        print(f"[backend] Supabase request op={self._op} table={self.table_name} on_conflict={self._on_conflict}")

        if self._op == "insert":
            headers["Prefer"] = "return=representation"
            body = self._payload if isinstance(self._payload, list) else [self._payload]
            print(f"[backend] Supabase POST body={body}")
            resp = httpx.post(base, headers=headers, json=body, timeout=10.0)
            try:
                resp.raise_for_status()
            except httpx.HTTPStatusError:
                print(f"[backend] insert error {resp.status_code}: {resp.text}")
                raise RuntimeError(f"Supabase insert error {resp.status_code}: {resp.text}")
            return SupabaseResponse(data=resp.json())

        if self._op == "upsert":
            headers["Prefer"] = "return=representation,resolution=merge-duplicates"
            body = self._payload if isinstance(self._payload, list) else [self._payload]
            url  = base
            if self._on_conflict:
                url = f"{base}?on_conflict={quote_plus(self._on_conflict)}"
            resp = httpx.post(url, headers=headers, json=body, timeout=10.0)
            try:
                resp.raise_for_status()
            except httpx.HTTPStatusError:
                print(f"[backend] upsert error {resp.status_code}: {resp.text}")
                raise RuntimeError(f"Supabase upsert error {resp.status_code}: {resp.text}")
            return SupabaseResponse(data=resp.json())

        if self._op == "select":
            query = self._build_query()
            url   = f"{base}?{query}" if query else base
            resp  = httpx.get(url, headers=headers, timeout=10.0)
            try:
                resp.raise_for_status()
            except httpx.HTTPStatusError:
                print(f"[backend] select error {resp.status_code}: {resp.text}")
                raise RuntimeError(f"Supabase select error {resp.status_code}: {resp.text}")
            return SupabaseResponse(data=resp.json())

        if self._op == "update":
            headers["Prefer"] = "return=representation"
            query = self._build_query()
            url   = f"{base}?{query}" if query else base
            resp  = httpx.patch(url, headers=headers, json=self._payload, timeout=10.0)
            try:
                resp.raise_for_status()
            except httpx.HTTPStatusError:
                print(f"[backend] update error {resp.status_code}: {resp.text}")
                raise RuntimeError(f"Supabase update error {resp.status_code}: {resp.text}")
            return SupabaseResponse(data=resp.json())

        raise RuntimeError(f"Unsupported operation: {self._op}")


# ── Main client ───────────────────────────────────────────────────────────────
class SupabaseClient:
    def __init__(self, url: str, key: str, service_role_key: str = ""):
        self.url              = url.rstrip("/")
        self.key              = key
        self.rest_url         = f"{self.url}/rest/v1"
        self.headers = {
            "apikey":        self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type":  "application/json",
        }
        # Auth helper — dùng service_role_key để verify user tokens
        _srk = service_role_key or key
        self.auth = _Auth(self.url, _srk)

    def table(self, name: str) -> _Table:
        return _Table(self, name)


# ── Factory ───────────────────────────────────────────────────────────────────
def get_supabase_client() -> SupabaseClient:
    supabase_url = (
        os.environ.get("SUPABASE_URL") or
        os.environ.get("EXPO_PUBLIC_SUPABASE_URL", "")
    )
    # Anon key — dùng cho REST queries (table operations)
    supabase_key = (
        os.environ.get("SUPABASE_KEY") or
        os.environ.get("EXPO_PUBLIC_SUPABASE_KEY", "")
    )
    # Service role key — dùng để verify user JWT tokens
    service_role_key = (
        os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or
        os.environ.get("SUPABASE_SERVICE_KEY", "")
    )

    print(
        f"[backend] SUPABASE_URL loaded={bool(supabase_url)} "
        f"SUPABASE_KEY loaded={bool(supabase_key)} "
        f"service_role_key loaded={bool(service_role_key)} "
        f"key_prefix={service_role_key[:10] if service_role_key else 'None'}"
    )

    if not supabase_url or not supabase_key:
        raise RuntimeError(
            "Missing SUPABASE_URL or SUPABASE_KEY in .env"
        )

    return SupabaseClient(supabase_url, supabase_key, service_role_key)