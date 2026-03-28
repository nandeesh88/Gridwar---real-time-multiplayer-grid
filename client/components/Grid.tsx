"use client";
import { useCallback } from "react";
import { TileData } from "@/hooks/useSocket";
import { useGrid } from "@/hooks/useGrid";
import Tile from "./Tile";
import { GRID_COLS, GRID_ROWS, TOTAL_TILES } from "@/lib/constants";

interface Props {
  tiles:    Record<number, TileData>;
  myName:   string;
  cooldown: number;
  onClaim:  (index: number) => void;
}

export default function Grid({ tiles, myName, cooldown, onClaim }: Props) {
  const { poppingTiles, triggerPop } = useGrid();

  const handleClick = useCallback((index: number) => {
    onClaim(index);
    triggerPop(index);
  }, [onClaim, triggerPop]);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
      gap: 2,
      width: "100%",
      height: "100%",
    }}>
      {Array.from({ length: TOTAL_TILES }, (_, i) => (
        <Tile
          key={i}
          index={i}
          data={tiles[i]}
          isPopping={poppingTiles.has(i)}
          myName={myName}
          cooldown={cooldown}
          onClick={handleClick}
        />
      ))}
    </div>
  );
}