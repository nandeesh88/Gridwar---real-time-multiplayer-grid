import { Server, Socket } from "socket.io";
import { claimTile, getAllTiles } from "../services/tileService";
import { isOnCooldown, setCooldown, getCooldownTTL } from "../services/cooldownService";
import { upsertUser, incrementUserTiles, getLeaderboard } from "../services/leaderboardService";
import { Tile } from "../models/Tile";

export const registerHandlers = (io: Server, socket: Socket) => {
  // Send full grid state on connect
  socket.on("grid:init", async () => {
    const tiles = await getAllTiles();
    const leaderboard = await getLeaderboard();
    socket.emit("grid:state", { tiles, leaderboard });
  });

  // User joins with name + color
  socket.on("user:join", async ({ name, color }: { name: string; color: string }) => {
    await upsertUser(name, color);
    const ttl = await getCooldownTTL(name);
    socket.emit("user:cooldown", { remaining: ttl });

    const onlineCount = (await io.fetchSockets()).length;
    io.emit("server:online", { count: onlineCount });
  });

  // User claims a tile
  socket.on("tile:claim", async ({ index, userName, userColor }: {
    index: number;
    userName: string;
    userColor: string;
  }) => {
    // Cooldown check
    const onCooldown = await isOnCooldown(userName);
    if (onCooldown) {
      const ttl = await getCooldownTTL(userName);
      socket.emit("tile:rejected", { index, reason: "cooldown", remaining: ttl });
      return;
    }

    // Get previous owner before overwriting
    const existing = await Tile.findOne({ index }).lean();
    const prevOwner = existing?.ownerName;

    // Atomic write
    const tile = await claimTile(index, userName, userColor);

    // Update leaderboard counts
    await incrementUserTiles(userName, prevOwner);

    // Set cooldown
    await setCooldown(userName);

    // Broadcast to ALL clients
    const leaderboard = await getLeaderboard();
    io.emit("tile:updated", {
      index,
      ownerName: userName,
      ownerColor: userColor,
      claimedAt: tile.claimedAt,
    });
    io.emit("leaderboard:updated", { leaderboard });

    // Tell the clicker their cooldown started
    socket.emit("user:cooldown", { remaining: 5 });
  });

  // Disconnect
  socket.on("disconnect", async () => {
    const onlineCount = (await io.fetchSockets()).length;
    io.emit("server:online", { count: onlineCount });
  });
};