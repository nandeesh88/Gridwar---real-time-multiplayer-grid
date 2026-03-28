"use client";
import { ActivityItem } from "@/hooks/useSocket";

interface Props { items: ActivityItem[]; }

const timeAgo = (ts: number): string => {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 5)  return "now";
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
};

export default function ActivityFeed({ items }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.length === 0 && (
        <span style={{
          fontSize: 11, color: "rgba(26,18,8,0.3)",
          fontFamily: "'DM Mono', monospace",
        }}>
          waiting...
        </span>
      )}
      {items.map((item, i) => (
        <div
          key={item.id}
          className="slide-in"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(26,18,8,0.03)",
            border: "1px solid rgba(26,18,8,0.06)",
            borderRadius: 6,
            padding: "5px 8px",
            opacity: 1 - i * 0.1,
          }}
        >
          <div style={{
            width: 6, height: 6, borderRadius: 1,
            background: item.color, flexShrink: 0,
          }} />
          <span style={{
            fontSize: 10, fontFamily: "'DM Mono', monospace",
            color: "rgba(26,18,8,0.55)", flex: 1,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {item.name}
            <span style={{ color: "rgba(26,18,8,0.3)" }}> #{item.index}</span>
          </span>
          <span style={{
            fontSize: 9, fontFamily: "'DM Mono', monospace",
            color: "rgba(26,18,8,0.25)", flexShrink: 0,
          }}>
            {timeAgo(item.timestamp)}
          </span>
        </div>
      ))}
    </div>
  );
}