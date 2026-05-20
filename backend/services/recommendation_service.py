import httpx
import os
from datetime import datetime, timedelta, timezone
from collections import defaultdict
from backend.models.recommendation import RecommendationItem, RecommendationResponse

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

def _get(path: str, params: dict, user_token: str) -> list:
    url  = f"{SUPABASE_URL}/rest/v1/{path}"
    resp = httpx.get(url, headers=_headers(user_token), params=params, timeout=10.0)
    return resp.json() if resp.is_success else []


# ── Fetch dữ liệu 7 ngày ──────────────────────────────────────────────────────
def _fetch_recent_data(user_id: str, user_token: str) -> dict:
    now     = datetime.now(timezone.utc)
    since_7 = (now - timedelta(days=7)).isoformat()

    stress_rows = _get("stress_logs", {
        "user_id":   f"eq.{user_id}",
        "logged_at": f"gte.{since_7}",
        "select":    "stress_level,logged_at",
        "order":     "logged_at.desc",
    }, user_token)

    mood_rows = _get("mood_logs", {
        "user_id":   f"eq.{user_id}",
        "logged_at": f"gte.{since_7}",
        "select":    "mood_index,logged_at",
        "order":     "logged_at.desc",
    }, user_token)

    journal_rows = _get("journal_entries", {
        "user_id":   f"eq.{user_id}",
        "logged_at": f"gte.{since_7}",
        "select":    "logged_at,tags",
        "order":     "logged_at.desc",
    }, user_token)

    print(f"[REC] stress={len(stress_rows)} mood={len(mood_rows)} journal={len(journal_rows)}")
    return {
        "stress":  stress_rows,
        "mood":    mood_rows,
        "journal": journal_rows,
    }


# ── Tính các chỉ số ───────────────────────────────────────────────────────────
def _compute_metrics(data: dict) -> dict:
    stress_rows  = data["stress"]
    mood_rows    = data["mood"]
    journal_rows = data["journal"]

    # Stress avg
    stress_levels = [r["stress_level"] for r in stress_rows]
    stress_avg    = round(sum(stress_levels) / len(stress_levels), 1) if stress_levels else 0.0

    # Stress trend: so sánh 3 ngày đầu vs 3 ngày cuối
    if len(stress_levels) >= 4:
        half      = len(stress_levels) // 2
        old_avg   = sum(stress_levels[half:]) / (len(stress_levels) - half)
        new_avg   = sum(stress_levels[:half]) / half
        stress_trend = "rising" if new_avg > old_avg + 0.5 else "falling" if new_avg < old_avg - 0.5 else "stable"
    else:
        stress_trend = "stable"

    # Consecutive high stress days
    day_stress: dict = defaultdict(list)
    for r in stress_rows:
        day = r["logged_at"][:10]
        day_stress[day].append(r["stress_level"])
    consecutive_high = 0
    for day in sorted(day_stress.keys(), reverse=True):
        avg = sum(day_stress[day]) / len(day_stress[day])
        if avg >= 7:
            consecutive_high += 1
        else:
            break

    # Mood avg (0=Happy,1=Sad,2=Angry,3=Tired → đảo: 3=best,0=worst)
    mood_map = {0: 4, 1: 1, 2: 0, 3: 2}
    mood_scores   = [mood_map.get(r["mood_index"], 1) for r in mood_rows]
    mood_score    = round(sum(mood_scores) / len(mood_scores), 1) if mood_scores else 2.0

    # Journal streak
    journal_days = set(r["logged_at"][:10] for r in journal_rows)
    now          = datetime.now(timezone.utc)
    streak       = 0
    for i in range(7):
        day = (now - timedelta(days=i)).strftime("%Y-%m-%d")
        if day in journal_days:
            streak += 1
        else:
            break

    # Dominant journal tags
    all_tags: list = []
    for r in journal_rows:
        all_tags.extend(r.get("tags") or [])
    tag_counts: dict = defaultdict(int)
    for t in all_tags:
        tag_counts[t] += 1
    top_tags = sorted(tag_counts, key=lambda x: -tag_counts[x])[:3]

    metrics = {
        "stress_avg":        stress_avg,
        "stress_trend":      stress_trend,
        "consecutive_high":  consecutive_high,
        "mood_score":        mood_score,
        "journal_streak":    streak,
        "has_stress_data":   len(stress_rows) > 0,
        "has_mood_data":     len(mood_rows) > 0,
        "top_tags":          top_tags,
        "total_logs_7d":     len(stress_rows),
    }
    print(f"[REC] metrics={metrics}")
    return metrics


