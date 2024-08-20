"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyHotelBookings = exports.deleteHotel = exports.updateHotel = exports.createHotel = exports.getMyHotels = exports.getHotelById = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const cloudinary_1 = require("cloudinary");
const Hotel_1 = __importDefault(require("../models/Hotel"));
const appError_1 = __importDefault(require("../utils/appError"));
const deleteImagesFromCloudinary = async (publicIds) => {
    const deletedPromises = publicIds.map(async (id) => await cloudinary_1.v2.uploader.destroy(id));
    try {
        const result = await Promise.all(deletedPromises);
        console.log("deleted images successfully from cloudinary", result);
    }
    catch (error) {
        console.error("error", error);
    }
};
const uploadImagesToCloudinary = async (imageFiles) => {
    const uploadedPromises = imageFiles?.map(async (image) => {
        const imageBase64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + imageBase64;
        const res = await cloudinary_1.v2.uploader.upload(dataURI);
        return { url: res.url, public_id: res.public_id };
    });
    const imageUrls = await Promise.all(uploadedPromises);
    return imageUrls;
};
exports.getHotelById = (0, catchAsync_1.default)(async (req, res, next) => {
    const hotel = await Hotel_1.default.findById(req.params.hotelId);
    res.status(200).json({
        status: "success",
        message: "Hotel data fetched successfully",
        data: {
            hotel,
        },
    });
});
exports.getMyHotels = (0, catchAsync_1.default)(async (req, res, next) => {
    const myHotels = await Hotel_1.default.find({ userId: req.userId.toString() }).select("-facilities -__v");
    res.status(200).json({
        status: "success",
        message: "All hotels data fetched successfully",
        data: {
            hotels: myHotels,
        },
    });
});
exports.createHotel = (0, catchAsync_1.default)(async (req, res, next) => {
    const imageFiles = req.files;
    //step-1: upload images to cloudinary
    const uploadedImageUrls = await uploadImagesToCloudinary(imageFiles);
    //step-2: add returned image urls from cloudinary to Hotel object
    const newHotel = new Hotel_1.default({
        userId: req.userId,
        name: req.body.name.toString(),
        city: req.body.city.toString(),
        country: req.body.country.toString(),
        description: req.body.description.toString(),
        type: req.body.type.toString(),
        adultCount: Number(req.body.adultCount),
        childCount: Number(req.body.childCount),
        facilities: req.body.facilities,
        pricePerNight: Number(req.body.pricePerNight),
        starRating: Number(req.body.starRating),
        imageUrls: [...uploadedImageUrls],
    });
    //step-3: save the updated my hotel object in database
    await newHotel.save();
    //step-4: return response with created my hotel
    res.status(201).json({
        status: "success",
        message: "Created hotel successfully",
        data: {
            hotel: newHotel,
        },
    });
});
exports.updateHotel = (0, catchAsync_1.default)(async (req, res, next) => {
    const hotelId = req.params.hotelId;
    const imageFiles = req.files;
    let uploadedImageUrls = [];
    // Step 1: Upload images to Cloudinary if there are any files
    if (imageFiles && imageFiles.length > 0) {
        uploadedImageUrls = await uploadImagesToCloudinary(imageFiles);
    }
    // Step 2: Find the hotel by ID
    const hotel = await Hotel_1.default.findById(hotelId);
    if (!hotel) {
        return next(new appError_1.default("Hotel not found", 404));
    }
    // Step 3: Delete images from Cloudinary and database
    if (req.body.deleteCloudinaryImageIds &&
        Array.isArray(req.body.deleteCloudinaryImageIds) &&
        req.body.deleteCloudinaryImageIds.length > 0) {
        const remainingImageUrls = hotel.imageUrls.filter((imgUrl) => !req.body.deleteCloudinaryImageIds.includes(imgUrl.public_id));
        uploadedImageUrls.push(...remainingImageUrls);
        await deleteImagesFromCloudinary(req.body.deleteCloudinaryImageIds);
    }
    else {
        uploadedImageUrls = [...hotel.imageUrls, ...uploadedImageUrls];
    }
    // Step 4: Assign the new data from req.body to hotel
    Object.entries(req.body).forEach(([key, value]) => {
        if (key !== "deleteCloudinaryImageIds" && key !== "imageUrls") {
            hotel[key] = value;
        }
    });
    // Step 5: Update the imageUrls property
    hotel.imageUrls = uploadedImageUrls;
    //step 6: update the lastupdated to current time
    hotel.lastUpdated = new Date();
    // // Step 7: Save and respond back to the user
    await hotel.save();
    res.status(201).json({
        status: "success",
        message: "Hotel updated successfully",
        data: {
            hotel,
        },
    });
});
exports.deleteHotel = (0, catchAsync_1.default)(async (req, res, next) => {
    const { imagePublicIds } = req.query;
    const { hotelId } = req.params;
    const hotel = await Hotel_1.default.findByIdAndDelete(hotelId);
    if (!hotel) {
        return next(new appError_1.default("Hotel not found", 404));
    }
    await deleteImagesFromCloudinary(imagePublicIds);
    res.status(200).json({
        status: "success",
        message: "Hotel deleted successfully",
    });
});
exports.getMyHotelBookings = (0, catchAsync_1.default)(async (req, res, next) => {
    const hotels = await Hotel_1.default.find({
        bookings: { $elemMatch: { userId: req.userId } },
    });
    // const results = hotels.map((hotel) => {
    //   const userBookings = hotel.bookings.filter(
    //     (booking) => booking.userId === req.userId
    //   );
    // });
    res.status(200).json({
        status: "success",
        data: hotels,
    });
});
