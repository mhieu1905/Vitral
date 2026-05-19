import httpx
import os
from backend.models.stress_log import StressLogCreate, StressStats, StressTrend
from datetime import datetime, timedelta, timezone
from collections import defaultdict

SUPABASE_URL = (
    os.environ.get("SUPABASE_URL") or
    os.environ.get("EXPO_PUBLIC_SUPABASE_URL", "")
)


def _headers(user_token: str) -> dict:
    anon_key = (
        os.environ.get("SUPABASE_KEY") or
        os.environ.get("EXPO_PUBLIC_SUPABASE_KEY", "")
    )
    return {
        "apikey":        anon_key,
        "Authorization": f"Bearer {user_token}",
        "Content-Type":  "application/json",
    }


# ── Save ──────────────────────────────────────────────────────────────────────
def save_stress_log(user_id: str, payload: StressLogCreate, user_token: str) -> dict:
    url  = f"{SUPABASE_URL}/rest/v1/stress_logs"
    body = [{
        "user_id":      user_id,
        "stress_level": payload.stress_level,
        "note":         payload.note or "",
        "triggers":     payload.triggers or [],
    }]
    h = _headers(user_token)
    h["Prefer"] = "return=representation"

    print(f"[SERVICE] INSERT url={url}")
    print(f"[SERVICE] INSERT body={body}")

    resp = httpx.post(url, headers=h, json=body, timeout=10.0)
    print(f"[SERVICE] INSERT status={resp.status_code} response={resp.text[:200]}")

    if not resp.is_success:
        raise RuntimeError(f"Insert error {resp.status_code}: {resp.text}")

    return resp.json()[0]


# ── History ───────────────────────────────────────────────────────────────────
def get_stress_history(user_id: str, limit: int = 30, user_token: str = "") -> list:
    url = f"{SUPABASE_URL}/rest/v1/stress_logs"
    params = {
        "user_id": f"eq.{user_id}",
        "order":   "logged_at.desc",
        "limit":   str(limit),
        "select":  "*",
    }

    print(f"[SERVICE] HISTORY url={url} params={params}")
    resp = httpx.get(url, headers=_headers(user_token), params=params, timeout=10.0)
    print(f"[SERVICE] HISTORY status={resp.status_code}")

    if not resp.is_success:
        print(f"[SERVICE] HISTORY error: {resp.text}")
        return []

    rows = resp.json()
    print(f"[SERVICE] HISTORY count={len(rows)}")
    return rows


# ── Stats ─────────────────────────────────────────────────────────────────────
def get_stress_stats(user_id: str, user_token: str = "") -> StressStats:
    print(f"\n[SERVICE] ====== STATS START user={user_id} ======")
    print(f"[SERVICE] SUPABASE_URL={SUPABASE_URL}")
    print(f"[SERVICE] token_present={bool(user_token)}")

    now      = datetime.now(timezone.utc)
    since_30 = (now - timedelta(days=30)).isoformat()
    print(f"[SERVICE] since_30={since_30}")

    url    = f"{SUPABASE_URL}/rest/v1/stress_logs"
    params = {
        "user_id":   f"eq.{user_id}",
        "logged_at": f"gte.{since_30}",
        "order":     "logged_at.asc",
        "select":    "stress_level,logged_at",
    }

    print(f"[SERVICE] STATS GET url={url}")
    print(f"[SERVICE] STATS params={params}")

    resp = httpx.get(url, headers=_headers(user_token), params=params, timeout=10.0)
    print(f"[SERVICE] STATS status={resp.status_code}")
    print(f"[SERVICE] STATS raw response={resp.text[:500]}")

    EMPTY = StressStats(
        avg_7days=0, avg_30days=0,
        highest=0, lowest=0,
        total_logs=0, trend=[]
    )

    if not resp.is_success:
        print(f"[SERVICE] STATS request failed!")
        return EMPTY

    rows = resp.json()
    print(f"[SERVICE] STATS rows_count={len(rows)}")

    if not rows:
        print(f"[SERVICE] STATS no rows — returning empty")
        return EMPTY

    # ── Tính avg 30 ngày ─────────────────────────────────────────────────
    levels_30 = [r["stress_level"] for r in rows]
    avg_30    = round(sum(levels_30) / len(levels_30), 1)
    print(f"[SERVICE] levels_30={levels_30} avg_30={avg_30}")

    # ── Lọc 7 ngày ───────────────────────────────────────────────────────
    since_7 = now - timedelta(days=7)
    rows_7  = []
    for r in rows:
        raw = r["logged_at"]
        # Chuẩn hóa: có thể là "+00:00" hoặc "Z"
        normalized = raw.replace("Z", "+00:00")
        try:
            dt = datetime.fromisoformat(normalized)
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            if dt >= since_7:
                rows_7.append(r)
        except Exception as e:
            print(f"[SERVICE] date parse error: {e} for raw={raw}")

    print(f"[SERVICE] rows_7_count={len(rows_7)}")

    levels_7 = [r["stress_level"] for r in rows_7]
    avg_7    = round(sum(levels_7) / len(levels_7), 1) if levels_7 else 0

    # ── Trend chart ───────────────────────────────────────────────────────
    day_buckets: dict = defaultdict(list)
    for r in rows_7:
        # "2025-05-19T04:51:00+00:00" → "2025-05-19"
        day = r["logged_at"][:10]
        day_buckets[day].append(r["stress_level"])

    trend = [
        StressTrend(
            date=day,
            avg_level=round(sum(vals) / len(vals), 1),
            count=len(vals),
        )
        for day, vals in sorted(day_buckets.items())
    ]
    print(f"[SERVICE] trend={trend}")

    result = StressStats(
        avg_7days=avg_7,
        avg_30days=avg_30,
        highest=max(levels_30),
        lowest=min(levels_30),
        total_logs=len(rows),
        trend=trend,
    )
    print(f"[SERVICE] STATS result={result}")
    print(f"[SERVICE] ====== STATS END ======\n")
    return result