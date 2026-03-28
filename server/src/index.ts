import "dotenv/config";
import express from "express";
import { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { connectMongo } from "./config/db";
import { registerHandlers } from "./socket/handlers";

const app = express();
const httpServer = createServer(app);

const isAllowedOrigin = (origin?: string) => {
  if (!origin) return true;

  const allowedExactOrigins = [
    process.env.CLIENT_URL,
    "http://localhost:3000",
  ].filter(Boolean) as string[];

  if (allowedExactOrigins.includes(origin)) return true;

  try {
    const parsed = new URL(origin);
    return parsed.hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
};

// ✅ Socket.IO with production-ready CORS (Vercel + localhost)
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      const ok = isAllowedOrigin(origin);

      callback(ok ? null : new Error("CORS blocked"), ok);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Express CORS
app.use(
  cors({
    origin: (origin, callback) => {
      const ok = isAllowedOrigin(origin);

      callback(ok ? null : new Error("CORS blocked"), ok);
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Health route
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", ts: Date.now() });
});

// 🔥 Keep-alive (Render free tier fix)
if (process.env.NODE_ENV === "production") {
  const SELF_URL = process.env.RENDER_EXTERNAL_URL || "";

  if (SELF_URL) {
    setInterval(async () => {
      try {
        await fetch(`${SELF_URL}/api/health`);
        console.log("keep-alive ping sent");
      } catch (e) {
        console.log("keep-alive failed:", e);
      }
    }, 10 * 60 * 1000);
  }
}

// ✅ Socket connection
io.on("connection", (socket) => {
  console.log(`[+] ${socket.id} connected`);
  registerHandlers(io, socket);
});

const PORT = process.env.PORT || 4000;

// ✅ Start server after DB connect
connectMongo().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});