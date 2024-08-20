"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BookingSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
    },
    adultCount: {
        type: Number,
        required: [true, "Number of adults is required"],
    },
    childCount: {
        type: Number,
        required: [true, "Number of childs is required"],
    },
    checkIn: {
        type: Date,
        required: [true, "Check In date is required"],
    },
    checkOut: {
        type: Date,
        required: [true, "Check Out date is required"],
    },
    totalCost: {
        type: Number,
        required: [true, "Total cost is required"],
    },
    paymentIntentId: {
        type: String,
        required: [true, "Payment intent id is required"],
    },
    lastUpdated: {
        type: Date,
        default: Date.now(),
    },
});
const hotelSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
        minlength: [10, "Minimum length of characters should be 10"],
        maxlength: [60, "Maximum length of characters should be 60"],
    },
    city: {
        type: String,
        required: [true, "City is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    },
    description: {
        type: String,
    },
    type: {
        type: String,
    },
    adultCount: {
        type: Number,
        required: [true, "Adult count is required"],
    },
    childCount: {
        type: Number,
        default: 0,
    },
    facilities: {
        type: [String],
        required: [true, "Facilities is required"],
    },
    pricePerNight: {
        type: Number,
        required: [true, "Price per night is required"],
    },
    starRating: {
        type: Number,
        required: [true, "Star Rating is required"],
    },
    imageUrls: {
        type: [{ url: String, public_id: String }],
        required: [true, "Images are required"],
    },
    lastUpdated: {
        type: Date,
        default: Date.now(),
    },
    bookings: [BookingSchema],
});
const Hotel = (0, mongoose_1.model)("Hotel", hotelSchema);
exports.default = Hotel;
