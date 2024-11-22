import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import jwt from "jsonwebtoken";

const getJwtToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

interface CookieOption {
  expires: Date;
  httpOnly?: boolean;
  secure?: boolean;
}

const createSendToken = (user: User, res: Response) => {
  const token = getJwtToken(user.id);
  const cookieOptions: CookieOption = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_COOKIE_EXPIRES_IN as string) *
          24 *
          60 *
          60 *
          1000
    )
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  //remove password from res body
  user.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const getCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.userId).select("-password -__v");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
);

const signUpUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm } = req.body;

    const user = new User({
      name,
      email,
      password,
      passwordConfirm,
    });

    await user.save();

    createSendToken(user, res);
  }
);

const signInUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      const err = new AppError("Please, enter email and password", 400);
      return next(err);
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new AppError("Invalid Credentials!", 401));
    }

    const isPasswordMatch = await user.matchPassword(
      password,
      user.password as string
    );
    if (!isPasswordMatch) {
      return next(new AppError("Invalid Credentials!", 401));
    }

    createSendToken(user, res);
  }
);

const validateToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.userId).select("-password");

    res.status(200).json({
      status: "success",
      message: "Token Validated Successfully",
      data: {
        user,
      },
    });
  }
);

const logOutUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("jwt", "", {
      expires: new Date(0),
    });

    res.status(200).json({
      status: "success",
      message: "User Logout Successfully",
    });
  }
);

export { signInUser, signUpUser, validateToken, logOutUser, getCurrentUser };
