import { useState, useEffect, useCallback } from "react";

const API = "https://irene-tracker-production.up.railway.app";

const C = {
  bg: "#0a0800", bgPanel: "#0f0e08", bgInset: "#060504",
  gold: "#d4a017", goldDim: "#7a5c0a", teal: "#2a9d8f", tealDim: "#14524c",
  cream: "#e8dcc8", creamDim: "#7a6e5a", red: "#c0392b", redDim: "#6b1f17",
  green: "#4a7c59", border: "#3a3018", shadow: "#000000",
};

// ─── WARDROBE OPTIONS ─────────────────────────────────────────────────────────
const TOPS = [
  { id: "beige",  label: "BEIGE",   color: "#c8b89a" },
  { id: "red",    label: "RED",     color: "#c0392b" },
  { id: "teal",   label: "TEAL",    color: "#2a9d8f" },
  { id: "purple", label: "PURPLE",  color: "#8e44ad" },
  { id: "gold",   label: "GOLD",    color: "#d4a017" },
  { id: "navy",   label: "NAVY",    color: "#1a2a5a" },
  { id: "pink",   label: "PINK",    color: "#d4607a" },
  { id: "sage",   label: "SAGE",    color: "#6a9a7a" },
];
const PANTS = [
  { id: "charcoal", label: "CHARCOAL", color: "#2c2c3a" },
  { id: "navy",     label: "NAVY",     color: "#1a2a4a" },
  { id: "black",    label: "BLACK",    color: "#111118" },
  { id: "brown",    label: "BROWN",    color: "#5a3820" },
  { id: "olive",    label: "OLIVE",    color: "#4a4a20" },
  { id: "rust",     label: "RUST",     color: "#8a3a20" },
  { id: "lavender", label: "LAVENDER", color: "#6a5a8a" },
  { id: "white",    label: "WHITE",    color: "#d8d4c8" },
];
const SHOES = [
  { id: "black",  label: "BLACK",  color: "#111111" },
  { id: "white",  label: "WHITE",  color: "#e8e4d8" },
  { id: "brown",  label: "BROWN",  color: "#7a4520" },
  { id: "red",    label: "RED",    color: "#a02010" },
  { id: "teal",   label: "TEAL",   color: "#1a6a60" },
  { id: "gold",   label: "GOLD",   color: "#c89010" },
  { id: "pink",   label: "PINK",   color: "#c05070" },
  { id: "grey",   label: "GREY",   color: "#606060" },
];
const EXPRESSIONS = [
  { id: "smile",   label: "😊" },
  { id: "neutral", label: "😐" },
  { id: "frown",   label: "😒" },
];
const HAIRSTYLES = [
  { id: "down", label: "DOWN" },
  { id: "up",   label: "UP"   },
];

function colorFor(list, id) {
  return list.find(x => x.id === id)?.color ?? list[0].color;
}

// ─── RPG BOX ──────────────────────────────────────────────────────────────────
function RPGBox({ children, color = C.gold, style = {}, glow = false }) {
  return (
    <div style={{
      position: "relative", background: C.bgPanel,
      border: `3px solid ${color}`, outline: `1px solid ${C.bgInset}`, outlineOffset: "3px",
      boxShadow: glow
        ? `0 0 0 1px ${C.bg}, 0 0 20px ${color}44, inset 0 0 30px rgba(0,0,0,0.5)`
        : `0 0 0 1px ${C.bg}, inset 0 0 20px rgba(0,0,0,0.4)`,
      ...style,
    }}>
      <div style={{ position: "absolute", top: -3, left: -3, width: 6, height: 6, background: C.bg }} />
      <div style={{ position: "absolute", top: -3, right: -3, width: 6, height: 6, background: C.bg }} />
      <div style={{ position: "absolute", bottom: -3, left: -3, width: 6, height: 6, background: C.bg }} />
      <div style={{ position: "absolute", bottom: -3, right: -3, width: 6, height: 6, background: C.bg }} />
      {children}
    </div>
  );
}

