"use client";
import { COOLDOWN_SEC } from "@/lib/constants";

interface Props { cooldown: number; }

export default function CooldownBar({ cooldown }: Props) {
  const pct = ((COOLDOWN_SEC - cooldown) / COOLDOWN_SEC) * 100;
  const ready = cooldown === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 11, color: "rgba(26,18,8,0.4)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          cooldown
        </span>
        <span style={{
          fontSize: 13, fontWeight: 500,
          fontFamily: "'DM Mono', monospace",
          color: ready ? "#2e7d4f" : "#c0392b",
        }}>
          {ready ? "ready" : `${cooldown}s`}
        </span>
      </div>
      <div style={{ height: 3, background: "rgba(26,18,8,0.1)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          width: ready ? "0%" : `${pct}%`,
          background: "#c0392b",
          borderRadius: 2,
          transition: "width 0.1s linear",
        }} />
      </div>
    </div>
  );
}