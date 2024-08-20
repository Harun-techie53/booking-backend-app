"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (0, catchAsync_1.default)(async (req, res, next) => {
    let token = "";
    // Check to see whether token available or not
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (req.cookies["jwt"]) {
        token = req.cookies["jwt"];
    }
    if (!token) {
        return next(new appError_1.default("No token, authorization denied!", 401));
    }
    // Verify the token
    let decoded;
    decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
        return next(new appError_1.default("Token is not valid, authorization denied!", 401));
    }
    req.userId = decoded.id;
    next();
});
exports.verifyToken = verifyToken;
