"use client";
import { useState, useMemo } from "react";
import { useSocket } from "@/hooks/useSocket";
import Grid from "@/components/Grid";
import Leaderboard from "@/components/Leaderboard";
import CooldownBar from "@/components/CooldownBar";
import ActivityFeed from "@/components/ActivityFeed";
import UserSetup from "@/components/UserSetup";
import { TOTAL_TILES } from "@/lib/constants";

export default function Home() {
  const [userName, setUserName]   = useState("");
  const [userColor, setUserColor] = useState("");
  const [joined, setJoined]       = useState(false);

  const { tiles, leaderboard, activity, onlineCount, cooldown, connected, claimTile } =
    useSocket(joined ? userName : "", userColor);

  const claimedCount = useMemo(() => Object.keys(tiles).length, [tiles]);
  const freeCount    = TOTAL_TILES - claimedCount;
  const myEntry      = leaderboard.find((e) => e.name === userName);

  const handleJoin = (name: string, color: string) => {
    setUserName(name);
    setUserColor(color);
    setJoined(true);
  };

  if (!joined) return <UserSetup onJoin={handleJoin} />;

  // 🔴 Connection lost banner
  const ConnectionBanner = !connected && joined ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "#c0392b",
        color: "#fff",
        textAlign: "center",
        padding: "8px",
        fontSize: 12,
        zIndex: 200,
      }}
    >
      connection lost — reconnecting...
    </div>
  ) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#f5f0e8", overflow: "hidden" }}>

      {/* ✅ Banner added here */}
      {ConnectionBanner}

      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid rgba(26,18,8,0.1)",
        background: "#ede8de",
        flexShrink: 0,
      }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>
          grid<span style={{ color: "#c0392b" }}>war</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* Online indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Mono',monospace", fontSize: 11, color: "rgba(26,18,8,0.45)" }}>
            <div className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: connected ? "#2e7d4f" : "#c0392b" }} />
            {onlineCount} online
          </div>

          {/* Grid size badge */}
          <div style={{
            fontFamily: "'DM Mono',monospace", fontSize: 10,
            background: "rgba(192,57,43,0.1)", color: "#c0392b",
            border: "1px solid rgba(192,57,43,0.2)",
            borderRadius: 4, padding: "2px 8px",
          }}>
            40 × 40
          </div>

          {/* My identity */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: userColor }} />
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "rgba(26,18,8,0.6)" }}>
              {userName}
            </span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* Grid */}
        <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", gap: 10, overflow: "hidden" }}>
          <div style={{ flex: 1, overflow: "hidden" }}>
            <Grid tiles={tiles} myName={userName} cooldown={cooldown} onClaim={claimTile} />
          </div>

          {/* Grid footer stats */}
          <div style={{ display: "flex", gap: 20, flexShrink: 0 }}>
            {[
              { label: "claimed", value: claimedCount },
              { label: "free",    value: freeCount },
              { label: "yours",   value: myEntry?.tileCount ?? 0 },
            ].map(({ label, value }) => (
              <div key={label} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "rgba(26,18,8,0.35)" }}>
                <b style={{ color: "rgba(26,18,8,0.65)", fontWeight: 500 }}>{value}</b> {label}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{
          width: 210, borderLeft: "1px solid rgba(26,18,8,0.1)",
          background: "#ede8de", padding: "16px 14px",
          display: "flex", flexDirection: "column", gap: 20,
          overflowY: "auto", flexShrink: 0,
        }}>

          <CooldownBar cooldown={cooldown} />

          <div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(26,18,8,0.3)", marginBottom: 8 }}>
              leaderboard
            </div>
            <Leaderboard entries={leaderboard} myName={userName} />
          </div>

          <div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(26,18,8,0.3)", marginBottom: 8 }}>
              activity
            </div>
            <ActivityFeed items={activity} />
          </div>
        </div>
      </div>
    </div>
  );
}