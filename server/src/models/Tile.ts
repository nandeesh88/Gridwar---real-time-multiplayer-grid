import { Schema, model, Document } from "mongoose";

export interface ITile extends Document {
  index: number;
  ownerName: string;
  ownerColor: string;
  claimedAt: Date;
}

const TileSchema = new Schema<ITile>({
  index:      { type: Number, required: true, unique: true },
  ownerName:  { type: String, required: true },
  ownerColor: { type: String, required: true },
  claimedAt:  { type: Date, default: Date.now },
});

export const Tile = model<ITile>("Tile", TileSchema);