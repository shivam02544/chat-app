import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017", {
      dbName: "chat-app",
      bufferCommands: false,
    });
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
};