// ─── IRENE SPRITE (fully customizable) ───────────────────────────────────────
function IreneSprite({ tier = 0, size = 1, topColor, pantsColor, shoesColor, expression = "neutral", hairStyle = "down" }) {
  const w = Math.round(64 * size), h = Math.round(96 * size);
  const auraColors = ["none", C.teal, C.gold, C.red, "#f39c12"];
  const defaultTops = ["#c8b89a", "#c0392b", "#2a9d8f", "#8e44ad", "#d4a017"];
  const aura = auraColors[tier];
  const top   = topColor   ?? defaultTops[tier];
  const pants = pantsColor ?? "#2c2c3a";
  const shoes = shoesColor ?? "#111111";

  // mouth shape per expression
  const Mouth = () => {
    if (expression === "smile") return (
      <>
        <rect x="6" y="7" width="4" height="1" fill="#c47a6a" />
        <rect x="5" y="7" width="1" height="1" fill="#c47a6a" />
        <rect x="10" y="7" width="1" height="1" fill="#c47a6a" />
      </>
    );
    if (expression === "frown") return (
      <>
        <rect x="6" y="8" width="4" height="1" fill="#c47a6a" />
        <rect x="5" y="7" width="1" height="1" fill="#c47a6a" />
        <rect x="10" y="7" width="1" height="1" fill="#c47a6a" />
      </>
    );
    // neutral
    return <rect x="6" y="7" width="4" height="1" fill="#c47a6a" />;
  };

  // hair up = bun on top, shorter side pieces
  const Hair = () => {
    if (hairStyle === "up") return (
      <>
        {/* base head coverage */}
        <rect x="4" y="2" width="8" height="2" fill="#1a0f0a" />
        <rect x="3" y="3" width="10" height="1" fill="#1a0f0a" />
        {/* bun */}
        <rect x="6" y="0" width="4" height="3" fill="#1a0f0a" />
        <rect x="5" y="0" width="1" height="2" fill="#1a0f0a" />
        <rect x="10" y="0" width="1" height="2" fill="#1a0f0a" />
        {/* small side wisps */}
        <rect x="2" y="3" width="1" height="4" fill="#1a0f0a" />
        <rect x="13" y="3" width="1" height="4" fill="#1a0f0a" />
      </>
    );
    // hair down (original)
    return (
      <>
        <rect x="4" y="0" width="8" height="2" fill="#1a0f0a" />
        <rect x="3" y="1" width="10" height="5" fill="#1a0f0a" />
        <rect x="2" y="2" width="1" height="8" fill="#1a0f0a" />
        <rect x="13" y="2" width="1" height="8" fill="#1a0f0a" />
        <rect x="3" y="6" width="2" height="6" fill="#1a0f0a" />
        <rect x="11" y="6" width="2" height="6" fill="#1a0f0a" />
      </>
    );
  };

  return (
    <svg width={w} height={h} viewBox="0 0 16 24" style={{ imageRendering: "pixelated", display: "block" }}>
      {tier > 0 && <ellipse cx="8" cy="23" rx="6" ry="1.5" fill={aura} opacity="0.35" />}
      <Hair />
      {/* face */}
      <rect x="4" y="3" width="8" height="6" fill="#f0c8a8" />
      {/* eyes */}
      <rect x="5" y="5" width="2" height="1" fill="#1a0f0a" />
      <rect x="9" y="5" width="2" height="1" fill="#1a0f0a" />
      <rect x="5" y="5" width="1" height="1" fill="#3a2a22" />
      <rect x="9" y="5" width="1" height="1" fill="#3a2a22" />
      <Mouth />
      {/* neck */}
      <rect x="7" y="9" width="2" height="1" fill="#f0c8a8" />
      {/* top */}
      <rect x="4" y="10" width="8" height="7" fill={top} />
      <rect x="2" y="10" width="2" height="6" fill={top} />
      <rect x="12" y="10" width="2" height="6" fill={top} />
      <rect x="7" y="10" width="2" height="7" fill="#00000022" />
      {/* hands */}
      <rect x="2" y="16" width="2" height="2" fill="#f0c8a8" />
      <rect x="12" y="16" width="2" height="2" fill="#f0c8a8" />
      {/* pants */}
      <rect x="4" y="17" width="3" height="5" fill={pants} />
      <rect x="9" y="17" width="3" height="5" fill={pants} />
      {/* shoes */}
      <rect x="3" y="21" width="4" height="2" fill={shoes} />
      <rect x="9" y="21" width="4" height="2" fill={shoes} />
      {/* tier sparkles */}
      {tier >= 2 && <><rect x="1" y="4" width="1" height="1" fill={C.gold} opacity="0.9" /><rect x="14" y="7" width="1" height="1" fill={C.gold} opacity="0.7" /></>}
      {tier >= 3 && <><rect x="0" y="10" width="1" height="1" fill={C.red} opacity="0.9" /><rect x="15" y="3" width="1" height="1" fill={C.red} opacity="0.8" /></>}
      {tier >= 4 && <><rect x="7" y="0" width="2" height="1" fill={C.gold} /><rect x="0" y="1" width="1" height="1" fill={C.gold} opacity="0.6" /><rect x="15" y="12" width="1" height="1" fill={C.gold} opacity="0.8" /></>}
    </svg>
  );
}

