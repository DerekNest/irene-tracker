import { useState, useEffect, useCallback, useRef } from "react";

const API = "https://irene-tracker-production.up.railway.app";

// ─── PALETTE: amber/gold + teal + cream on near-black ─────────────────────────
const C = {
  bg: "#0a0800",
  bgPanel: "#0f0e08",
  bgInset: "#060504",
  gold: "#d4a017",
  goldDim: "#7a5c0a",
  teal: "#2a9d8f",
  tealDim: "#14524c",
  cream: "#e8dcc8",
  creamDim: "#7a6e5a",
  red: "#c0392b",
  redDim: "#6b1f17",
  green: "#4a7c59",
  border: "#3a3018",
  shadow: "#000000",
};

// ─── RPG DIALOG BOX BORDER (chunky 2000s style) ───────────────────────────────
function RPGBox({ children, color = C.gold, style = {}, glow = false }) {
  const b = color;
  return (
    <div style={{
      position: "relative",
      background: C.bgPanel,
      border: `3px solid ${b}`,
      outline: `1px solid ${C.bgInset}`,
      outlineOffset: "3px",
      boxShadow: glow
        ? `0 0 0 1px ${C.bg}, 0 0 20px ${b}44, inset 0 0 30px rgba(0,0,0,0.5)`
        : `0 0 0 1px ${C.bg}, inset 0 0 20px rgba(0,0,0,0.4)`,
      ...style,
    }}>
      {/* corner pixels */}
      <div style={{ position: "absolute", top: -3, left: -3, width: 6, height: 6, background: C.bg }} />
      <div style={{ position: "absolute", top: -3, right: -3, width: 6, height: 6, background: C.bg }} />
      <div style={{ position: "absolute", bottom: -3, left: -3, width: 6, height: 6, background: C.bg }} />
      <div style={{ position: "absolute", bottom: -3, right: -3, width: 6, height: 6, background: C.bg }} />
      {children}
    </div>
  );
}

// ─── SPRITES ──────────────────────────────────────────────────────────────────
function IreneSprite({ tier = 0, size = 1 }) {
  const w = Math.round(64 * size), h = Math.round(96 * size);
  const auraColors = ["none", C.teal, C.gold, C.red, "#f39c12"];
  const outfits = ["#c8b89a", "#c0392b", "#2a9d8f", "#8e44ad", "#d4a017"];
  const aura = auraColors[tier];
  const outfit = outfits[tier];
  return (
    <svg width={w} height={h} viewBox="0 0 16 24" style={{ imageRendering: "pixelated", display: "block" }}>
      {tier > 0 && <ellipse cx="8" cy="23" rx="6" ry="1.5" fill={aura} opacity="0.35" />}
      {/* hair */}
      <rect x="4" y="0" width="8" height="2" fill="#1a0f0a" />
      <rect x="3" y="1" width="10" height="5" fill="#1a0f0a" />
      <rect x="2" y="2" width="1" height="8" fill="#1a0f0a" />
      <rect x="13" y="2" width="1" height="8" fill="#1a0f0a" />
      <rect x="3" y="6" width="2" height="6" fill="#1a0f0a" />
      <rect x="11" y="6" width="2" height="6" fill="#1a0f0a" />
      {/* face */}
      <rect x="4" y="3" width="8" height="6" fill="#f0c8a8" />
      {/* eyes */}
      <rect x="5" y="5" width="2" height="1" fill="#1a0f0a" />
      <rect x="9" y="5" width="2" height="1" fill="#1a0f0a" />
      <rect x="5" y="5" width="1" height="1" fill="#3a2a22" />
      <rect x="9" y="5" width="1" height="1" fill="#3a2a22" />
      {/* mouth */}
      <rect x="6" y="7" width="4" height="1" fill="#c47a6a" />
      {/* neck */}
      <rect x="7" y="9" width="2" height="1" fill="#f0c8a8" />
      {/* outfit */}
      <rect x="4" y="10" width="8" height="7" fill={outfit} />
      <rect x="2" y="10" width="2" height="6" fill={outfit} />
      <rect x="12" y="10" width="2" height="6" fill={outfit} />
      {/* outfit shade */}
      <rect x="7" y="10" width="2" height="7" fill="#00000022" />
      {/* hands */}
      <rect x="2" y="16" width="2" height="2" fill="#f0c8a8" />
      <rect x="12" y="16" width="2" height="2" fill="#f0c8a8" />
      {/* legs */}
      <rect x="4" y="17" width="3" height="5" fill="#2c2c3a" />
      <rect x="9" y="17" width="3" height="5" fill="#2c2c3a" />
      {/* shoes */}
      <rect x="3" y="21" width="4" height="2" fill="#111" />
      <rect x="9" y="21" width="4" height="2" fill="#111" />
      {/* sparkles per tier */}
      {tier >= 2 && <><rect x="1" y="4" width="1" height="1" fill={C.gold} opacity="0.9" /><rect x="14" y="7" width="1" height="1" fill={C.gold} opacity="0.7" /></>}
      {tier >= 3 && <><rect x="0" y="10" width="1" height="1" fill={C.red} opacity="0.9" /><rect x="15" y="3" width="1" height="1" fill={C.red} opacity="0.8" /></>}
      {tier >= 4 && <><rect x="7" y="0" width="2" height="1" fill={C.gold} /><rect x="0" y="1" width="1" height="1" fill={C.gold} opacity="0.6" /><rect x="15" y="12" width="1" height="1" fill={C.gold} opacity="0.8" /></>}
    </svg>
  );
}

