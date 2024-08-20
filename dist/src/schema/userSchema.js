"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpSchema = exports.signInSchema = void 0;
const zod_1 = require("zod");
const signUpSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, { message: "Name is required" })
        .max(255, { message: "Name must be less than 255 characters" }),
    email: zod_1.z.string().email({ message: "Please enter a valid email address" }),
    password: zod_1.z
        .string()
        .min(8, { message: "Password length must be 8 or more characters" }),
    passwordConfirm: zod_1.z
        .string()
        .min(1, { message: "Password confirmation is required" }),
});
exports.signUpSchema = signUpSchema;
const signInSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
exports.signInSchema = signInSchema;
