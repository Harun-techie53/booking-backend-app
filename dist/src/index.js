"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const db_config_1 = __importDefault(require("../config/db.config"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const path_1 = __importDefault(require("path"));
const cloudinary_config_1 = __importDefault(require("../config/cloudinary.config"));
const myHotelRouter_1 = __importDefault(require("./routes/myHotelRouter"));
const hotelRouter_1 = __importDefault(require("./routes/hotelRouter"));
(0, cloudinary_config_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
(0, db_config_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, "../../../frontend/dist")));
app.use("/api/v1/auth", authRouter_1.default);
app.use("/api/v1/my-hotels", myHotelRouter_1.default);
app.use("/api/v1/hotels", hotelRouter_1.default);
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../../frontend/dist/index.html"));
});
app.listen(process.env.PORT, () => {
    console.log("Server is running on PORT 7000");
});
exports.default = app;
