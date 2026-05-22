import httpx
import os
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, Tuple, List
import re

from backend.models.sleep import (
    SleepUpsertCreate,
    SleepArchitecture,
    SleepTodayResponse,
    SleepHistoryDay,
    SleepHistoryResponse,
)

SUPABASE_URL = (
    os.environ.get("SUPABASE_URL")
    or os.environ.get("EXPO_PUBLIC_SUPABASE_URL", "")
)


_HTTP = httpx.Client(timeout=10.0)


def _headers(user_token: str) -> dict:
    anon_key = (
        os.environ.get("SUPABASE_KEY")
        or os.environ.get("EXPO_PUBLIC_SUPABASE_KEY", "")
    )
    return {
        "apikey": anon_key,
        "Authorization": f"Bearer {user_token}",
        "Content-Type": "application/json",
    }


_TIME_RE = re.compile(r"^(\d{1,2}):(\d{2})(?::(\d{2}))?$")


def _parse_hhmm(value: str) -> Tuple[int, int]:
    """Accepts 'H:MM', 'HH:MM' and Supabase 'HH:MM:SS' time strings."""
    raw = (value or "").strip()
    m = _TIME_RE.match(raw)
    if not m:
        raise ValueError("Invalid time format, expected HH:MM")

    hh = int(m.group(1))
    mm = int(m.group(2))
    # seconds (m.group(3)) ignored for MVP

    if hh < 0 or hh > 23 or mm < 0 or mm > 59:
        raise ValueError("Invalid time value")
    return hh, mm


def _duration_min(start_time: str, end_time: str) -> int:
    sh, sm = _parse_hhmm(start_time)
    eh, em = _parse_hhmm(end_time)
    start = sh * 60 + sm
    end = eh * 60 + em
    if end < start:
        end += 24 * 60
    return end - start


def _default_breakdown(total_min: int, awake_min: int) -> SleepArchitecture:
    awake = max(0, min(int(awake_min), total_min))
    sleep = max(0, total_min - awake)

    # Simple, stable MVP ratios (tunable later)
    deep = int(round(sleep * 0.20))
    rem = int(round(sleep * 0.25))
    light = max(0, sleep - deep - rem)

    return SleepArchitecture(
        awake_min=awake,
        rem_min=rem,
        light_min=light,
        deep_min=deep,
    )


def _score(total_min: int, arch: SleepArchitecture, quality_user: Optional[int]) -> Tuple[int, str]:
    # Target 8h for scoring purposes
    target = 8 * 60
    duration_score = min(total_min / target, 1.0) * 55.0

    awake_pct = (arch.awake_min / total_min) if total_min > 0 else 1.0
    awake_score = max(0.0, 20.0 * (1.0 - min(awake_pct / 0.15, 1.0)))  # best if awake <= 15%

    deep_pct = ((arch.deep_min) / max(1, total_min - arch.awake_min))
    rem_pct = ((arch.rem_min) / max(1, total_min - arch.awake_min))
    stage_score = 15.0
    if deep_pct < 0.12:
        stage_score -= 6.0
    if rem_pct < 0.18:
        stage_score -= 4.0
    stage_score = max(0.0, stage_score)

    quality_score = 0.0
    if quality_user is not None:
        # 1..5 mapped to 0..10
        quality_score = (max(1, min(5, int(quality_user))) - 1) * 2.5

    raw = duration_score + awake_score + stage_score + quality_score
    score = int(max(0, min(100, round(raw))))

    if score >= 85:
        status = "Excellent Rest"
    elif score >= 70:
        status = "Good Recovery"
    elif score >= 55:
        status = "Fair Sleep"
    else:
        status = "Needs Attention"

    return score, status


def _local_today_str() -> str:
    return datetime.now().date().isoformat()


