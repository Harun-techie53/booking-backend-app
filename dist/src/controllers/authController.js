"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logOutUser = exports.validateToken = exports.signUpUser = exports.signInUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getJwtToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
const createSendToken = (user, res) => {
    const token = getJwtToken(user.id);
    const cookieOptions = {
        expires: new Date(Date.now() +
            parseInt(process.env.JWT_COOKIE_EXPIRES_IN) *
                24 *
                60 *
                60 *
                1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
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
const getCurrentUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = await User_1.default.findById(req.userId).select("-password -__v");
    if (!user) {
        return next(new appError_1.default("User not found", 404));
    }
    res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});
exports.getCurrentUser = getCurrentUser;
const signUpUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { name, email, password, passwordConfirm } = req.body;
    const user = new User_1.default({
        name,
        email,
        password,
        passwordConfirm,
    });
    await user.save();
    createSendToken(user, res);
});
exports.signUpUser = signUpUser;
const signInUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const err = new appError_1.default("Please, enter email and password", 400);
        return next(err);
    }
    const user = await User_1.default.findOne({ email }).select("+password");
    if (!user) {
        return next(new appError_1.default("Invalid Credentials!", 401));
    }
    const isPasswordMatch = await user.matchPassword(password, user.password);
    if (!isPasswordMatch) {
        return next(new appError_1.default("Invalid Credentials!", 401));
    }
    createSendToken(user, res);
});
exports.signInUser = signInUser;
const validateToken = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = await User_1.default.findById(req.userId).select("-password");
    res.status(200).json({
        status: "success",
        message: "Token Validated Successfully",
        data: {
            user,
        },
    });
});
exports.validateToken = validateToken;
const logOutUser = (0, catchAsync_1.default)(async (req, res, next) => {
    res.cookie("jwt", "", {
        expires: new Date(0),
    });
    res.status(200).json({
        status: "success",
        message: "User Logout Successfully",
    });
});
exports.logOutUser = logOutUser;
