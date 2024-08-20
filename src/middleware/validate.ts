import { NextFunction, Request, Response } from "express";

export function validate(schema: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      res
        .status(400)
        .json({ message: "Validation error", errors: error.errors });
    }
  };
}
