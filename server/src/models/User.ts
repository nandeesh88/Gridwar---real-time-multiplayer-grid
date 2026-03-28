import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  color: string;
  tileCount: number;
  lastSeen: Date;
}

const UserSchema = new Schema<IUser>({
  name:      { type: String, required: true, unique: true },
  color:     { type: String, required: true },
  tileCount: { type: Number, default: 0 },
  lastSeen:  { type: Date, default: Date.now },
});

export const User = model<IUser>("User", UserSchema);