"use client";
import { LeaderboardEntry } from "@/hooks/useSocket";

interface Props {
  entries: LeaderboardEntry[];
  myName:  string;
}

const RANK_COLORS = ["#c0392b", "#d4762a", "#7b8c2a"];

export default function Leaderboard({ entries, myName }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      {entries.length === 0 && (
        <span style={{
          fontSize: 11, color: "rgba(26,18,8,0.3)",
          fontFamily: "'DM Mono', monospace",
        }}>
          no players yet
        </span>
      )}
      {entries.map((e, i) => {
        const isMe   = e.name === myName;
        const rankColor = RANK_COLORS[i] || "rgba(26,18,8,0.2)";

        return (
          <div
            key={e.name}
            className="slide-in"
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: isMe ? "rgba(192,57,43,0.06)" : "rgba(26,18,8,0.03)",
              border: `1px solid ${isMe ? "rgba(192,57,43,0.18)" : "rgba(26,18,8,0.07)"}`,
              borderRadius: 8,
              padding: "7px 10px",
              transition: "all 0.2s ease",
            }}
          >
            {/* Rank */}
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, fontWeight: 500,
              color: rankColor,
              minWidth: 14, textAlign: "center",
            }}>
              {i + 1}
            </span>

            {/* Color swatch */}
            <div style={{
              width: 8, height: 8,
              borderRadius: 2,
              background: e.color,
              flexShrink: 0,
            }} />

            {/* Name */}
            <span style={{
              fontSize: 11, fontWeight: 600, flex: 1,
              overflow: "hidden", textOverflow: "ellipsis",
              whiteSpace: "nowrap", color: "#1a1208",
            }}>
              {e.name}
              {isMe && (
                <span style={{ color: "#c0392b", fontWeight: 400 }}> ·you</span>
              )}
            </span>

            {/* Tile count */}
            <span
              className={i === 0 ? "count-bump" : ""}
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12, fontWeight: 500,
                color: isMe ? "#c0392b" : "rgba(26,18,8,0.5)",
              }}
            >
              {e.tileCount}
            </span>
          </div>
        );
      })}
    </div>
  );
}