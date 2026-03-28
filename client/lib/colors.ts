export const USER_COLORS = [
  "#c0392b", "#d4762a", "#7b8c2a", "#2a7b6e",
  "#6b4c9a", "#3a7abf", "#b5860d", "#4a7a3a",
  "#8a3a6a", "#2a6b8a", "#7a5a2a", "#c4534a",
  "#a0522d", "#556b2f", "#4682b4", "#cd853f",
];

export const getColorForUser = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
};

export const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};