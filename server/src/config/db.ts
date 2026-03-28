import mongoose from "mongoose";

export const connectMongo = async () => {
  const uri = process.env.MONGODB_URI!;
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};