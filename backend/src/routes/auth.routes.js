import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  me,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 10,
  message: {
    statusCode: 429,
    success: false,
    message: "Too many authentication requests. Please try again after 15 minutes.",
  },
});

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

const registerSchema = {
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(60, "Name cannot exceed 60 characters"),
    email: z.string().email("Invalid email address"),
    password: passwordSchema,
  }),
};

const verifyOtpSchema = {
  body: z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "OTP must be exactly 6 digits"),
  }),
};

const resendOtpSchema = {
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
};

const loginSchema = {
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
};

const updateProfileSchema = {
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(60, "Name cannot exceed 60 characters"),
  }),
};

const changePasswordSchema = {
  body: z.object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
  }),
};

const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
};

const resetPasswordSchema = {
  body: z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().length(6, "Verification code must be exactly 6 digits"),
    newPassword: passwordSchema,
  }),
};

// Public auth routes with strict rate limit
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/verify-otp", authLimiter, validate(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", authLimiter, validate(resendOtpSchema), resendOtp);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", authLimiter, validate(resetPasswordSchema), resetPassword);

// Protected auth routes
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, me);
router.patch("/profile", verifyJWT, validate(updateProfileSchema), updateProfile);
router.patch("/password", verifyJWT, validate(changePasswordSchema), changePassword);

export default router;
