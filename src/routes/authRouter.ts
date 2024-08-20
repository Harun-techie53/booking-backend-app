import express from "express";
import * as authController from "../controllers/authController";
import { validate } from "../middleware/validate";
import { signUpSchema } from "../schema/userSchema";
import { verifyToken } from "../middleware/auth.middleware";
import catchAsync from "../utils/catchAsync";

const authRouter = express.Router();

authRouter.post("/signIn", authController.signInUser);
authRouter.post("/signUp", validate(signUpSchema), authController.signUpUser);

authRouter.get("/validate-token", verifyToken, authController.validateToken);
authRouter.get("/me", verifyToken, authController.getCurrentUser);
authRouter.post("/logout", authController.logOutUser);

export default authRouter;
