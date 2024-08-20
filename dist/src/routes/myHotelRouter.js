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
const myHotelController = __importStar(require("../controllers/myHotelController"));
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_1 = require("../middleware/validate");
const myHotelSchema_1 = require("../schema/myHotelSchema");
const myHotelRouter = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
});
myHotelRouter.get("/", auth_middleware_1.verifyToken, myHotelController.getMyHotels);
myHotelRouter.get("/my-bookings", auth_middleware_1.verifyToken, myHotelController.getMyHotelBookings);
myHotelRouter.get("/:hotelId", myHotelController.getHotelById);
myHotelRouter.post("/", auth_middleware_1.verifyToken, upload.array("imageFiles", 6), (0, validate_1.validate)(myHotelSchema_1.myHotelSchema), myHotelController.createHotel);
myHotelRouter.put("/:hotelId", auth_middleware_1.verifyToken, upload.array("imageFiles", 6), (0, validate_1.validate)(myHotelSchema_1.updateMyHotelSchema), myHotelController.updateHotel);
myHotelRouter.delete("/:hotelId", auth_middleware_1.verifyToken, myHotelController.deleteHotel);
exports.default = myHotelRouter;