def upsert_sleep_today(user_id: str, payload: SleepUpsertCreate, user_token: str) -> Dict[str, Any]:
    url = f"{SUPABASE_URL}/rest/v1/sleep_sessions"

    # Validate and compute
    total_min = _duration_min(payload.start_time, payload.end_time)
    if total_min <= 0:
        raise ValueError("Sleep duration must be > 0")
    if total_min > 16 * 60:
        raise ValueError("Sleep duration too long")

    awake = int(payload.awake_minutes or 0)
    if awake > total_min:
        awake = total_min

    body = {
        "user_id": user_id,
        "log_date": payload.log_date,
        "start_time": payload.start_time,
        "end_time": payload.end_time,
        "awake_minutes": awake,
        "quality_user": payload.quality_user,
        "notes": payload.notes,
    }

    headers = _headers(user_token)
    headers["Prefer"] = "return=representation,resolution=merge-duplicates"

    resp = _HTTP.post(
        url,
        headers=headers,
        params={"on_conflict": "user_id,log_date"},
        json=body,
    )

    if not resp.is_success:
        raise RuntimeError(f"Upsert sleep failed: {resp.text}")

    rows = resp.json() or []
    session = rows[0] if rows else body

    # Upsert breakdown (optional table)
    arch = _default_breakdown(total_min, awake)
    _upsert_breakdown(session.get("id"), arch, user_token)

    return session


def _upsert_breakdown(session_id: Optional[str], arch: SleepArchitecture, user_token: str) -> None:
    if not session_id:
        return
    url = f"{SUPABASE_URL}/rest/v1/sleep_stage_breakdown"
    headers = _headers(user_token)
    headers["Prefer"] = "return=minimal,resolution=merge-duplicates"
    body = {
        "session_id": session_id,
        "awake_min": arch.awake_min,
        "rem_min": arch.rem_min,
        "light_min": arch.light_min,
        "deep_min": arch.deep_min,
    }
    resp = _HTTP.post(
        url,
        headers=headers,
        params={"on_conflict": "session_id"},
        json=body,
    )
    if not resp.is_success:
        # Not fatal for MVP
        print(f"[SLEEP SERVICE] Breakdown upsert failed: {resp.text}")


def get_sleep_today(user_id: str, user_token: str, log_date: Optional[str] = None) -> SleepTodayResponse:
    date_str = log_date or _local_today_str()

    # Single Supabase call: fetch last 7 days with embedded breakdown
    end_dt = datetime.fromisoformat(date_str)
    start_dt = end_dt - timedelta(days=6)
    sessions = _fetch_sessions_with_breakdown(
        user_id,
        user_token,
        start_date=start_dt.date().isoformat(),
        end_date=end_dt.date().isoformat(),
    )

    today = next((s for s in sessions if s.get("log_date") == date_str), None)
    if not today:
        arch0 = SleepArchitecture(awake_min=0, rem_min=0, light_min=0, deep_min=0)
        return SleepTodayResponse(
            log_date=date_str,
            score=0,
            status_text="No log yet",
            total_duration_min=0,
            wake_time="--:--",
            architecture=arch0,
            insight_title="Log your sleep",
            insight_description="Add today's sleep to see your score and insights.",
        )

    total_min = _duration_min(today["start_time"], today["end_time"])
    arch = _extract_architecture(today, total_min)

    score, status = _score(total_min, arch, today.get("quality_user"))

    # Insight: compare today's deep sleep vs last 7 logs (from the same fetched set)
    history_arch = [
        _extract_architecture(s, _duration_min(s["start_time"], s["end_time"]))
        for s in sessions
    ]
    avg_deep = 0
    if history_arch:
        avg_deep = int(round(sum(a.deep_min for a in history_arch) / len(history_arch)))

    if avg_deep > 0 and arch.deep_min >= int(avg_deep * 1.10):
        insight_title = "Consistency is key"
        insight_desc = "Your deep sleep is higher than your weekly average. Keep your bedtime routine consistent."
    elif avg_deep > 0 and arch.deep_min < int(avg_deep * 0.90):
        insight_title = "Prioritize deep sleep"
        insight_desc = "Your deep sleep is lower than your weekly average. Try reducing late caffeine and screens."
    else:
        insight_title = "Nice work"
        insight_desc = "Log more nights to unlock personalized trends and insights."

    return SleepTodayResponse(
        log_date=date_str,
        score=score,
        status_text=status,
        total_duration_min=total_min,
        wake_time=_format_hhmm(today["end_time"]),
        architecture=arch,
        insight_title=insight_title,
        insight_description=insight_desc,
    )


