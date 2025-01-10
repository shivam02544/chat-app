import mongoose from "mongoose";
export const connectDb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://hari:eRySIcQf8gRDj3fz@cluster0.gu9pqdk.mongodb.net/",
      {
        dbName: "chat-app",
        bufferCommands: false,
      }
    );
    console.log("DB connected");
  } catch (error) {
    console.log(error);
  }
};
