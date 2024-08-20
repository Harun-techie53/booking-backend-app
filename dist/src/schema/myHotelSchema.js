"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingSchema = exports.updateMyHotelSchema = exports.myHotelSchema = void 0;
const zod_1 = require("zod");
const myHotelSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(10, { message: "Minimum length of characters should be 10" })
        .max(60, { message: "Maximum length of characters should be 60" }),
    city: zod_1.z.string(),
    country: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    adultCount: zod_1.z.string(),
    childCount: zod_1.z.string().optional(),
    facilities: zod_1.z.array(zod_1.z.string()),
    pricePerNight: zod_1.z.string(),
    starRating: zod_1.z.string(),
    lastUpdated: zod_1.z.date().optional(),
});
exports.myHotelSchema = myHotelSchema;
const updateMyHotelSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(10, { message: "Minimum length of characters should be 10" })
        .max(60, { message: "Maximum length of characters should be 60" })
        .optional(),
    city: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    description: zod_1.z.string().optional(),
    type: zod_1.z.string().optional(),
    adultCount: zod_1.z.string().optional(),
    childCount: zod_1.z.string().optional(),
    facilities: zod_1.z.array(zod_1.z.string()).optional(),
    pricePerNight: zod_1.z.string().optional(),
    starRating: zod_1.z.string().optional(),
    lastUpdated: zod_1.z.date().optional(),
    deleteCloudinaryImageIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateMyHotelSchema = updateMyHotelSchema;
const today = new Date();
today.setHours(0, 0, 0, 0);
const bookingSchema = zod_1.z.object({
    name: zod_1.z
        .string(),
    email: zod_1.z.string().email({ message: "Please enter a valid email address" }),
    adultCount: zod_1.z.number(),
    childCount: zod_1.z.number(),
    // checkIn: z.string().refine((date) => date >= today, {
    //   message: "Check-in date cannot be in the past",
    // }),
    // checkOut: z.date().refine((date) => date >= today, {
    //   message: "Check-out date cannot be in the past",
    // }),
    checkIn: zod_1.z.string(),
    checkOut: zod_1.z.string(),
    totalCost: zod_1.z.number(),
    paymentIntentId: zod_1.z.string(),
    last_updated: zod_1.z.date().optional(),
});
exports.bookingSchema = bookingSchema;