// ─── DEREK SPRITE ─────────────────────────────────────────────────────────────
function DerekSprite({ mood = "neutral", size = 1, bob = false }) {
  const w = Math.round(56 * size), h = Math.round(80 * size);
  const shirtColors = { neutral: "#1a2a4a", hype: "#1a4a3a", sad: "#2a2a2a", crit: "#4a1a1a" };
  const shirt = shirtColors[mood] || shirtColors.neutral;
  return (
    <svg width={w} height={h} viewBox="0 0 14 20"
      style={{ imageRendering: "pixelated", display: "block", animation: bob ? "bobAnim 0.8s ease-in-out infinite alternate" : "none" }}>
      <rect x="3" y="0" width="8" height="2" fill="#5c3010" />
      <rect x="2" y="1" width="10" height="4" fill="#7a4520" />
      <rect x="1" y="2" width="2" height="3" fill="#7a4520" />
      <rect x="11" y="2" width="2" height="3" fill="#5c3010" />
      <rect x="3" y="3" width="8" height="6" fill="#e8b890" />
      <rect x="4" y="5" width="2" height="1" fill="#2c1a10" />
      <rect x="8" y="5" width="2" height="1" fill="#2c1a10" />
      {mood === "hype"    && <rect x="4" y="7" width="6" height="1" fill="#c06040" />}
      {mood === "sad"     && <><rect x="4" y="8" width="6" height="1" fill="#c06040" /><rect x="4" y="7" width="1" height="1" fill="#c06040" /><rect x="9" y="7" width="1" height="1" fill="#c06040" /></>}
      {mood === "neutral" && <rect x="5" y="7" width="4" height="1" fill="#c06040" />}
      {mood === "crit"    && <rect x="5" y="7" width="4" height="1" fill="#c06040" />}
      <rect x="6" y="9" width="2" height="1" fill="#e8b890" />
      <rect x="3" y="10" width="8" height="6" fill={shirt} />
      <rect x="1" y="10" width="2" height="5" fill={shirt} />
      <rect x="11" y="10" width="2" height="5" fill={shirt} />
      <rect x="1" y="15" width="2" height="2" fill="#e8b890" />
      <rect x="11" y="15" width="2" height="2" fill="#e8b890" />
      <rect x="3" y="16" width="3" height="4" fill="#2c3040" />
      <rect x="8" y="16" width="3" height="4" fill="#2c3040" />
      <rect x="2" y="19" width="4" height="1" fill="#111" />
      <rect x="8" y="19" width="4" height="1" fill="#111" />
    </svg>
  );
}

const PX = ({ size = 7, color = C.cream, children, style = {} }) => (
  <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: size, color, lineHeight: 1.8, ...style }}>
    {children}
  </span>
);

function CRT() {
  return (
    <div style={{
      position: "fixed", inset: 0, pointerEvents: "none", zIndex: 900,
      background: "repeating-linear-gradient(0deg,rgba(0,0,0,0.12) 0px,rgba(0,0,0,0.12) 1px,transparent 1px,transparent 3px)",
    }} />
  );
}

function RPGBar({ value, max, color, label, isMax }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 100;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <PX size={5} color={C.creamDim}>{label}</PX>
        <PX size={5} color={color}>{isMax ? "MAX" : `${value} / ${max}`}</PX>
      </div>
      <div style={{ position: "relative", height: 12, background: C.bgInset, border: `2px solid ${C.border}` }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, boxShadow: `0 0 6px ${color}88`, transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)" }} />
        {[25, 50, 75].map(p => <div key={p} style={{ position: "absolute", top: 0, left: `${p}%`, width: 2, height: "100%", background: "rgba(0,0,0,0.4)" }} />)}
      </div>
    </div>
  );
}

function moodFromTier(tier) {
  const map = { big_gain: "hype", mid_gain: "hype", small_gain: "neutral", small_loss: "sad", big_loss: "sad", level_up: "hype", health_crit: "crit", game_over: "sad" };
  return map[tier] || "neutral";
}

