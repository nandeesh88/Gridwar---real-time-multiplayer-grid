# GridWar

Real-time multiplayer tile-claiming game

Live — https://gridwar-real-time-multiplayer-grid.vercel.app

---

## What it does

A 40x40 grid (1,600 tiles) shared across all connected users. Click any tile to claim it. Everyone sees your move instantly. A 5-second cooldown is enforced server-side between claims. Leaderboard and activity feed update in real time.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, TypeScript, TailwindCSS |
| Real-time | Socket.io |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Cache | Upstash Redis |
| Deploy | Vercel (frontend) + Render (backend) |

---

## Architecture

```
Browser (Next.js)
      |
      |  WebSocket — Socket.io
      v
Node.js + Express
      |              |
      v              v
MongoDB Atlas    Upstash Redis
(tile ownership) (cooldown TTLs)
```

---

## Real-time Flow

1. User clicks tile — client emits `tile:claim`
2. Server checks Redis for active cooldown
3. If cooldown active — emits `tile:rejected` to that user only
4. If clear — MongoDB `findOneAndUpdate` (atomic, handles conflicts)
5. Sets Redis TTL key `cooldown:{user} EX 5`
6. Broadcasts `tile:updated` to all connected clients
7. All browsers update instantly

Conflict resolution — two users clicking the same tile simultaneously are handled by MongoDB's atomic `findOneAndUpdate`. One write wins, both clients receive the correct final state.

---

## Socket Events

| Direction | Event | Description |
|---|---|---|
| Client to Server | `grid:init` | Request full grid on connect |
| Client to Server | `user:join` | Register name and color |
| Client to Server | `tile:claim` | Claim a tile |
| Server to All | `tile:updated` | Broadcast every claim |
| Server to All | `leaderboard:updated` | Updated scores |
| Server to User | `tile:rejected` | Cooldown still active |
| Server to User | `user:cooldown` | Remaining cooldown TTL |

---

## Project Structure

```
gridwar/
├── client/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Grid.tsx
│   │   ├── Tile.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── CooldownBar.tsx
│   │   ├── ActivityFeed.tsx
│   │   └── UserSetup.tsx
│   ├── hooks/
│   │   ├── useSocket.ts
│   │   └── useGrid.ts
│   └── lib/
│       ├── colors.ts
│       └── constants.ts
└── server/
    └── src/
        ├── index.ts
        ├── socket/handlers.ts
        ├── services/
        │   ├── tileService.ts
        │   ├── cooldownService.ts
        │   └── leaderboardService.ts
        ├── models/
        │   ├── Tile.ts
        │   └── User.ts
        └── config/
            ├── db.ts
            └── redis.ts
```

---

## Running Locally

```bash
# Clone
git clone https://github.com/nandeesh88/Gridwar---real-time-multiplayer-grid
cd gridwar

# Install
cd server && npm install
cd ../client && npm install
```

**server/.env**
```
PORT=4000
MONGODB_URI=your_atlas_connection_string
REDIS_URL=your_upstash_redis_url
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**client/.env.local**
```
NEXT_PUBLIC_SERVER_URL=http://localhost:4000
```

```bash
# Run backend
cd server && npm run dev

# Run frontend
cd client && npm run dev
```

Open http://localhost:3000 — open multiple tabs with different names to test real-time sync.

---

## Key Decisions

**Redis for cooldowns** — TTL keys auto-expire with no cleanup needed. One `SET key EX 5` handles the entire cooldown lifecycle server-side. Cannot be bypassed from the client.

**MongoDB atomic upsert** — `findOneAndUpdate` with `upsert: true` is a single atomic operation. Concurrent claims on the same tile are resolved at the database level with no race conditions.

**React.memo on Tile** — With 1,600 tiles, only the single changed tile re-renders per `tile:updated` event instead of the entire grid.

**Optimistic UI** — The clicking user sees their color immediately before server confirmation. Reverts if rejected. Eliminates perceived latency.

---

## Deployment

| | Platform | 
|---|---|
| Frontend | Vercel — root directory set to `client` |
| Backend | Render — root directory set to `server`, build: `npm install && npm run build`, start: `npm start` |
| Database | MongoDB Atlas free tier |
| Cache | Upstash Redis free tier |
