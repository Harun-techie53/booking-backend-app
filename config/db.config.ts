import mongoose from "mongoose";

const dbConnect = () =>
  mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Connection error", err);
    });

export default dbConnect;
