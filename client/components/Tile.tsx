"use client";
import { memo } from "react";
import { TileData } from "@/hooks/useSocket";

interface Props {
  index:     number;
  data:      TileData | undefined;
  isPopping: boolean;
  myName:    string;
  cooldown:  number;
  onClick:   (index: number) => void;
}

const Tile = memo(function Tile({ index, data, isPopping, myName, cooldown, onClick }: Props) {
  const owned   = !!data;
  const isMine  = data?.ownerName === myName;
  const blocked = cooldown > 0;

  return (
    <div
      onClick={() => !blocked && onClick(index)}
      className={isPopping ? "tile-pop" : ""}
      title={owned ? `${data!.ownerName}${isMine ? " (you)" : ""}` : "unclaimed"}
      style={{
        aspectRatio:  "1",
        borderRadius: 2,
        background:   owned ? data!.ownerColor : "rgba(26,18,8,0.06)",
        border:       isMine
          ? "1.5px solid rgba(26,18,8,0.35)"
          : owned
          ? "none"
          : "1px solid rgba(26,18,8,0.08)",
        cursor:     blocked ? "not-allowed" : isMine ? "default" : "pointer",
        transition: "transform 0.1s ease, filter 0.1s ease, box-shadow 0.1s ease",
        position:   "relative",
        boxSizing:  "border-box",
      }}
      onMouseEnter={(e) => {
        if (blocked || isPopping) return;
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform  = "scale(1.4)";
        el.style.zIndex     = "30";
        el.style.filter     = "brightness(1.15)";
        el.style.boxShadow  = owned
          ? `0 2px 8px ${data!.ownerColor}55`
          : "0 2px 6px rgba(26,18,8,0.15)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform  = "scale(1)";
        el.style.zIndex     = "auto";
        el.style.filter     = "brightness(1)";
        el.style.boxShadow  = "none";
      }}
    />
  );
});

export default Tile;