"use client";
import { useState } from "react";
import { getColorForUser, USER_COLORS } from "@/lib/colors";

interface Props {
  onJoin: (name: string, color: string) => void;
}

export default function UserSetup({ onJoin }: Props) {
  const [name, setName]   = useState("");
  const [error, setError] = useState("");

  const preview      = name.trim().toLowerCase().replace(/\s+/g, ".");
  const previewColor = preview.length >= 2 ? getColorForUser(preview) : null;

  const handleJoin = () => {
    const trimmed = name.trim().toLowerCase().replace(/\s+/g, ".");
    if (trimmed.length < 2)  { setError("at least 2 characters"); return; }
    if (trimmed.length > 16) { setError("max 16 characters");     return; }
    onJoin(trimmed, getColorForUser(trimmed));
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#f5f0e8",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100,
    }}
    className="fade-in"
    >
      <div style={{
        background: "#ede8de",
        border: "1px solid rgba(26,18,8,0.1)",
        borderRadius: 20,
        padding: "40px 36px",
        width: 360,
        display: "flex", flexDirection: "column", gap: 22,
        boxShadow: "0 8px 40px rgba(26,18,8,0.08)",
      }}>

        {/* Logo */}
        <div>
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 32, fontWeight: 800, letterSpacing: -1.5,
          }}>
            grid<span style={{ color: "#c0392b" }}>war</span>
          </div>
          <p style={{
            fontSize: 12, color: "rgba(26,18,8,0.45)",
            lineHeight: 1.6, marginTop: 6,
            fontFamily: "'DM Mono', monospace",
          }}>
            click tiles · own territory · real-time multiplayer
          </p>
        </div>

        {/* Color palette preview */}
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {USER_COLORS.map((c) => (
            <div key={c} style={{
              width: 14, height: 14, borderRadius: 3,
              background: c,
              outline: previewColor === c ? "2px solid rgba(26,18,8,0.5)" : "none",
              outlineOffset: 1,
              transition: "outline 0.15s",
            }} />
          ))}
        </div>

        {/* Live preview */}
        {previewColor && (
          <div className="slide-in" style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(26,18,8,0.04)",
            border: "1px solid rgba(26,18,8,0.08)",
            borderRadius: 8, padding: "8px 12px",
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: 5,
              background: previewColor, flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 13, color: "rgba(26,18,8,0.65)",
            }}>
              {preview}
            </span>
            <span style={{
              marginLeft: "auto",
              fontFamily: "'DM Mono', monospace",
              fontSize: 10, color: "rgba(26,18,8,0.3)",
            }}>
              your color
            </span>
          </div>
        )}

        {/* Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <input
            type="text"
            placeholder="enter your name"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleJoin()}
            maxLength={16}
            autoFocus
            style={{
              background: "#f5f0e8",
              border: `1px solid ${error ? "rgba(192,57,43,0.5)" : "rgba(26,18,8,0.15)"}`,
              borderRadius: 8,
              padding: "11px 14px",
              fontSize: 14,
              fontFamily: "'Syne', sans-serif",
              color: "#1a1208",
              outline: "none",
              width: "100%",
              transition: "border-color 0.15s",
            }}
          />
          {error && (
            <span style={{
              fontSize: 11, color: "#c0392b",
              fontFamily: "'DM Mono', monospace",
            }}>
              {error}
            </span>
          )}
        </div>

        {/* Join button */}
        <button
          onClick={handleJoin}
          style={{
            background: "#c0392b",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "12px 0",
            fontSize: 14,
            fontWeight: 700,
            fontFamily: "'Syne', sans-serif",
            cursor: "pointer",
            letterSpacing: 0.5,
            transition: "transform 0.1s, opacity 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(1px)";
          }}
        >
          Enter the grid →
        </button>
      </div>
    </div>
  );
}