// ─── WARDROBE PICKER (her view only) ─────────────────────────────────────────
function WardrobePicker({ player, onSave }) {
  const [top,    setTop]    = useState(player.outfit_top    || "beige");
  const [pants,  setPants]  = useState(player.outfit_pants  || "charcoal");
  const [shoes,  setShoes]  = useState(player.outfit_shoes  || "black");
  const [expr,   setExpr]   = useState(player.face_expr     || "neutral");
  const [hair,   setHair]   = useState(player.hair_style    || "down");
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await fetch(`${API}/player/outfit`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outfit_top: top, outfit_pants: pants, outfit_shoes: shoes, face_expr: expr, hair_style: hair }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onSave();
  };

  const SwatchRow = ({ label, options, value, onChange, isText = false }) => (
    <div style={{ marginBottom: 16 }}>
      <PX size={5} color={C.creamDim} style={{ display: "block", marginBottom: 8 }}>{label}</PX>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {options.map(opt => {
          const selected = value === opt.id;
          return (
            <button key={opt.id} onClick={() => onChange(opt.id)} style={{
              width: isText ? "auto" : 28, height: isText ? "auto" : 28,
              padding: isText ? "4px 8px" : 0,
              background: isText ? (selected ? C.gold : C.bgInset) : opt.color,
              border: `3px solid ${selected ? C.gold : C.border}`,
              cursor: "pointer",
              boxShadow: selected ? `0 0 8px ${C.gold}` : "none",
              fontFamily: isText ? "'Press Start 2P',monospace" : undefined,
              fontSize: isText ? 8 : undefined,
              color: isText ? (selected ? C.bg : C.creamDim) : undefined,
              position: "relative",
            }}>
              {isText && opt.label}
              {!isText && selected && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 6, height: 6, background: "rgba(255,255,255,0.8)" }} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <RPGBox color={C.teal} style={{ padding: 0, marginBottom: 20 }}>
      <div style={{ background: C.teal, padding: "6px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <PX size={6} color={C.bg}>WARDROBE</PX>
        <PX size={4} color={C.bg}>customize ur fit</PX>
      </div>
      <div style={{ padding: 20 }}>
        {/* live preview */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <IreneSprite
            tier={player.tier}
            size={2.5}
            topColor={colorFor(TOPS, top)}
            pantsColor={colorFor(PANTS, pants)}
            shoesColor={colorFor(SHOES, shoes)}
            expression={expr}
            hairStyle={hair}
          />
        </div>

        <SwatchRow label="TOP"        options={TOPS}        value={top}   onChange={setTop} />
        <SwatchRow label="PANTS"      options={PANTS}       value={pants} onChange={setPants} />
        <SwatchRow label="SHOES"      options={SHOES}       value={shoes} onChange={setShoes} />
        <SwatchRow label="EXPRESSION" options={EXPRESSIONS} value={expr}  onChange={setExpr}  isText />
        <SwatchRow label="HAIR"       options={HAIRSTYLES}  value={hair}  onChange={setHair}  isText />

        <button onClick={handleSave} disabled={saving} style={{
          width: "100%", padding: "10px", marginTop: 4,
          background: saved ? C.green : saving ? "#222" : C.teal,
          border: "none", color: C.bg, cursor: saving ? "default" : "pointer",
          fontFamily: "'Press Start 2P',monospace", fontSize: 7,
          boxShadow: saving ? "none" : `0 0 12px ${C.teal}66`,
          transition: "all 0.2s",
        }}>
          {saved ? "SAVED ✓" : saving ? "saving..." : "SAVE FIT"}
        </button>
      </div>
    </RPGBox>
  );
}

// ─── QUIP CAROUSEL ────────────────────────────────────────────────────────────
function QuipCarousel({ takes }) {
  const recent = takes.slice(0, 10);
  const [idx, setIdx] = useState(0);
  const current = recent[idx];
  if (!current) return null;
  const mood = moodFromTier(current.reaction_tier);
  const tierColors = { big_gain: C.gold, mid_gain: C.teal, small_gain: C.green, small_loss: "#e67e22", big_loss: C.red, level_up: C.gold, health_crit: C.red, game_over: C.red };
  const dialogColor = tierColors[current.reaction_tier] || C.teal;
  const isPos = current.exp_value > 0;
  return (
    <RPGBox color={dialogColor} glow style={{ padding: 0, marginBottom: 24 }}>
      <div style={{ background: dialogColor, padding: "6px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <PX size={6} color={C.bg}>DEREK SAYS</PX>
        <PX size={5} color={C.bg}>{idx + 1} / {recent.length}</PX>
      </div>
      <div style={{ padding: 20, display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <DerekSprite mood={mood} bob={mood === "hype"} size={1.2} />
          <div style={{ background: C.bgInset, border: `1px solid ${dialogColor}`, padding: "3px 6px" }}>
            <PX size={4} color={isPos ? C.green : C.red}>{isPos ? "+" : ""}{current.exp_value} EXP</PX>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: C.bgInset, border: `1px solid ${C.border}`, padding: "8px 10px", marginBottom: 12 }}>
            <PX size={5} color={C.creamDim} style={{ display: "block" }}>HER TAKE:</PX>
            <PX size={6} color={C.cream} style={{ display: "block", marginTop: 4 }}>{current.text}</PX>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: -8, top: 10, width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: `8px solid ${dialogColor}` }} />
            <div style={{ background: C.bgPanel, border: `2px solid ${dialogColor}`, padding: "10px 14px", boxShadow: `0 0 12px ${dialogColor}44` }}>
              <PX size={7} color={dialogColor}>"{current.quip}"</PX>
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: `2px solid ${C.border}`, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={() => setIdx(i => Math.min(recent.length - 1, i + 1))} disabled={idx === recent.length - 1}
          style={{ background: "none", border: `2px solid ${idx === recent.length - 1 ? C.border : dialogColor}`, color: idx === recent.length - 1 ? C.border : dialogColor, padding: "4px 10px", cursor: idx === recent.length - 1 ? "default" : "pointer", fontFamily: "'Press Start 2P',monospace", fontSize: 8 }}>◄</button>
        <PX size={5} color={C.creamDim}>{new Date(current.timestamp + "Z").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</PX>
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0}
          style={{ background: "none", border: `2px solid ${idx === 0 ? C.border : dialogColor}`, color: idx === 0 ? C.border : dialogColor, padding: "4px 10px", cursor: idx === 0 ? "default" : "pointer", fontFamily: "'Press Start 2P',monospace", fontSize: 8 }}>►</button>
      </div>
    </RPGBox>
  );
}

// ─── TAKE ENTRY ───────────────────────────────────────────────────────────────
function TakeEntry({ take, isAdmin, onDelete }) {
  const isPos = take.exp_value > 0;
  const tierColors = { big_gain: C.gold, mid_gain: C.teal, small_gain: C.green, small_loss: "#e67e22", big_loss: C.red, level_up: C.gold, health_crit: C.red, game_over: C.red };
  const color = tierColors[take.reaction_tier] || C.creamDim;
  const date = new Date(take.timestamp + "Z").toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  return (
    <div style={{ borderLeft: `3px solid ${color}`, background: C.bgInset, padding: "10px 14px", marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <PX size={5} color={C.cream} style={{ flex: 1, display: "block" }}>{take.text}</PX>
        <PX size={6} color={isPos ? C.green : C.red} style={{ flexShrink: 0 }}>{isPos ? "+" : ""}{take.exp_value}</PX>
      </div>
      {take.quip && <PX size={5} color={color} style={{ display: "block", marginTop: 6, fontStyle: "italic" }}>"{take.quip}"</PX>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
        <PX size={4} color={C.border}>{date}</PX>
        {isAdmin && <button onClick={() => onDelete(take.id)} style={{ background: "none", border: `1px solid ${C.red}`, color: C.red, padding: "2px 6px", cursor: "pointer", fontFamily: "'Press Start 2P',monospace", fontSize: 4 }}>DEL</button>}
      </div>
    </div>
  );
}

// ─── LEVEL UP POPUP ───────────────────────────────────────────────────────────
function LevelUpPopup({ quip, newTierName, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, cursor: "pointer" }} onClick={onClose}>
      <div style={{ textAlign: "center", animation: "levelPop 0.4s ease" }}>
        <PX size={14} color={C.gold} style={{ display: "block", marginBottom: 24, letterSpacing: 4 }}>★ LEVEL UP ★</PX>
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}><DerekSprite mood="hype" bob size={1.5} /></div>
        <RPGBox color={C.gold} glow style={{ padding: "16px 24px", maxWidth: 340, margin: "0 auto 20px" }}>
          <PX size={7} color={C.gold}>"{quip}"</PX>
        </RPGBox>
        <PX size={6} color={C.teal} style={{ display: "block", marginBottom: 16 }}>NEW TIER: {newTierName?.toUpperCase()}</PX>
        <PX size={5} color={C.creamDim}>[ tap to continue ]</PX>
      </div>
    </div>
  );
}

// ─── QUIP POPUP ───────────────────────────────────────────────────────────────
function QuipPopup({ quip, tier, onClose }) {
  const tierColors = { big_gain: C.gold, mid_gain: C.teal, small_gain: C.green, small_loss: "#e67e22", big_loss: C.red, level_up: C.gold, health_crit: C.red, game_over: C.red };
  const color = tierColors[tier] || C.teal;
  const mood = moodFromTier(tier);
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, cursor: "pointer" }} onClick={onClose}>
      <RPGBox color={color} glow style={{ padding: 0, maxWidth: 400, width: "90%", animation: "popIn 0.3s ease" }}>
        <div style={{ background: color, padding: "6px 12px" }}><PX size={6} color={C.bg}>TAKE LOGGED</PX></div>
        <div style={{ padding: 20, display: "flex", gap: 16, alignItems: "center" }}>
          <DerekSprite mood={mood} size={1.1} />
          <PX size={7} color={color} style={{ display: "block" }}>"{quip}"</PX>
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
    <div style={{ position: "fixed", inset: 0, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 999 }}>
      <PX size={20} color={C.red} style={{ display: "block", marginBottom: 32, letterSpacing: 4 }}>GAME OVER</PX>
      <div style={{ marginBottom: 32 }}><IreneSprite tier={0} /></div>
      <RPGBox color={C.red} style={{ padding: "20px 32px", textAlign: "center", maxWidth: 360 }}>
        <PX size={7} color={C.cream} style={{ display: "block", lineHeight: 2.5 }}>you weren't based enough<br />tsk tsk<br /><br /></PX>
        <PX size={7} color={C.creamDim} style={{ display: "block", lineHeight: 2 }}>i guess i gotta hike<br />by myself 🥾</PX>
      </RPGBox>
    </div>
  );
}

// ─── CREDITS ──────────────────────────────────────────────────────────────────
function CreditsScreen({ onDismiss }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 999, overflow: "hidden" }}>
      <div style={{ animation: "creditsScroll 14s linear forwards", textAlign: "center", padding: "0 40px" }}>
        <PX size={14} color={C.gold} style={{ display: "block", marginBottom: 40, letterSpacing: 3 }}>★ TRAIL BOSS ★</PX>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}><IreneSprite tier={4} /></div>
        <PX size={8} color={C.cream} style={{ display: "block", marginBottom: 24, lineHeight: 3 }}>so when am i picking you up<br />for that hike</PX>
        <PX size={6} color={C.gold} style={{ display: "block", marginBottom: 40 }}>quest complete.</PX>
        <PX size={5} color={C.creamDim} style={{ display: "block", lineHeight: 3 }}>based takes logged<br />health bars survived<br />one hike pending</PX>
      </div>
      <button onClick={onDismiss} style={{
        position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
        background: "none", border: `2px solid ${C.gold}`, color: C.gold,
        padding: "8px 16px", cursor: "pointer",
        fontFamily: "'Press Start 2P',monospace", fontSize: 6,
        boxShadow: `0 0 10px ${C.gold}44`,
      }}>
        [ view stats ]
      </button>
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
        method: "POST", headers: { "Content-Type": "application/json" },
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
      <RPGBox color={C.teal} style={{ padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <DerekSprite mood="neutral" size={1.1} />
          <div>
            <PX size={7} color={C.teal} style={{ display: "block", marginBottom: 8 }}>QUEST GIVER</PX>
            <PX size={5} color={C.creamDim} style={{ display: "block", lineHeight: 2 }}>log irene's takes.<br />based = exp. L = damage.</PX>
          </div>
        </div>
      </RPGBox>
      <RPGBox color={C.border} style={{ padding: 20, marginBottom: 20 }}>
        <PX size={7} color={C.gold} style={{ display: "block", marginBottom: 14 }}>LOG TAKE</PX>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="what did she say..."
          style={{ width: "100%", background: C.bgInset, border: `2px solid ${C.border}`, color: C.cream, padding: 10, resize: "vertical", minHeight: 80, fontFamily: "'Press Start 2P',monospace", fontSize: 6, lineHeight: 1.8, boxSizing: "border-box", outline: "none" }} />
        <div style={{ margin: "14px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <PX size={5} color={C.creamDim}>EXP VALUE</PX>
            <PX size={6} color={expValue >= 0 ? C.green : C.red}>{expValue >= 0 ? "+" : ""}{expValue}</PX>
          </div>
          <input type="range" min="-20" max="20" value={expValue} onChange={e => setExpValue(parseInt(e.target.value))} style={{ width: "100%", accentColor: C.gold }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <PX size={4} color={C.red}>-20 big L</PX>
            <PX size={4} color={C.green}>+20 cooked</PX>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {[-15, -10, -5, 5, 10, 15, 20].map(v => (
            <button key={v} onClick={() => setExpValue(v)} style={{ background: expValue === v ? (v > 0 ? C.green : C.red) : C.bgInset, border: `2px solid ${v > 0 ? C.green : C.red}`, color: v > 0 ? C.green : C.red, padding: "4px 8px", cursor: "pointer", fontFamily: "'Press Start 2P',monospace", fontSize: 5 }}>{v > 0 ? "+" : ""}{v}</button>
          ))}
        </div>
        <button onClick={handleSubmit} disabled={loading || !text.trim()} style={{ width: "100%", padding: "12px", background: loading ? "#222" : C.gold, border: "none", color: C.bg, cursor: loading ? "default" : "pointer", fontFamily: "'Press Start 2P',monospace", fontSize: 7, boxShadow: loading ? "none" : `0 0 15px ${C.gold}66`, transition: "all 0.2s" }}>{loading ? "logging..." : "SUBMIT TAKE"}</button>
      </RPGBox>
      <PX size={6} color={C.border} style={{ display: "block", marginBottom: 10 }}>TAKE HISTORY</PX>
      {takes.length === 0
        ? <PX size={5} color={C.border} style={{ display: "block", padding: "20px 0", textAlign: "center" }}>no takes logged yet</PX>
        : takes.map(t => <TakeEntry key={t.id} take={t} isAdmin onDelete={onDelete} />)}
    </div>
  );
}

// ─── CHARACTER SHEET (her view) ───────────────────────────────────────────────
function CharacterSheet({ player, takes, onDismissLevelUp, onRefresh }) {
  const tierColors = [C.teal, C.gold, C.teal, C.red, C.gold];
  const color = tierColors[player.tier] || C.teal;

  const handleDismiss = async () => {
    await fetch(`${API}/player/dismiss_level_up`, { method: "POST" });
    onDismissLevelUp();
  };

  return (
    <>
      {player.pending_level_up === 1 && (
        <LevelUpPopup quip={player.pending_level_up_quip} newTierName={player.levels?.[player.pending_level_up_tier]?.name} onClose={handleDismiss} />
      )}
      <div>
        {/* character card */}
        <RPGBox color={color} glow style={{ padding: 0, marginBottom: 20 }}>
          <div style={{ background: color, padding: "6px 12px" }}><PX size={6} color={C.bg}>CHARACTER SHEET</PX></div>
          <div style={{ padding: 20, display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ flexShrink: 0 }}>
              <IreneSprite
                tier={player.tier}
                topColor={colorFor(TOPS,   player.outfit_top   || "beige")}
                pantsColor={colorFor(PANTS, player.outfit_pants || "charcoal")}
                shoesColor={colorFor(SHOES, player.outfit_shoes || "black")}
                expression={player.face_expr   || "neutral"}
                hairStyle={player.hair_style   || "down"}
              />
            </div>
            <div style={{ flex: 1 }}>
              <PX size={9} color={color} style={{ display: "block", marginBottom: 8 }}>IRENE HAN</PX>
              <PX size={6} color={C.cream} style={{ display: "block", marginBottom: 4 }}>CLASS: {player.class_name}</PX>
              <PX size={5} color={C.creamDim} style={{ display: "block" }}>TIER {player.tier + 1} — {player.tier_name?.toUpperCase()}</PX>
            </div>
          </div>
        </RPGBox>

        {/* wardrobe picker */}
        <WardrobePicker player={player} onSave={onRefresh} />

        {takes.length > 0 && <QuipCarousel takes={takes} />}

        <RPGBox color={C.border} style={{ padding: 20, marginBottom: 20 }}>
          <RPGBar value={player.exp_in_tier} max={player.exp_to_next} color={color} label="EXP" isMax={player.is_max_tier} />
          <RPGBar value={player.current_health} max={player.max_health} color={player.current_health <= 25 ? C.red : C.green} label="HP" />
        </RPGBox>

        <RPGBox color={C.border} style={{ padding: 20, marginBottom: 20 }}>
          <PX size={7} color={C.gold} style={{ display: "block", marginBottom: 16 }}>QUEST LOG</PX>
          {player.levels?.map((lvl, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, opacity: i > player.tier ? 0.3 : 1 }}>
              <div style={{ width: 12, height: 12, flexShrink: 0, background: i <= player.tier ? color : C.bgInset, border: `2px solid ${i <= player.tier ? color : C.border}`, boxShadow: i === player.tier ? `0 0 8px ${color}` : "none" }} />
              <div style={{ flex: 1 }}>
                <PX size={6} color={i <= player.tier ? C.cream : C.border} style={{ display: "block" }}>{lvl.name}</PX>
                <PX size={4} color={C.creamDim}>{lvl.class}</PX>
              </div>
              {i === player.tier && <PX size={4} color={color}>◄ HERE</PX>}
            </div>
          ))}
        </RPGBox>

        <PX size={6} color={C.border} style={{ display: "block", marginBottom: 10 }}>TAKE LOG</PX>
        {takes.length === 0
          ? <PX size={5} color={C.border} style={{ display: "block", padding: "20px 0", textAlign: "center" }}>no takes yet</PX>
          : takes.map(t => <TakeEntry key={t.id} take={t} isAdmin={false} />)}
      </div>
    </>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [player, setPlayer] = useState(null);
  const [takes,  setTakes]  = useState([]);
  const [view,   setView]   = useState("player");
  const [loading, setLoading] = useState(true);
  const [creditsDismissed, setCreditsDismissed] = useState(false);

  useEffect(() => { fetch(`${API}/player`).catch(() => {}); }, []);

  const fetchAll = useCallback(async (retries = 3, delay = 1000) => {
    try {
      const [p, t] = await Promise.all([
        fetch(`${API}/player`).then(r => { if (!r.ok) throw new Error(); return r.json(); }),
        fetch(`${API}/takes`).then(r =>  { if (!r.ok) throw new Error(); return r.json(); }),
      ]);
      setPlayer(p); setTakes(t); setLoading(false);
    } catch (e) {
      if (retries > 0) setTimeout(() => fetchAll(retries - 1, delay * 2), delay);
      else setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id) => {
    if (!confirm("delete this take?")) return;
    await fetch(`${API}/takes/${id}`, { method: "DELETE" });
    fetchAll();
  };

  if (loading || !player) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <IreneSprite tier={0} />
      <PX size={8} color={C.gold}>loading...</PX>
    </div>
  );

  const gameOver = player.current_health <= 0;
  const maxTier  = player.tier === 4;

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
      {maxTier && !gameOver && !creditsDismissed && <CreditsScreen onDismiss={() => setCreditsDismissed(true)} />}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 80px" }}>
        <div style={{ padding: "24px 0 20px", borderBottom: `2px solid ${C.border}`, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <PX size={10} color={C.gold} style={{ display: "block", marginBottom: 6 }}>IRENE.EXE</PX>
            <PX size={5} color={C.creamDim}>based take tracker v1.0</PX>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["player", "HER"], ["admin", "YOU"]].map(([v, label]) => (
              <button key={v} onClick={() => setView(v)} style={{ background: view === v ? C.gold : C.bgInset, border: `2px solid ${view === v ? C.gold : C.border}`, color: view === v ? C.bg : C.creamDim, padding: "6px 12px", cursor: "pointer", fontFamily: "'Press Start 2P',monospace", fontSize: 6, boxShadow: view === v ? `0 0 10px ${C.gold}66` : "none" }}>{label}</button>
            ))}
          </div>
        </div>
        <RPGBox color={C.border} style={{ padding: "10px 16px", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <PX size={6} color={C.teal}>EXP {player.current_exp}</PX>
            <PX size={6} color={player.current_health <= 25 ? C.red : C.green}>HP {player.current_health}/100</PX>
            <PX size={6} color={C.gold}>T{player.tier + 1}</PX>
            <PX size={5} color={C.border} style={{ marginLeft: "auto" }}>{takes.length} takes</PX>
          </div>
        </RPGBox>
        {view === "admin"
          ? <AdminPanel player={player} takes={takes} onTakeLogged={fetchAll} onDelete={handleDelete} />
          : <CharacterSheet player={player} takes={takes} onDismissLevelUp={fetchAll} onRefresh={fetchAll} />}
      </div>
    </>
  );
}