def get_sleep_history(
    user_id: str,
    user_token: str,
    days: int = 7,
    end_date: Optional[str] = None,
) -> SleepHistoryResponse:
    if days < 1:
        days = 1
    if days > 31:
        days = 31

    end_str = end_date or _local_today_str()
    end_dt = datetime.fromisoformat(end_str)
    start_dt = end_dt - timedelta(days=days - 1)

    sessions = _fetch_sessions_with_breakdown(
        user_id,
        user_token,
        start_date=start_dt.date().isoformat(),
        end_date=end_dt.date().isoformat(),
    )

    out: List[SleepHistoryDay] = []
    for s in sessions:
        total_min = _duration_min(s["start_time"], s["end_time"])
        arch = _extract_architecture(s, total_min)
        score, _ = _score(total_min, arch, s.get("quality_user"))
        out.append(
            SleepHistoryDay(
                log_date=s["log_date"],
                score=score,
                total_duration_min=total_min,
                architecture=arch,
            )
        )

    return SleepHistoryResponse(days=out)


def _format_hhmm(value: str) -> str:
    raw = (value or "").strip()
    m = _TIME_RE.match(raw)
    if not m:
        return raw
    hh = int(m.group(1))
    mm = int(m.group(2))
    return f"{hh:02d}:{mm:02d}"


def _fetch_sessions_with_breakdown(
    user_id: str,
    user_token: str,
    start_date: str,
    end_date: str,
) -> List[Dict[str, Any]]:
    """Fetch sessions in [start_date, end_date] with embedded breakdown in one request."""
    url = f"{SUPABASE_URL}/rest/v1/sleep_sessions"
    params = [
        ("user_id", f"eq.{user_id}"),
        ("log_date", f"gte.{start_date}"),
        ("log_date", f"lte.{end_date}"),
        ("order", "log_date.asc"),
        (
            "select",
            "id,log_date,start_time,end_time,awake_minutes,quality_user,sleep_stage_breakdown(awake_min,rem_min,light_min,deep_min)",
        ),
    ]

    resp = _HTTP.get(url, headers=_headers(user_token), params=params)
    if not resp.is_success:
        # If embedding isn't available/misnamed, fall back to plain sessions.
        fallback_params = [
            ("user_id", f"eq.{user_id}"),
            ("log_date", f"gte.{start_date}"),
            ("log_date", f"lte.{end_date}"),
            ("order", "log_date.asc"),
            ("select", "id,log_date,start_time,end_time,awake_minutes,quality_user"),
        ]
        resp2 = _HTTP.get(url, headers=_headers(user_token), params=fallback_params)
        if not resp2.is_success:
            raise RuntimeError(f"Fetch sleep sessions failed: {resp.text}")
        return resp2.json() or []
    return resp.json() or []


def _extract_architecture(session_row: Dict[str, Any], total_min: int) -> SleepArchitecture:
    embedded = session_row.get("sleep_stage_breakdown")
    if isinstance(embedded, list) and embedded:
        r = embedded[0] or {}
        return SleepArchitecture(
            awake_min=int(r.get("awake_min") or 0),
            rem_min=int(r.get("rem_min") or 0),
            light_min=int(r.get("light_min") or 0),
            deep_min=int(r.get("deep_min") or 0),
        )
    return _default_breakdown(total_min, int(session_row.get("awake_minutes") or 0))