# ── Rule engine ───────────────────────────────────────────────────────────────
def _apply_rules(metrics: dict) -> tuple[list, str]:
    recs: list = []
    sa   = metrics["stress_avg"]
    ms   = metrics["mood_score"]
    ch   = metrics["consecutive_high"]
    st   = metrics["stress_trend"]
    js   = metrics["journal_streak"]
    tags = metrics["top_tags"]

    # ── RULE 1: Stress rất cao ──────────────────────────────────────────────
    if sa >= 7:
        recs.append(RecommendationItem(
            category="breathing",
            title="4-7-8 Breathing Exercise",
            description="Your stress is critically high. The 4-7-8 technique activates your parasympathetic nervous system within 5 minutes.",
            action_route="/(tabs)/wellness/breathing",
            priority=100,
            reason=f"Average stress {sa}/10 over the last 7 days"
        ))
        recs.append(RecommendationItem(
            category="meditation",
            title="10-Min Body Scan Meditation",
            description="Release physical tension stored from chronic stress. Focus on each body part from head to toe.",
            action_route="/(tabs)/wellness/meditation",
            priority=90,
            reason="High stress causes physical tension that meditation can address"
        ))

    # ── RULE 2: Stress trung bình ───────────────────────────────────────────
    elif sa >= 5:
        recs.append(RecommendationItem(
            category="breathing",
            title="Box Breathing (4-4-4-4)",
            description="A Navy SEAL technique: inhale 4s, hold 4s, exhale 4s, hold 4s. Do 4 rounds.",
            action_route="/(tabs)/wellness/breathing",
            priority=70,
            reason=f"Moderate stress detected (avg {sa}/10)"
        ))

    # ── RULE 3: Stress đang tăng ────────────────────────────────────────────
    if st == "rising":
        recs.append(RecommendationItem(
            category="lifestyle",
            title="Stress is Rising — Take Action Now",
            description="Your stress has been increasing over the past week. Schedule 15 minutes of outdoor walking today.",
            action_route=None,
            priority=85,
            reason="Stress trend is upward over the last 7 days"
        ))

    # ── RULE 4: Nhiều ngày liên tiếp stress cao ─────────────────────────────
    if ch >= 3:
        recs.append(RecommendationItem(
            category="meditation",
            title=f"{ch}-Day Stress Streak — Deep Reset Needed",
            description="You've had high stress for multiple consecutive days. Try a guided progressive muscle relaxation session tonight.",
            action_route="/(tabs)/wellness/meditation",
            priority=95,
            reason=f"{ch} consecutive days with stress ≥ 7"
        ))

    # ── RULE 5: Mood thấp ────────────────────────────────────────────────────
    if ms <= 1:
        recs.append(RecommendationItem(
            category="journal",
            title="Express Your Feelings",
            description="Writing about difficult emotions reduces their intensity by up to 30%. Open your journal and write freely for 5 minutes.",
            action_route="/(tabs)/wellness/journal",
            priority=80,
            reason="Low mood detected in recent check-ins"
        ))
        recs.append(RecommendationItem(
            category="lifestyle",
            title="Gratitude Practice",
            description="Write 3 specific things you're grateful for today. Research shows this shifts mood within 2 weeks.",
            action_route="/(tabs)/wellness/journal",
            priority=75,
            reason="Gratitude journaling is evidence-based for low mood"
        ))

    # ── RULE 6: Không journal đủ ────────────────────────────────────────────
    if js == 0:
        recs.append(RecommendationItem(
            category="journal",
            title="Start Your Journal Today",
            description="You haven't journaled this week. Even 3 sentences can reduce anxiety and improve clarity.",
            action_route="/(tabs)/wellness/journal",
            priority=60,
            reason="No journal entries in the last 7 days"
        ))
    elif js >= 3:
        recs.append(RecommendationItem(
            category="journal",
            title=f"🔥 {js}-Day Journal Streak!",
            description="Keep the momentum — your consistent reflection is building self-awareness and emotional resilience.",
            action_route="/(tabs)/wellness/journal",
            priority=40,
            reason=f"Celebrating {js} days of journaling"
        ))

    # ── RULE 7: Tag-based recommendations ───────────────────────────────────
    if "Work" in tags:
        recs.append(RecommendationItem(
            category="lifestyle",
            title="Work Boundary Technique",
            description="Set a hard stop time today. When work stress is high, the Pomodoro method (25 min work + 5 min break) can increase focus by 40%.",
            action_route=None,
            priority=65,
            reason="Work appears frequently in your stress triggers"
        ))
    if "Sleep" in tags:
        recs.append(RecommendationItem(
            category="breathing",
            title="4-7-8 Sleep Breathing",
            description="Do 4 rounds of 4-7-8 breathing in bed. It reduces the time to fall asleep by activating your rest response.",
            action_route="/(tabs)/wellness/breathing",
            priority=72,
            reason="Sleep issues detected in your journal tags"
        ))
    if "Relationship" in tags:
        recs.append(RecommendationItem(
            category="meditation",
            title="Loving-Kindness Meditation",
            description="A 10-minute practice of sending compassion to yourself and others. Particularly effective for relationship stress.",
            action_route="/(tabs)/wellness/meditation",
            priority=68,
            reason="Relationship stress mentioned in your entries"
        ))

    # ── RULE 8: Stress thấp — reward ────────────────────────────────────────
    if sa <= 4 and metrics["has_stress_data"]:
        recs.append(RecommendationItem(
            category="lifestyle",
            title="You're Doing Great! 🌟",
            description="Your stress is well-managed this week. Maintain this by keeping your current habits and adding a weekly nature walk.",
            action_route=None,
            priority=30,
            reason=f"Low stress average ({sa}/10) this week"
        ))

    # ── RULE 9: Không có dữ liệu ─────────────────────────────────────────────
    if not metrics["has_stress_data"] and not metrics["has_mood_data"]:
        recs.append(RecommendationItem(
            category="lifestyle",
            title="Start Tracking Your Wellness",
            description="Log your stress and mood daily to unlock personalized recommendations. Just 30 seconds a day makes a difference.",
            action_route="/(tabs)/wellness/stress",
            priority=50,
            reason="No tracking data available yet"
        ))

    # Sort by priority
    recs.sort(key=lambda r: -r.priority)

    # Summary
    if not metrics["has_stress_data"]:
        summary = "Start logging to get personalized recommendations."
    elif sa >= 7:
        summary = f"⚠️ High stress week (avg {sa}/10). Immediate action recommended."
    elif sa >= 5:
        summary = f"Moderate stress this week (avg {sa}/10). Small changes can help."
    else:
        summary = f"Good week overall (stress avg {sa}/10). Keep it up!"

    return recs[:6], summary   # max 6 recommendations


# ── Main entry point ──────────────────────────────────────────────────────────
def get_recommendations(user_id: str, user_token: str) -> RecommendationResponse:
    data    = _fetch_recent_data(user_id, user_token)
    metrics = _compute_metrics(data)
    recs, summary = _apply_rules(metrics)

    return RecommendationResponse(
        recommendations=recs,
        summary=summary,
        stress_avg=metrics["stress_avg"],
        mood_score=metrics["mood_score"],
        journal_streak=metrics["journal_streak"],
    )

