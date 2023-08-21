import mongoose from "mongoose";
let isConnected = false; // track the connection

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) return;

  try {
    await mongoose.connect(String(process.env.MONGO_URL), {
      dbName: process.env.MONGO_DB,
    });

    isConnected = true;

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