function DerekSprite({ mood = "neutral", size = 1, bob = false }) {
  const w = Math.round(56 * size), h = Math.round(80 * size);
  // mood colors: neutral=navy, hype=teal, sad=dim
  const shirtColors = { neutral: "#1a2a4a", hype: "#1a4a3a", sad: "#2a2a2a", crit: "#4a1a1a" };
  const shirt = shirtColors[mood] || shirtColors.neutral;
  return (
    <svg width={w} height={h} viewBox="0 0 14 20"
      style={{
        imageRendering: "pixelated", display: "block",
        animation: bob ? "bobAnim 0.8s ease-in-out infinite alternate" : "none"
      }}>
      {/* hair */}
      <rect x="3" y="0" width="8" height="2" fill="#5c3010" />
      <rect x="2" y="1" width="10" height="4" fill="#7a4520" />
      <rect x="1" y="2" width="2" height="3" fill="#7a4520" />
      <rect x="11" y="2" width="2" height="3" fill="#5c3010" />
      {/* face */}
      <rect x="3" y="3" width="8" height="6" fill="#e8b890" />
      {/* eyes */}
      <rect x="4" y="5" width="2" height="1" fill="#2c1a10" />
      <rect x="8" y="5" width="2" height="1" fill="#2c1a10" />
      {/* expression by mood */}
      {mood === "hype" && <rect x="4" y="7" width="6" height="1" fill="#c06040" />}
      {mood === "sad" && <><rect x="4" y="8" width="6" height="1" fill="#c06040" /><rect x="4" y="7" width="1" height="1" fill="#c06040" /><rect x="9" y="7" width="1" height="1" fill="#c06040" /></>}
      {mood === "neutral" && <rect x="5" y="7" width="4" height="1" fill="#c06040" />}
      {mood === "crit" && <rect x="5" y="7" width="4" height="1" fill="#c06040" />}
      {/* neck */}
      <rect x="6" y="9" width="2" height="1" fill="#e8b890" />
      {/* shirt */}
      <rect x="3" y="10" width="8" height="6" fill={shirt} />
      <rect x="1" y="10" width="2" height="5" fill={shirt} />
      <rect x="11" y="10" width="2" height="5" fill={shirt} />
      {/* hands */}
      <rect x="1" y="15" width="2" height="2" fill="#e8b890" />
      <rect x="11" y="15" width="2" height="2" fill="#e8b890" />
      {/* pants */}
      <rect x="3" y="16" width="3" height="4" fill="#2c3040" />
      <rect x="8" y="16" width="3" height="4" fill="#2c3040" />
      {/* shoes */}
      <rect x="2" y="19" width="4" height="1" fill="#111" />
      <rect x="8" y="19" width="4" height="1" fill="#111" />
    </svg>
  );
}

