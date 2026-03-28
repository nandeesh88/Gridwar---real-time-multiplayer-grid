import mongoose from "mongoose";

export const connectMongo = async () => {
  const uri = process.env.MONGODB_URI!;

  await mongoose.connect(uri, {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: false,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
  });

  console.log("MongoDB connected");
};