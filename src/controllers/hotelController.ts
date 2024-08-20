import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import APIFeatures from "../utils/apiFeatures";
import Hotel from "../models/Hotel";
import AppError from "../utils/appError";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

export const getHotels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const features = new APIFeatures(Hotel.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();

    const hotels = await features.query;
    const total_documents = await features.totalCountDocuments();

    res.status(200).json({
      status: "success",
      meta: {
        current_page: parseInt(features.queryString.page as string),
        page_size: parseInt(features.queryString.limit as string),
        total_pages: Math.ceil(
          parseInt(total_documents.toString()) /
            parseInt(features.queryString.limit?.toString() as string)
        ),
        total_documents,
      },
      data: {
        hotels,
      },
    });
  }
);

export const getHotel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
      return next(new AppError("Hotel not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        hotel,
      },
    });
  }
);

export const createStripePaymentIntent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('hit this route')
    //find the hotel
    const hotel = await Hotel.findById(req.params.hotelId);

    if (!hotel) {
      return next(new AppError("Hotel not found", 404));
    }

    //calculate total cost
    const numberOfNights = req.body.numberOfNights;
    const totalCost = numberOfNights * hotel.pricePerNight;

    // create stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100,
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        hotelId: req.params.hotelId,
        userId: req.userId,
      },
    });

    if (paymentIntent.status !== "requires_payment_method") {
      return next(new AppError("Payment failed", 500));
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
  }
);

export const createPaymentConfirmationBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //find the paymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(
      req.body.paymentIntentId
    );

    if (!paymentIntent) {
      return next(new AppError("Payment intent not found", 404));
    }

    if (paymentIntent.status !== "succeeded") {
      return next(new AppError("Payment intent not succeeded", 400));
    }

    //Check the hotelId and userId given by user with the payment intent hotelId and userId
    if (
      paymentIntent.metadata.hotelId !== req.params.hotelId ||
      paymentIntent.metadata.userId !== req.userId
    ) {
      return next(new AppError("Mismatch with the stripe payment intent", 400));
    }

    //create a updated booking
    const newBooking = {
      ...req.body,
      userId: req.userId,
    };

    //create the updated instance of hotel with the updated booking
    const hotel = await Hotel.findOneAndUpdate(
      { _id: req.params.hotelId },
      { $push: { bookings: newBooking } }
    );

    //check for the hotel exist or not
    if (!hotel) {
      return next(new AppError("Hotel not found", 404));
    }
    //send the response with the data
    res.status(200).json({
      status: "success",
      message: "Payment successfully confirmed",
      data: {
        hotel,
      },
    });
  }
);

