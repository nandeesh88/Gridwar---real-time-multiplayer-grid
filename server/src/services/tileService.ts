import { Tile } from "../models/Tile";

export const getAllTiles = async () => {
  return Tile.find({}).lean();
};

export const claimTile = async (
  index: number,
  ownerName: string,
  ownerColor: string
) => {
  return Tile.findOneAndUpdate(
    { index },
    { ownerName, ownerColor, claimedAt: new Date() },
    { upsert: true, new: true }
  );
};