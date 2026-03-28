"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { SERVER_URL } from "@/lib/constants";

export interface TileData {
  index:      number;
  ownerName:  string;
  ownerColor: string;
  claimedAt:  string;
}

export interface LeaderboardEntry {
  name:      string;
  color:     string;
  tileCount: number;
}

export interface ActivityItem {
  id:        number;
  name:      string;
  color:     string;
  index:     number;
  timestamp: number;
}

interface UseSocketReturn {
  tiles:        Record<number, TileData>;
  leaderboard:  LeaderboardEntry[];
  activity:     ActivityItem[];
  onlineCount:  number;
  cooldown:     number;
  connected:    boolean;
  claimTile:    (index: number) => void;
}

let activityId = 0;

export const useSocket = (
  userName: string,
  userColor: string
): UseSocketReturn => {
  const socketRef                             = useRef<Socket | null>(null);
  const [tiles, setTiles]                     = useState<Record<number, TileData>>({});
  const [leaderboard, setLeaderboard]         = useState<LeaderboardEntry[]>([]);
  const [activity, setActivity]               = useState<ActivityItem[]>([]);
  const [onlineCount, setOnlineCount]         = useState(0);
  const [cooldown, setCooldown]               = useState(0);
  const [connected, setConnected]             = useState(false);
  const cooldownRef                           = useRef<NodeJS.Timeout | null>(null);

  const startCooldown = useCallback((seconds: number) => {
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    setCooldown(seconds);
    cooldownRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const addActivity = useCallback((item: Omit<ActivityItem, "id" | "timestamp">) => {
    setActivity((prev) => [
      { ...item, id: activityId++, timestamp: Date.now() },
      ...prev.slice(0, 7),
    ]);
  }, []);

  useEffect(() => {
    if (!userName) return;

    const socket = io(SERVER_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("grid:init");
      socket.emit("user:join", { name: userName, color: userColor });
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("grid:state", ({ tiles: rawTiles, leaderboard: lb }: {
      tiles: TileData[];
      leaderboard: LeaderboardEntry[];
    }) => {
      const map: Record<number, TileData> = {};
      rawTiles.forEach((t) => { map[t.index] = t; });
      setTiles(map);
      setLeaderboard(lb);
    });

    socket.on("tile:updated", (tile: TileData) => {
      setTiles((prev) => ({ ...prev, [tile.index]: tile }));
      addActivity({ name: tile.ownerName, color: tile.ownerColor, index: tile.index });
    });

    socket.on("leaderboard:updated", ({ leaderboard: lb }: { leaderboard: LeaderboardEntry[] }) => {
      setLeaderboard(lb);
    });

    socket.on("server:online", ({ count }: { count: number }) => {
      setOnlineCount(count);
    });

    socket.on("user:cooldown", ({ remaining }: { remaining: number }) => {
      if (remaining > 0) startCooldown(remaining);
    });

    socket.on("tile:rejected", ({ remaining }: { remaining: number }) => {
      startCooldown(remaining);
    });

    return () => {
      socket.disconnect();
      if (cooldownRef.current) clearInterval(cooldownRef.current);
    };
  }, [userName, userColor, startCooldown, addActivity]);

  const claimTile = useCallback((index: number) => {
    if (!socketRef.current || cooldown > 0) return;
    socketRef.current.emit("tile:claim", {
      index,
      userName,
      userColor,
    });
  }, [cooldown, userName, userColor]);

  return { tiles, leaderboard, activity, onlineCount, cooldown, connected, claimTile };
};