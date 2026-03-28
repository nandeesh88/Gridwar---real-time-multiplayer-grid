import { redis } from "../config/redis";

const COOLDOWN_SECONDS = 5;

export const isOnCooldown = async (userName: string): Promise<boolean> => {
  const key = `cooldown:${userName}`;
  const val = await redis.get(key);
  return val !== null;
};

export const setCooldown = async (userName: string): Promise<void> => {
  const key = `cooldown:${userName}`;
  await redis.set(key, "1", "EX", COOLDOWN_SECONDS);
};

export const getCooldownTTL = async (userName: string): Promise<number> => {
  const key = `cooldown:${userName}`;
  const ttl = await redis.ttl(key);
  return ttl > 0 ? ttl : 0;
};