from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from typing import Optional
import sqlite3
import os
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS", "PUT"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.options("/{rest_of_path:path}")
async def preflight_handler(request: Request, rest_of_path: str):
    return Response(
        status_code=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS, PUT",
            "Access-Control-Allow-Headers": "*",
        }
    )

DB_PATH = os.path.join(os.path.dirname(__file__), "irene.db")

# --- Level config ---
LEVELS = [
    {"tier": 0, "name": "Talking Stage",       "class": "Stranger",         "exp_required": 0,   "max_health": 100},
    {"tier": 1, "name": "Situationship",        "class": "Unlocked",         "exp_required": 100, "max_health": 100},
    {"tier": 2, "name": "When Am I Seeing You", "class": "Based Individual", "exp_required": 250, "max_health": 100},
    {"tier": 3, "name": "Please Literally Now", "class": "Certified Hiker",  "exp_required": 450, "max_health": 100},
    {"tier": 4, "name": "So When Am I Picking You Up", "class": "Trail Boss", "exp_required": 700, "max_health": 100},
]

QUIPS = {
    "big_gain":    ["you're too tuff wtf 🔥", "oo damn good take", "she cooked HARD", "W take no diff"],
    "mid_gain":    ["oh myyy", "based as per usual", "lowk she ate", "respecttt"],
    "small_gain":  ["lowk decent", "i'll allow it", "not bad not bad"],
    "small_loss":  ["tsk tsk bad take bad take", "smh smh", "the audacity"],
    "big_loss":    ["bro really said that 💀", "weren't based enough tsk tsk", "L take detected L take detected"],
    "level_up":    ["SHE LEVELED UP WTF 🚀", "LETS GOOO NEW TIER UNLOCKED", "bro she's going crazy rn"],
    "health_crit": ["yo the health bar is not looking good rn 😬", "she's on critical hp ngl", "health check: not great chief"],
    "game_over":   ["you weren't based enough tsk tsk", "i guess i gotta hike by myself 🥾", "game over fr fr"],
}

def get_quip(exp_delta: int, health_critical: bool, level_up: bool) -> tuple[str, str]:
    import random
    if level_up:
        return ("level_up", random.choice(QUIPS["level_up"]))
    if health_critical:
        return ("health_crit", random.choice(QUIPS["health_crit"]))
    if exp_delta >= 15:
        return ("big_gain", random.choice(QUIPS["big_gain"]))
    elif exp_delta >= 5:
        return ("mid_gain", random.choice(QUIPS["mid_gain"]))
    elif exp_delta >= 1:
        return ("small_gain", random.choice(QUIPS["small_gain"]))
    elif exp_delta >= -9:
        return ("small_loss", random.choice(QUIPS["small_loss"]))
    else:
        return ("big_loss", random.choice(QUIPS["big_loss"]))