// ─── PIXEL FONT HELPER ────────────────────────────────────────────────────────
const PX = ({ size = 7, color = C.cream, children, style = {} }) => (
  <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: size, color, lineHeight: 1.8, ...style }}>
    {children}
  </span>
);

// ─── CRT SCANLINE OVERLAY ─────────────────────────────────────────────────────
function CRT() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 900,
      background: "repeating-linear-gradient(0deg,rgba(0,0,0,0.12) 0px,rgba(0,0,0,0.12) 1px,transparent 1px,transparent 3px)",
    }} />
  );
}

// ─── RPG PROGRESS BAR ─────────────────────────────────────────────────────────
function RPGBar({ value, max, color, label, isMax }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 100;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <PX size={5} color={C.creamDim}>{label}</PX>
        <PX size={5} color={color}>{isMax ? "MAX" : `${value} / ${max}`}</PX>
      </div>
      <div style={{ position: "relative", height: 12, background: C.bgInset, border: `2px solid ${C.border}` }}>
        <div style={{
          width: `${pct}%`, height: "100%", background: color,
          boxShadow: `0 0 6px ${color}88`,
          transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)",
        }} />
        {/* pixel notches */}
        {[25, 50, 75].map(p => (
          <div key={p} style={{ position: "absolute", top: 0, left: `${p}%`, width: 2, height: "100%", background: "rgba(0,0,0,0.4)" }} />
        ))}
      </div>
    </div>
  );
}

// ─── MOOD FROM TIER ───────────────────────────────────────────────────────────
function moodFromTier(tier) {
  const map = {
    big_gain: "hype", mid_gain: "hype", small_gain: "neutral",
    small_loss: "sad", big_loss: "sad", level_up: "hype",
    health_crit: "crit", game_over: "sad"
  };
  return map[tier] || "neutral";
}

