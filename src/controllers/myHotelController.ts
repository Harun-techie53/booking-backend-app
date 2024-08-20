import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { v2 as cloudinary } from "cloudinary";
import Hotel from "../models/Hotel";
import AppError from "../utils/appError";

const deleteImagesFromCloudinary = async (publicIds: string[]) => {
  const deletedPromises = publicIds.map(
    async (id) => await cloudinary.uploader.destroy(id)
  );

  try {
    const result = await Promise.all(deletedPromises);
    console.log("deleted images successfully from cloudinary", result);
  } catch (error) {
    console.error("error", error);
  }
};

const uploadImagesToCloudinary = async (
  imageFiles: Express.Multer.File[]
): Promise<{ url: string; public_id: string }[]> => {
  const uploadedPromises = imageFiles?.map(async (image) => {
    const imageBase64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = "data:" + image.mimetype + ";base64," + imageBase64;
    const res = await cloudinary.uploader.upload(dataURI);
    return { url: res.url, public_id: res.public_id };
  });

  const imageUrls = await Promise.all(uploadedPromises);
  return imageUrls;
};

export const getHotelById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hotel = await Hotel.findById(req.params.hotelId);
    res.status(200).json({
      status: "success",
      message: "Hotel data fetched successfully",
      data: {
        hotel,
      },
    });
  }
);

export const getMyHotels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const myHotels = await Hotel.find({ userId: req.userId.toString() }).select(
      "-facilities -__v"
    );

    res.status(200).json({
      status: "success",
      message: "All hotels data fetched successfully",
      data: {
        hotels: myHotels,
      },
    });
  }
);

export const createHotel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const imageFiles = req.files as Express.Multer.File[];

    //step-1: upload images to cloudinary
    const uploadedImageUrls = await uploadImagesToCloudinary(imageFiles);
    //step-2: add returned image urls from cloudinary to Hotel object
    const newHotel = new Hotel({
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
  }
);

export const updateHotel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hotelId = req.params.hotelId as string;
    const imageFiles = req.files as Express.Multer.File[];

    let uploadedImageUrls: { url: string; public_id: string }[] = [];

    // Step 1: Upload images to Cloudinary if there are any files
    if (imageFiles && imageFiles.length > 0) {
      uploadedImageUrls = await uploadImagesToCloudinary(imageFiles);
    }

    // Step 2: Find the hotel by ID
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return next(new AppError("Hotel not found", 404));
    }

    // Step 3: Delete images from Cloudinary and database
    if (
      req.body.deleteCloudinaryImageIds &&
      Array.isArray(req.body.deleteCloudinaryImageIds) &&
      req.body.deleteCloudinaryImageIds.length > 0
    ) {
      const remainingImageUrls: { url: string; public_id: string }[] =
        hotel.imageUrls.filter(
          (imgUrl: { url: string; public_id: string }) =>
            !req.body.deleteCloudinaryImageIds.includes(imgUrl.public_id)
        );
      uploadedImageUrls.push(...remainingImageUrls);
      await deleteImagesFromCloudinary(req.body.deleteCloudinaryImageIds);
    } else {
      uploadedImageUrls = [...hotel.imageUrls, ...uploadedImageUrls];
    }

    // Step 4: Assign the new data from req.body to hotel
    Object.entries(req.body).forEach(([key, value]) => {
      if (key !== "deleteCloudinaryImageIds" && key !== "imageUrls") {
        (hotel as any)[key] = value;
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
  }
);

export const deleteHotel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { imagePublicIds } = req.query;
    const { hotelId } = req.params;

    const hotel = await Hotel.findByIdAndDelete(hotelId);

    if (!hotel) {
      return next(new AppError("Hotel not found", 404));
    }

    await deleteImagesFromCloudinary(imagePublicIds as string[]);

    res.status(200).json({
      status: "success",
      message: "Hotel deleted successfully",
    });
  }
);

export const getMyHotelBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hotels = await Hotel.find({
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
  }
);
