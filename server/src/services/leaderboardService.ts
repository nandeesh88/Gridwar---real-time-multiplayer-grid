import { User } from "../models/User";

export const upsertUser = async (name: string, color: string) => {
  return User.findOneAndUpdate(
    { name },
    { color, lastSeen: new Date() },
    { upsert: true, new: true }
  );
};

export const incrementUserTiles = async (
  newOwner: string,
  prevOwner?: string
) => {
  if (prevOwner && prevOwner !== newOwner) {
    await User.updateOne(
      { name: prevOwner },
      { $inc: { tileCount: -1 } }
    );
  }
  await User.updateOne(
    { name: newOwner },
    { $inc: { tileCount: 1 } }
  );
};

export const getLeaderboard = async () => {
  return User.find({})
    .sort({ tileCount: -1 })
    .limit(10)
    .lean();
};