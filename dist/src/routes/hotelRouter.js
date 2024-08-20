"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hotelController = __importStar(require("../controllers/hotelController"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_1 = require("../middleware/validate");
const zod_1 = require("zod");
const myHotelSchema_1 = require("../schema/myHotelSchema");
const hotelRouter = express_1.default.Router();
hotelRouter.get("/", hotelController.getHotels);
hotelRouter.get("/:hotelId", hotelController.getHotel);
hotelRouter.post("/:hotelId/bookings/payment-intent", auth_middleware_1.verifyToken, (0, validate_1.validate)(zod_1.z.object({ numberOfNights: zod_1.z.number() })), hotelController.createStripePaymentIntent);
hotelRouter.post("/:hotelId/bookings/payment-confirm", auth_middleware_1.verifyToken, (0, validate_1.validate)(myHotelSchema_1.bookingSchema), hotelController.createPaymentConfirmationBooking);
exports.default = hotelRouter;
