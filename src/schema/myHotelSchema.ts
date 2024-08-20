import { z } from "zod";

const myHotelSchema = z.object({
  name: z
    .string()
    .min(10, { message: "Minimum length of characters should be 10" })
    .max(60, { message: "Maximum length of characters should be 60" }),
  city: z.string(),
  country: z.string(),
  description: z.string().optional(),
  type: z.string().optional(),
  adultCount: z.string(),
  childCount: z.string().optional(),
  facilities: z.array(z.string()),
  pricePerNight: z.string(),
  starRating: z.string(),
  lastUpdated: z.date().optional(),
});

const updateMyHotelSchema = z.object({
  name: z
    .string()
    .min(10, { message: "Minimum length of characters should be 10" })
    .max(60, { message: "Maximum length of characters should be 60" })
    .optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  adultCount: z.string().optional(),
  childCount: z.string().optional(),
  facilities: z.array(z.string()).optional(),
  pricePerNight: z.string().optional(),
  starRating: z.string().optional(),
  lastUpdated: z.date().optional(),
  deleteCloudinaryImageIds: z.array(z.string()).optional(),
});

const today = new Date();
today.setHours(0, 0, 0, 0);

const bookingSchema = z.object({
  name: z
    .string(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  adultCount: z.number(),
  childCount: z.number(),
  // checkIn: z.string().refine((date) => date >= today, {
  //   message: "Check-in date cannot be in the past",
  // }),
  // checkOut: z.date().refine((date) => date >= today, {
  //   message: "Check-out date cannot be in the past",
  // }),
  checkIn: z.string(),
  checkOut: z.string(),
  totalCost: z.number(),
  paymentIntentId: z.string(),
  last_updated: z.date().optional(),
});
// .refine((data) => data.checkOut > data.checkIn, {
//   message: "Check-out date must be later than check-in date",
//   path: ["checkOut"],
// });

export { myHotelSchema, updateMyHotelSchema, bookingSchema };