// ─── QUIP CAROUSEL (her view centerpiece) ─────────────────────────────────────
function QuipCarousel({ takes }) {
  const recent = takes.slice(0, 10); // already sorted desc
  const [idx, setIdx] = useState(0);
  const current = recent[idx];
  if (!current) return null;

  const mood = moodFromTier(current.reaction_tier);
  const tierColors = {
    big_gain: C.gold, mid_gain: C.teal, small_gain: C.green,
    small_loss: "#e67e22", big_loss: C.red, level_up: C.gold,
    health_crit: C.red, game_over: C.red,
  };
  const dialogColor = tierColors[current.reaction_tier] || C.teal;
  const isPos = current.exp_value > 0;

  return (
    <RPGBox color={dialogColor} glow style={{ padding: 0, marginBottom: 24 }}>
      {/* header bar */}
      <div style={{ background: dialogColor, padding: "6px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <PX size={6} color={C.bg}>DEREK SAYS</PX>
        <PX size={5} color={C.bg}>{idx + 1} / {recent.length}</PX>
      </div>

      <div style={{ padding: 20, display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* sprite */}
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <DerekSprite mood={mood} bob={mood === "hype"} size={1.2} />
          <div style={{
            background: C.bgInset, border: `1px solid ${dialogColor}`,
            padding: "3px 6px",
          }}>
            <PX size={4} color={isPos ? C.green : C.red}>
              {isPos ? "+" : ""}{current.exp_value} EXP
            </PX>
          </div>
        </div>

        {/* dialog */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* take text */}
          <div style={{
            background: C.bgInset, border: `1px solid ${C.border}`,
            padding: "8px 10px", marginBottom: 12,
          }}>
            <PX size={5} color={C.creamDim} style={{ display: "block" }}>HER TAKE:</PX>
            <PX size={6} color={C.cream} style={{ display: "block", marginTop: 4 }}>{current.text}</PX>
          </div>
          {/* quip speech bubble */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", left: -8, top: 10,
              width: 0, height: 0,
              borderTop: "6px solid transparent",
              borderBottom: "6px solid transparent",
              borderRight: `8px solid ${dialogColor}`,
            }} />
            <div style={{
              background: C.bgPanel, border: `2px solid ${dialogColor}`,
              padding: "10px 14px",
              boxShadow: `0 0 12px ${dialogColor}44`,
            }}>
              <PX size={7} color={dialogColor}>"{current.quip}"</PX>
            </div>
          </div>
        </div>
      </div>

      {/* nav */}
      <div style={{
        borderTop: `2px solid ${C.border}`, padding: "10px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <button onClick={() => setIdx(i => Math.min(recent.length - 1, i + 1))}
          disabled={idx === recent.length - 1}
          style={{
            background: "none", border: `2px solid ${idx === recent.length - 1 ? C.border : dialogColor}`,
            color: idx === recent.length - 1 ? C.border : dialogColor,
            padding: "4px 10px", cursor: idx === recent.length - 1 ? "default" : "pointer",
            fontFamily: "'Press Start 2P',monospace", fontSize: 8
          }}>◄</button>
        <PX size={5} color={C.creamDim}>
          {new Date(current.timestamp + "Z").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </PX>
        <button onClick={() => setIdx(i => Math.max(0, i - 1))}
          disabled={idx === 0}
          style={{
            background: "none", border: `2px solid ${idx === 0 ? C.border : dialogColor}`,
            color: idx === 0 ? C.border : dialogColor,
            padding: "4px 10px", cursor: idx === 0 ? "default" : "pointer",
            fontFamily: "'Press Start 2P',monospace", fontSize: 8
          }}>►</button>
      </div>
    </RPGBox>
  );
}

// ─── TAKE ENTRY ───────────────────────────────────────────────────────────────
function TakeEntry({ take, isAdmin, onDelete }) {
  const isPos = take.exp_value > 0;
  const tierColors = {
    big_gain: C.gold, mid_gain: C.teal, small_gain: C.green,
    small_loss: "#e67e22", big_loss: C.red, level_up: C.gold,
    health_crit: C.red, game_over: C.red,
  };
  const color = tierColors[take.reaction_tier] || C.creamDim;
  const date = new Date(take.timestamp + "Z").toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  return (
    <div style={{ borderLeft: `3px solid ${color}`, background: C.bgInset, padding: "10px 14px", marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <PX size={5} color={C.cream} style={{ flex: 1, display: "block" }}>{take.text}</PX>
        <PX size={6} color={isPos ? C.green : C.red} style={{ flexShrink: 0 }}>
          {isPos ? "+" : ""}{take.exp_value}
        </PX>
      </div>
      {take.quip && <PX size={5} color={color} style={{ display: "block", marginTop: 6, fontStyle: "italic" }}>"{take.quip}"</PX>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
        <PX size={4} color={C.border}>{date}</PX>
        {isAdmin && (
          <button onClick={() => onDelete(take.id)} style={{
            background: "none", border: `1px solid ${C.red}`, color: C.red,
            padding: "2px 6px", cursor: "pointer",
            fontFamily: "'Press Start 2P',monospace", fontSize: 4,
          }}>DEL</button>
        )}
      </div>
    </div>
  );
}

// ─── LEVEL UP POPUP ───────────────────────────────────────────────────────────
function LevelUpPopup({ quip, newTierName, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, cursor: "pointer"
    }}
      onClick={onClose}>
      <div style={{ textAlign: "center", animation: "levelPop 0.4s ease" }}>
        <PX size={14} color={C.gold} style={{ display: "block", marginBottom: 24, letterSpacing: 4 }}>
          ★ LEVEL UP ★
        </PX>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
          <DerekSprite mood="hype" bob size={1.5} />
        </div>
        <RPGBox color={C.gold} glow style={{ padding: "16px 24px", maxWidth: 340, margin: "0 auto 20px" }}>
          <PX size={7} color={C.gold}>"{quip}"</PX>
        </RPGBox>
        <PX size={6} color={C.teal} style={{ display: "block", marginBottom: 16 }}>
          NEW TIER: {newTierName?.toUpperCase()}
        </PX>
        <PX size={5} color={C.creamDim}>[ tap to continue ]</PX>
      </div>
    </div>
  );
}

// ─── QUIP POPUP (admin) ───────────────────────────────────────────────────────
function QuipPopup({ quip, tier, onClose }) {
  const tierColors = {
    big_gain: C.gold, mid_gain: C.teal, small_gain: C.green,
    small_loss: "#e67e22", big_loss: C.red, level_up: C.gold,
    health_crit: C.red, game_over: C.red,
  };
  const color = tierColors[tier] || C.teal;
  const mood = moodFromTier(tier);
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, cursor: "pointer"
    }}
      onClick={onClose}>
      <RPGBox color={color} glow style={{ padding: 0, maxWidth: 400, width: "90%", animation: "popIn 0.3s ease" }}>
        <div style={{ background: color, padding: "6px 12px" }}>
          <PX size={6} color={C.bg}>TAKE LOGGED</PX>
        </div>
        <div style={{ padding: 20, display: "flex", gap: 16, alignItems: "center" }}>
          <DerekSprite mood={mood} size={1.1} />
          <div>
            <PX size={7} color={color} style={{ display: "block", marginBottom: 8 }}>"{quip}"</PX>
          </div>
        </div>
        <div style={{ borderTop: `2px solid ${C.border}`, padding: "8px 16px", textAlign: "center" }}>
          <PX size={5} color={C.creamDim}>[ tap to continue ]</PX>
        </div>
      </RPGBox>
    </div>
  );
}

// ─── GAME OVER ────────────────────────────────────────────────────────────────
function GameOverScreen() {
  return (
    <div style={{
      position: "fixed", inset: 0, background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 999
    }}>
      <PX size={20} color={C.red} style={{ display: "block", marginBottom: 32, letterSpacing: 4 }}>GAME OVER</PX>
      <div style={{ marginBottom: 32 }}><IreneSprite tier={0} /></div>
      <RPGBox color={C.red} style={{ padding: "20px 32px", textAlign: "center", maxWidth: 360 }}>
        <PX size={7} color={C.cream} style={{ display: "block", lineHeight: 2.5 }}>
          you weren't based enough<br />tsk tsk<br /><br />
        </PX>
        <PX size={7} color={C.creamDim} style={{ display: "block", lineHeight: 2 }}>
          i guess i gotta hike<br />by myself 🥾
        </PX>
      </RPGBox>
    </div>
  );
}

// ─── CREDITS ──────────────────────────────────────────────────────────────────
function CreditsScreen() {
  return (
    <div style={{
      position: "fixed", inset: 0, background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 999, overflow: "hidden"
    }}>
      <div style={{ animation: "creditsScroll 14s linear forwards", textAlign: "center", padding: "0 40px" }}>
        <PX size={14} color={C.gold} style={{ display: "block", marginBottom: 40, letterSpacing: 3 }}>★ TRAIL BOSS ★</PX>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}><IreneSprite tier={4} /></div>
        <PX size={8} color={C.cream} style={{ display: "block", marginBottom: 24, lineHeight: 3 }}>
          so when am i picking you up<br />for that hike
        </PX>
        <PX size={6} color={C.gold} style={{ display: "block", marginBottom: 40 }}>quest complete.</PX>
        <PX size={5} color={C.creamDim} style={{ display: "block", lineHeight: 3 }}>
          based takes logged<br />health bars survived<br />one hike pending
        </PX>
      </div>
    </div>
  );
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
function AdminPanel({ player, takes, onTakeLogged, onDelete }) {
  const [text, setText] = useState("");
  const [expValue, setExpValue] = useState(10);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/takes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), exp_value: expValue }),
      });
      const data = await res.json();
      setPopup({ quip: data.quip, tier: data.reaction_tier });
      setText(""); setExpValue(10);
      onTakeLogged();
    } finally { setLoading(false); }
  };

  return (
    <div>
      {popup && <QuipPopup quip={popup.quip} tier={popup.tier} onClose={() => setPopup(null)} />}

      {/* quest giver card */}
      <RPGBox color={C.teal} style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <DerekSprite mood="neutral" size={1.1} />
          <div>
            <PX size={7} color={C.teal} style={{ display: "block", marginBottom: 8 }}>QUEST GIVER</PX>
            <PX size={5} color={C.creamDim} style={{ display: "block", lineHeight: 2 }}>
              log irene's takes.<br />based = exp. L = damage.
            </PX>
          </div>
        </div>
      </RPGBox>

      {/* input */}
      <RPGBox color={C.border} style={{ padding: 20, marginBottom: 20 }}>
        <PX size={7} color={C.gold} style={{ display: "block", marginBottom: 14 }}>LOG TAKE</PX>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="what did she say..."
          style={{
            width: "100%", background: C.bgInset, border: `2px solid ${C.border}`,
            color: C.cream, padding: 10, resize: "vertical", minHeight: 80,
            fontFamily: "'Press Start 2P',monospace", fontSize: 6, lineHeight: 1.8,
            boxSizing: "border-box", outline: "none"
          }}
        />
        <div style={{ margin: "14px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <PX size={5} color={C.creamDim}>EXP VALUE</PX>
            <PX size={6} color={expValue >= 0 ? C.green : C.red}>
              {expValue >= 0 ? "+" : ""}{expValue}
            </PX>
          </div>
          <input type="range" min="-20" max="20" value={expValue}
            onChange={e => setExpValue(parseInt(e.target.value))}
            style={{ width: "100%", accentColor: C.gold }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <PX size={4} color={C.red}>-20 big L</PX>
            <PX size={4} color={C.green}>+20 cooked</PX>
          </div>
        </div>
        {/* quick buttons */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {[-15, -10, -5, 5, 10, 15, 20].map(v => (
            <button key={v} onClick={() => setExpValue(v)} style={{
              background: expValue === v ? (v > 0 ? C.green : C.red) : C.bgInset,
              border: `2px solid ${v > 0 ? C.green : C.red}`,
              color: v > 0 ? C.green : C.red,
              padding: "4px 8px", cursor: "pointer",
              fontFamily: "'Press Start 2P',monospace", fontSize: 5,
            }}>{v > 0 ? "+" : ""}{v}</button>
          ))}
        </div>
        <button onClick={handleSubmit} disabled={loading || !text.trim()} style={{
          width: "100%", padding: "12px", background: loading ? "#222" : C.gold,
          border: "none", color: C.bg, cursor: loading ? "default" : "pointer",
          fontFamily: "'Press Start 2P',monospace", fontSize: 7,
          boxShadow: loading ? "none" : `0 0 15px ${C.gold}66`,
          transition: "all 0.2s",
        }}>{loading ? "logging..." : "SUBMIT TAKE"}</button>
      </RPGBox>

      <PX size={6} color={C.border} style={{ display: "block", marginBottom: 10 }}>TAKE HISTORY</PX>
      {takes.length === 0
        ? <PX size={5} color={C.border} style={{ display: "block", padding: "20px 0", textAlign: "center" }}>no takes logged yet</PX>
        : takes.map(t => <TakeEntry key={t.id} take={t} isAdmin onDelete={onDelete} />)
      }
    </div>
  );
}

// ─── CHARACTER SHEET ──────────────────────────────────────────────────────────
function CharacterSheet({ player, takes, onDismissLevelUp }) {
  const tierColors = [C.teal, C.gold, C.teal, C.red, C.gold];
  const color = tierColors[player.tier] || C.teal;

  const handleDismiss = async () => {
    await fetch(`${API}/player/dismiss_level_up`, { method: "POST" });
    onDismissLevelUp();
  };

  return (
    <>
      {player.pending_level_up === 1 && (
        <LevelUpPopup
          quip={player.pending_level_up_quip}
          newTierName={player.levels?.[player.pending_level_up_tier]?.name}
          onClose={handleDismiss}
        />
      )}
      <div>
        {/* character card */}
        <RPGBox color={color} glow style={{ padding: 0, marginBottom: 20 }}>
          <div style={{ background: color, padding: "6px 12px" }}>
            <PX size={6} color={C.bg}>CHARACTER SHEET</PX>
          </div>
          <div style={{ padding: 20, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ flexShrink: 0 }}><IreneSprite tier={player.tier} /></div>
            <div style={{ flex: 1 }}>
              <PX size={9} color={color} style={{ display: "block", marginBottom: 8 }}>IRENE HAN</PX>
              <PX size={6} color={C.cream} style={{ display: "block", marginBottom: 4 }}>
                CLASS: {player.class_name}
              </PX>
              <PX size={5} color={C.creamDim} style={{ display: "block" }}>
                TIER {player.tier + 1} — {player.tier_name?.toUpperCase()}
              </PX>
            </div>
          </div>
        </RPGBox>

        {/* quip carousel — the centerpiece */}
        {takes.length > 0 && <QuipCarousel takes={takes} />}

        {/* bars */}
        <RPGBox color={C.border} style={{ padding: 20, marginBottom: 20 }}>
          <RPGBar value={player.exp_in_tier} max={player.exp_to_next}
            color={color} label="EXP" isMax={player.is_max_tier} />
          <RPGBar value={player.current_health} max={player.max_health}
            color={player.current_health <= 25 ? C.red : C.green} label="HP" />
        </RPGBox>

        {/* quest log */}
        <RPGBox color={C.border} style={{ padding: 20, marginBottom: 20 }}>
          <PX size={7} color={C.gold} style={{ display: "block", marginBottom: 16 }}>QUEST LOG</PX>
          {player.levels?.map((lvl, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 12,
              opacity: i > player.tier ? 0.3 : 1
            }}>
              <div style={{
                width: 12, height: 12, flexShrink: 0,
                background: i <= player.tier ? color : C.bgInset,
                border: `2px solid ${i <= player.tier ? color : C.border}`,
                boxShadow: i === player.tier ? `0 0 8px ${color}` : "none",
              }} />
              <div style={{ flex: 1 }}>
                <PX size={6} color={i <= player.tier ? C.cream : C.border} style={{ display: "block" }}>{lvl.name}</PX>
                <PX size={4} color={C.creamDim}>{lvl.class}</PX>
              </div>
              {i === player.tier && <PX size={4} color={color}>◄ HERE</PX>}
            </div>
          ))}
        </RPGBox>

        {/* full take log */}
        <PX size={6} color={C.border} style={{ display: "block", marginBottom: 10 }}>TAKE LOG</PX>
        {takes.length === 0
          ? <PX size={5} color={C.border} style={{ display: "block", padding: "20px 0", textAlign: "center" }}>no takes yet</PX>
          : takes.map(t => <TakeEntry key={t.id} take={t} isAdmin={false} />)
        }
      </div>
    </>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [player, setPlayer] = useState(null);
  const [takes, setTakes] = useState([]);
  const [view, setView] = useState("player");
  const [loading, setLoading] = useState(true);

  // WAKE PING ADDED HERE
  useEffect(() => {
    fetch(`${API}/player`).catch(() => { });
  }, []);

  // RETRY LOGIC WITH EXPONENTIAL BACKOFF ADDED HERE
  const fetchAll = useCallback(async (retries = 3, delay = 1000) => {
    try {
      const [p, t] = await Promise.all([
        fetch(`${API}/player`).then(r => {
          if (!r.ok) throw new Error("Failed fetching player");
          return r.json();
        }),
        fetch(`${API}/takes`).then(r => {
          if (!r.ok) throw new Error("Failed fetching takes");
          return r.json();
        }),
      ]);
      setPlayer(p);
      setTakes(t);
      setLoading(false);
    } catch (e) {
      console.error(e);
      if (retries > 0) {
        setTimeout(() => fetchAll(retries - 1, delay * 2), delay);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id) => {
    if (!confirm("delete this take?")) return;
    await fetch(`${API}/takes/${id}`, { method: "DELETE" });
    fetchAll();
  };

  if (loading || !player) return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24
    }}>
      <IreneSprite tier={0} />
      <PX size={8} color={C.gold}>loading...</PX>
    </div>
  );

  const gameOver = player.current_health <= 0;
  const maxTier = player.tier === 4;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;}
        body{background:${C.bg};color:${C.cream};}
        ::-webkit-scrollbar{width:6px;}
        ::-webkit-scrollbar-track{background:${C.bgInset};}
        ::-webkit-scrollbar-thumb{background:${C.gold};}
        @keyframes popIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}
        @keyframes levelPop{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.05)}100%{transform:scale(1);opacity:1}}
        @keyframes creditsScroll{from{transform:translateY(100vh)}to{transform:translateY(-200%)}}
        @keyframes bobAnim{from{transform:translateY(0)}to{transform:translateY(-4px)}}
        textarea::placeholder{color:${C.border};font-family:'Press Start 2P',monospace;font-size:6px;}
        textarea:focus{border-color:${C.gold}!important;outline:none;}
      `}</style>
      <CRT />
      {gameOver && <GameOverScreen />}
      {maxTier && !gameOver && <CreditsScreen />}

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 80px" }}>
        {/* header */}
        <div style={{
          padding: "24px 0 20px", borderBottom: `2px solid ${C.border}`, marginBottom: 20,
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <PX size={10} color={C.gold} style={{ display: "block", marginBottom: 6 }}>IRENE.EXE</PX>
            <PX size={5} color={C.creamDim}>based take tracker v1.0</PX>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["player", "HER"], ["admin", "YOU"]].map(([v, label]) => (
              <button key={v} onClick={() => setView(v)} style={{
                background: view === v ? C.gold : C.bgInset,
                border: `2px solid ${view === v ? C.gold : C.border}`,
                color: view === v ? C.bg : C.creamDim,
                padding: "6px 12px", cursor: "pointer",
                fontFamily: "'Press Start 2P',monospace", fontSize: 6,
                boxShadow: view === v ? `0 0 10px ${C.gold}66` : "none",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* stats bar */}
        <RPGBox color={C.border} style={{ padding: "10px 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <PX size={6} color={C.teal}>EXP {player.current_exp}</PX>
            <PX size={6} color={player.current_health <= 25 ? C.red : C.green}>
              HP {player.current_health}/100
            </PX>
            <PX size={6} color={C.gold}>T{player.tier + 1}</PX>
            <PX size={5} color={C.border} style={{ marginLeft: "auto" }}>{takes.length} takes</PX>
          </div>
        </RPGBox>

        {view === "admin"
          ? <AdminPanel player={player} takes={takes} onTakeLogged={fetchAll} onDelete={handleDelete} />
          : <CharacterSheet player={player} takes={takes} onDismissLevelUp={fetchAll} />
        }
      </div>
    </>
  );
}