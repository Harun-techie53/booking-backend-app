"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentConfirmationBooking = exports.createStripePaymentIntent = exports.getHotel = exports.getHotels = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const apiFeatures_1 = __importDefault(require("../utils/apiFeatures"));
const Hotel_1 = __importDefault(require("../models/Hotel"));
const appError_1 = __importDefault(require("../utils/appError"));
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_API_KEY);
exports.getHotels = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const features = new apiFeatures_1.default(Hotel_1.default.find(), req.query)
        .filter()
        .sort()
        .fields()
        .paginate();
    const hotels = yield features.query;
    const total_documents = yield features.totalCountDocuments();
    res.status(200).json({
        status: "success",
        meta: {
            current_page: parseInt(features.queryString.page),
            page_size: parseInt(features.queryString.limit),
            total_pages: Math.ceil(parseInt(total_documents.toString()) /
                parseInt((_a = features.queryString.limit) === null || _a === void 0 ? void 0 : _a.toString())),
            total_documents,
        },
        data: {
            hotels,
        },
    });
}));
exports.getHotel = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hotel = yield Hotel_1.default.findById(req.params.hotelId);
    if (!hotel) {
        return next(new appError_1.default("Hotel not found", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            hotel,
        },
    });
}));
exports.createStripePaymentIntent = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('hit this route');
    //find the hotel
    const hotel = yield Hotel_1.default.findById(req.params.hotelId);
    if (!hotel) {
        return next(new appError_1.default("Hotel not found", 404));
    }
    //calculate total cost
    const numberOfNights = req.body.numberOfNights;
    const totalCost = numberOfNights * hotel.pricePerNight;
    // create stripe payment intent
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: totalCost * 100,
        currency: "usd",
        payment_method_types: ["card"],
        metadata: {
            hotelId: req.params.hotelId,
            userId: req.userId,
        },
    });
    if (paymentIntent.status !== "requires_payment_method") {
        return next(new appError_1.default("Payment failed", 500));
    }
    //send paymentIntentId and clientSecret as a response
    const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        totalCost: paymentIntent.amount
    };
    res.status(200).json({
        status: "success",
        message: 'New payment intent has been created',
        data: {
            response,
        },
    });
}));
exports.createPaymentConfirmationBooking = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //find the paymentIntent
    const paymentIntent = yield stripe.paymentIntents.retrieve(req.body.paymentIntentId);
    if (!paymentIntent) {
        return next(new appError_1.default("Payment intent not found", 404));
    }
    if (paymentIntent.status !== "succeeded") {
        return next(new appError_1.default("Payment intent not succeeded", 400));
    }
    //Check the hotelId and userId given by user with the payment intent hotelId and userId
    if (paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId) {
        return next(new appError_1.default("Mismatch with the stripe payment intent", 400));
    }
    //create a updated booking
    const newBooking = Object.assign(Object.assign({}, req.body), { userId: req.userId });
    //create the updated instance of hotel with the updated booking
    const hotel = yield Hotel_1.default.findOneAndUpdate({ _id: req.params.hotelId }, { $push: { bookings: newBooking } });
    //check for the hotel exist or not
    if (!hotel) {
        return next(new appError_1.default("Hotel not found", 404));
    }
    //send the response with the data
    res.status(200).json({
        status: "success",
        message: "Payment successfully confirmed",
        data: {
            hotel,
        },
    });
}));