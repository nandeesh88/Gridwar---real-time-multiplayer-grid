# GridWar

A real-time multiplayer tile-claiming game. 1,600 tiles. Infinite competition.

🔴 **[Live Demo →](https://gridwar.vercel.app)**

---

## What it does

- A 40×40 grid (1,600 tiles) shared across all connected users
- Click any tile to claim it — your color fills it instantly
- Every connected user sees your claim in real time
- 5-second cooldown between claims (enforced server-side)
- Live leaderboard ranked by tiles owned
- Activity feed showing the last 8 claims

---

## Tech stack

| Layer | Tech | Why |
|---|---|---|
| Frontend | Next.js 14, TypeScript, TailwindCSS | App router, fast builds, type safety |
| Real-time | Socket.io | WebSocket with automatic fallback, room broadcasting |
| Backend | Node.js, Express | Lightweight, non-blocking, pairs perfectly with Socket.io |
| Database | MongoDB Atlas | Persistent tile ownership, flexible schema |
| Cache | Upstash Redis | TTL-based cooldown keys, zero-config expiry |
| Deployment | Vercel + Render | Frontend and backend deployed independently |

---

## Architecture
```
Browser (Next.js)
    │
    │  WebSocket (Socket.io)
    ▼
Node.js Server (Express + Socket.io)
    │              │
    ▼              ▼
MongoDB Atlas   Upstash Redis
(tile ownership) (cooldown TTLs)
```

### Real-time flow

1. User clicks a tile → client emits `tile:claim`
2. Server checks Redis for active cooldown
3. If cooldown active → emits `tile:rejected` back to that user only
4. If clear → writes to MongoDB atomically (`findOneAndUpdate` with upsert)
5. Sets Redis TTL key (`SET user:{name}:cooldown EX 5`)
6. Broadcasts `tile:updated` to **all** connected clients
7. All browsers update that tile's color instantly

### Conflict resolution

Two users clicking the same tile simultaneously:
- MongoDB's `findOneAndUpdate` is atomic — one write wins
- Both clients receive `tile:updated` with the final state
- The losing user's optimistic UI update is corrected automatically
- Last write wins — intentional for this game type

### Cooldown system

- Enforced **server-side** via Redis TTL keys — cannot be bypassed by the client
- Key: `cooldown:{userName}` with 5-second expiry
- Client receives remaining TTL on connect (handles page refresh mid-cooldown)
- UI shows live countdown bar synced to server state

---

## Running locally

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier)
- Upstash Redis account (free tier)

### 1. Clone and install
```bash
git clone https://github.com/yourname/gridwar
cd gridwar

# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure environment

**`server/.env`**
```env
PORT=4000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gridwar
REDIS_URL=rediss://default:pass@your-db.upstash.io:6379
CLIENT_URL=http://localhost:3000
```

**`client/.env.local`**
```env
NEXT_PUBLIC_SERVER_URL=http://localhost:4000
```

### 3. Run both servers

Terminal 1 — backend:
```bash
cd server
npm run dev
```

Terminal 2 — frontend:
```bash
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

### Backend → Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select the `gridwar/server` folder
3. Add environment variables:
   - `MONGODB_URI`
   - `REDIS_URL`
   - `CLIENT_URL` → your Vercel URL
   - `PORT` → Railway sets this automatically
4. Railway detects Node.js, runs `npm run build` then `npm start`
5. Copy the Railway URL (e.g. `https://gridwar-server.up.railway.app`)

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set **Root Directory** to `client`
3. Add environment variable:
   - `NEXT_PUBLIC_SERVER_URL` → your Railway URL from above
4. Deploy — Vercel auto-detects Next.js

---

## Project structure
```
gridwar/
├── client/                         # Next.js frontend
│   ├── app/
│   │   ├── page.tsx                # Main page — wires all components
│   │   ├── layout.tsx              # Root layout + metadata
│   │   └── globals.css             # Animations + global styles
│   ├── components/
│   │   ├── Grid.tsx                # 40×40 tile grid renderer
│   │   ├── Tile.tsx                # Single tile (memo optimized)
│   │   ├── Leaderboard.tsx         # Live ranked leaderboard
│   │   ├── CooldownBar.tsx         # 5s cooldown progress bar
│   │   ├── ActivityFeed.tsx        # Last 8 claims with time ago
│   │   └── UserSetup.tsx           # Name entry modal
│   ├── hooks/
│   │   ├── useSocket.ts            # All Socket.io logic + state
│   │   └── useGrid.ts              # Tile pop animation state
│   └── lib/
│       ├── colors.ts               # 16 earthy colors + hash assignment
│       └── constants.ts            # Grid dimensions, cooldown duration
│
└── server/                         # Node.js backend
    └── src/
        ├── index.ts                # Express + Socket.io server entry
        ├── socket/
        │   └── handlers.ts         # All socket event handlers
        ├── services/
        │   ├── tileService.ts      # MongoDB tile read/write
        │   ├── cooldownService.ts  # Redis TTL cooldown logic
        │   └── leaderboardService.ts # User tile count tracking
        ├── models/
        │   ├── Tile.ts             # Mongoose tile schema
        │   └── User.ts             # Mongoose user schema
        └── config/
            ├── db.ts               # MongoDB connection
            └── redis.ts            # Redis connection with TLS
```

---

## Design decisions

**Why Socket.io over raw WebSockets?**
Automatic reconnection, room broadcasting with `io.emit()`, and fallback to long-polling. For a multiplayer game where connection reliability matters, Socket.io's abstractions are worth the small overhead.

**Why Redis for cooldowns instead of MongoDB?**
TTL keys in Redis expire automatically — no cron jobs, no cleanup queries. A `SET key EX 5` is all the cooldown logic needs. MongoDB would require polling or TTL indexes with less precision.

**Why MongoDB over PostgreSQL?**
Tile state is a simple document — `{index, ownerName, ownerColor, claimedAt}`. No joins needed. MongoDB's `findOneAndUpdate` with `upsert: true` gives atomic claim logic in one query.

**Why optimistic UI updates?**
The clicking user sees their color immediately (before server confirms). If the server rejects (cooldown), the tile reverts. This makes the game feel instant even with network latency.

**Memo optimization on Tile component**
With 1,600 tiles, re-rendering all tiles on every update would be slow. `React.memo` on the `Tile` component means only the changed tile re-renders on each `tile:updated` event.

---

## What I'd add with more time

- Zoom and pan for the grid (react-zoom-pan-pinch)
- Territory mode — bonus points for owning connected regions
- User profiles with claim history
- Spectator mode — watch without claiming
- Grid snapshot saved every hour

---

## Author

Built for the InboxKit Full Stack Intern assignment.