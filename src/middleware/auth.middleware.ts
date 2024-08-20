import { NextFunction, Response, Request } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const verifyToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string = "";

    // Check to see whether token available or not
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (req.cookies["jwt"]) {
      token = req.cookies["jwt"];
    }

    if (!token) {
      return next(new AppError("No token, authorization denied!", 401));
    }
    // Verify the token
    let decoded: any;

    decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    if (!decoded) {
      return next(
        new AppError("Token is not valid, authorization denied!", 401)
      );
    }

    req.userId = decoded.id;

    next();
  }
);

export { verifyToken };
