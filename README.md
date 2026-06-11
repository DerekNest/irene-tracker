# irene.exe — based take tracker

pixel RPG take tracker. irene levels up through relationship tiers via based takes.

## setup

```bash
# install python deps (one time)
pip install fastapi uvicorn

# install frontend deps (one time)
cd frontend && npm install && cd ..

# run everything
chmod +x start.sh && ./start.sh
```

then open http://localhost:5173

## tabs

- **HER** — irene's character sheet (read-only view, send her this when deployed)
- **YOU** — admin panel, log takes, see history

## exp guide

| value | meaning |
|-------|---------|
| +20   | she absolutely cooked |
| +15   | big based take |
| +10   | solid take |
| +5    | decent |
| +1–4  | minor |
| -5    | mild L |
| -10   | big L take |
| -15–20 | game-ender energy |

## tiers

1. **Talking Stage** — Stranger (0 exp)
2. **Situationship** — Unlocked (100 exp)
3. **When Am I Seeing You** — Based Individual (250 exp)
4. **Please Literally Now** — Certified Hiker (450 exp)
5. **So When Am I Picking You Up** — Trail Boss (700 exp) → credits roll

## health

- starts at 100 per tier
- L takes deal damage equal to exp loss
- 0 HP = game over screen
- level up = full health reset

## deploying for her

when ready to share:
1. deploy backend to Railway / Render (free tier)
2. update `API` const in `src/App.jsx` to your deployed URL
3. deploy frontend to Vercel / Netlify
4. send her the link

## future

- [ ] postgres swap (replace sqlite3 with asyncpg, change DB_PATH to env var)
- [ ] auth for admin panel (simple password gate)
- [ ] more sprite tiers / outfits
- [ ] sound effects on level up
