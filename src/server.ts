import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
dotenv.config();
import dbConnect from "../config/db.config";
import authRouter from "./routes/authRouter";
import cloudinaryConnect from "../config/cloudinary.config";
import myHotelRouter from "./routes/myHotelRouter";
import hotelRouter from "./routes/hotelRouter";

cloudinaryConnect();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors());

app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

dbConnect();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/my-hotels", myHotelRouter);
app.use("/api/v1/hotels", hotelRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is running on PORT 7000");
});

export default app;
