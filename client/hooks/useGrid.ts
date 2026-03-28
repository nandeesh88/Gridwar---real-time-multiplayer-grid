"use client";
import { useState, useCallback } from "react";

export const useGrid = () => {
  const [poppingTiles, setPoppingTiles] = useState<Set<number>>(new Set());

  const triggerPop = useCallback((index: number) => {
    setPoppingTiles((prev) => new Set(prev).add(index));
    setTimeout(() => {
      setPoppingTiles((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }, 350);
  }, []);

  return { poppingTiles, triggerPop };
};