export const USER_COLORS = [
  "#c0392b", // maroon red
  "#2a7b6e", // teal green
  "#6b4c9a", // purple
  "#d4762a", // burnt orange
  "#3a7abf", // steel blue
  "#7b8c2a", // olive green
  "#c4534a", // coral red
  "#2a6b8a", // ocean blue
  "#8a3a6a", // wine pink
  "#4a7a3a", // forest green
  "#b5860d", // golden amber
  "#7a5a2a", // warm brown
  "#1a7a6e", // dark teal
  "#a0522d", // sienna
  "#556b2f", // dark olive
  "#4682b4", // cornflower blue
];

export const getColorForUser = (name: string): string => {
  // Better hash — spreads users across palette more evenly
  let hash = 5381;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) + hash) ^ name.charCodeAt(i);
    hash = hash & hash; // convert to 32-bit int
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
};

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};