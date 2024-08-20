import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import dbConnect from "../config/db.config";
import authRouter from "./routes/authRouter";
import path from "path";
import cloudinaryConnect from "../config/cloudinary.config";
import myHotelRouter from "./routes/myHotelRouter";
import hotelRouter from "./routes/hotelRouter";

cloudinaryConnect();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

dbConnect();

app.use(express.static(path.join(__dirname, "../../../frontend/dist")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/my-hotels", myHotelRouter);
app.use("/api/v1/hotels", hotelRouter);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../../frontend/dist/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on PORT 7000");
});

export default app;
