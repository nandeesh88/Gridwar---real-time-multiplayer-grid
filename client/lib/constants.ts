export const GRID_COLS    = 40;
export const GRID_ROWS    = 40;
export const TOTAL_TILES  = GRID_COLS * GRID_ROWS;
export const COOLDOWN_SEC = 5;

if (!process.env.NEXT_PUBLIC_SERVER_URL) {
	throw new Error("NEXT_PUBLIC_SERVER_URL is required");
}

export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
