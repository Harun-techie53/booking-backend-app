import express from "express";
import * as myHotelController from "../controllers/myHotelController";
import multer from "multer";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { myHotelSchema, updateMyHotelSchema } from "../schema/myHotelSchema";

const myHotelRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

myHotelRouter.get("/", verifyToken, myHotelController.getMyHotels);
myHotelRouter.get(
  "/my-bookings",
  verifyToken,
  myHotelController.getMyHotelBookings
);

myHotelRouter.get("/:hotelId", myHotelController.getHotelById);

myHotelRouter.post(
  "/",
  verifyToken,
  upload.array("imageFiles", 6),
  validate(myHotelSchema),
  myHotelController.createHotel
);

myHotelRouter.put(
  "/:hotelId",
  verifyToken,
  upload.array("imageFiles", 6),
  validate(updateMyHotelSchema),
  myHotelController.updateHotel
);

myHotelRouter.delete("/:hotelId", verifyToken, myHotelController.deleteHotel);

export default myHotelRouter;