def get_tier(exp: int) -> int:
    tier = 0
    for lvl in LEVELS:
        if exp >= lvl["exp_required"]:
            tier = lvl["tier"]
    return tier

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS takes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            exp_value INTEGER NOT NULL,
            reaction_tier TEXT,
            quip TEXT,
            timestamp TEXT NOT NULL
        )
    """)
    c.execute("""
        CREATE TABLE IF NOT EXISTS player (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            current_exp INTEGER DEFAULT 0,
            pending_level_up INTEGER DEFAULT 0,
            pending_level_up_tier INTEGER DEFAULT 0,
            pending_level_up_quip TEXT DEFAULT '',
            current_health INTEGER DEFAULT 100,
            current_tier INTEGER DEFAULT 0,
            last_quip TEXT DEFAULT '',
            last_quip_tier TEXT DEFAULT ''
        )
    """)
    # Ensure exactly one player row
    c.execute("INSERT OR IGNORE INTO player (id) VALUES (1)")
    conn.commit()
    conn.close()

init_db()

def db():
    conn = sqlite3.connect(DB_PATH, timeout=30, check_same_thread=False)
    conn.execute("PRAGMA journal_mode=WAL")
    conn.row_factory = sqlite3.Row
    return conn

# --- Models ---
class TakeIn(BaseModel):
    text: str
    exp_value: int  # positive = gain, negative = loss

class TakeUpdate(BaseModel):
    text: Optional[str] = None
    exp_value: Optional[int] = None

# --- Routes ---
@app.get("/player")
def get_player():
    conn = db()
    player = dict(conn.execute("SELECT * FROM player WHERE id=1").fetchone())
    conn.close()
    tier = get_tier(player["current_exp"])
    level_data = LEVELS[tier]
    next_level = LEVELS[tier + 1] if tier < len(LEVELS) - 1 else None
    exp_in_tier = player["current_exp"] - level_data["exp_required"]
    exp_to_next = (next_level["exp_required"] - level_data["exp_required"]) if next_level else 0
    return {
        **player,
        "tier": tier,
        "tier_name": level_data["name"],
        "class_name": level_data["class"],
        "max_health": level_data["max_health"],
        "exp_in_tier": exp_in_tier,
        "exp_to_next": exp_to_next,
        "is_max_tier": tier == len(LEVELS) - 1,
        "levels": LEVELS,
    }

@app.get("/takes")
def get_takes():
    conn = db()
    rows = conn.execute("SELECT * FROM takes ORDER BY timestamp DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/takes")
def log_take(take: TakeIn):
    conn = db()
    player = dict(conn.execute("SELECT * FROM player WHERE id=1").fetchone())

    old_tier = get_tier(player["current_exp"])
    new_exp = max(0, player["current_exp"] + take.exp_value)
    new_tier = get_tier(new_exp)
    leveled_up = new_tier > old_tier

    # Health logic
    if take.exp_value < 0:
        new_health = max(0, player["current_health"] + take.exp_value)
    else:
        new_health = player["current_health"]

    if leveled_up:
        new_health = LEVELS[new_tier]["max_health"]  # reset on level up

    game_over = new_health <= 0
    health_critical = new_health <= 25 and not game_over

    if game_over:
        reaction_tier = "game_over"
        quip_text = "you weren't based enough tsk tsk, i guess i gotta hike by myself 🥾"
    else:
        reaction_tier, quip_text = get_quip(take.exp_value, health_critical, leveled_up)

    ts = datetime.utcnow().isoformat()
    conn.execute(
        "INSERT INTO takes (text, exp_value, reaction_tier, quip, timestamp) VALUES (?,?,?,?,?)",
        (take.text, take.exp_value, reaction_tier, quip_text, ts)
    )
    # pending_level_up: stored for HER view to consume, not shown to admin
    conn.execute(
        """UPDATE player SET current_exp=?, current_health=?, current_tier=?,
           last_quip=?, last_quip_tier=?,
           pending_level_up=?, pending_level_up_tier=?, pending_level_up_quip=?
           WHERE id=1""",
        (new_exp, new_health, new_tier, quip_text, reaction_tier,
         1 if leveled_up else player.get("pending_level_up", 0),
         new_tier if leveled_up else player.get("pending_level_up_tier", 0),
         quip_text if leveled_up else player.get("pending_level_up_quip", ""))
    )
    conn.commit()
    take_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
    conn.close()

    return {
        "id": take_id,
        "leveled_up": False,  # don't show level up on admin side
        "game_over": game_over,
        "new_tier": new_tier,
        "new_exp": new_exp,
        "new_health": new_health,
        "quip": quip_text if not leveled_up else "logged — she'll see the level up",
        "reaction_tier": reaction_tier if not leveled_up else "mid_gain",
    }

@app.delete("/takes/{take_id}")
def delete_take(take_id: int):
    conn = db()
    take = conn.execute("SELECT * FROM takes WHERE id=?", (take_id,)).fetchone()
    if not take:
        raise HTTPException(status_code=404, detail="Take not found")
    take = dict(take)
    # Reverse the exp/health effect
    player = dict(conn.execute("SELECT * FROM player WHERE id=1").fetchone())
    new_exp = max(0, player["current_exp"] - take["exp_value"])
    # Recompute health by replaying is complex — just clamp
    if take["exp_value"] < 0:
        new_health = min(LEVELS[get_tier(new_exp)]["max_health"], player["current_health"] - take["exp_value"])
    else:
        new_health = player["current_health"]
    new_tier = get_tier(new_exp)
    conn.execute("DELETE FROM takes WHERE id=?", (take_id,))
    conn.execute("UPDATE player SET current_exp=?, current_health=?, current_tier=? WHERE id=1",
                 (new_exp, new_health, new_tier))
    conn.commit()
    conn.close()
    return {"ok": True}

@app.post("/player/dismiss_level_up")
def dismiss_level_up():
    conn = db()
    conn.execute("UPDATE player SET pending_level_up=0, pending_level_up_quip='' WHERE id=1")
    conn.commit()
    conn.close()
    return {"ok": True}

@app.post("/player/reset")
def reset_player():
    conn = db()
    conn.execute("UPDATE player SET current_exp=0, current_health=100, current_tier=0, last_quip='', last_quip_tier='', pending_level_up=0, pending_level_up_tier=0, pending_level_up_quip='' WHERE id=1")
    conn.execute("DELETE FROM takes")
    conn.commit()
    conn.close()
    return {"ok": True}