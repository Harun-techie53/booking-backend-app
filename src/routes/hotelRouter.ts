import express from "express";
import * as hotelController from "../controllers/hotelController";
import { verifyToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import { z } from "zod";
import { bookingSchema } from "../schema/myHotelSchema";

const hotelRouter = express.Router();

hotelRouter.get("/", hotelController.getHotels);
hotelRouter.get("/:hotelId", hotelController.getHotel);

hotelRouter.post(
  "/:hotelId/bookings/payment-intent",
  verifyToken,
  validate(z.object({ numberOfNights: z.number() })),
  hotelController.createStripePaymentIntent
);

hotelRouter.post(
  "/:hotelId/bookings/payment-confirm",
  verifyToken,
  validate(bookingSchema),
  hotelController.createPaymentConfirmationBooking
);

export default hotelRouter;
