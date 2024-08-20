import { z } from "zod";

const signUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Name must be less than 255 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password length must be 8 or more characters" }),
  passwordConfirm: z
    .string()
    .min(1, { message: "Password confirmation is required" }),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export { signInSchema, signUpSchema };
