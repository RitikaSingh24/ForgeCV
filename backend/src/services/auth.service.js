import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import { sendOtpEmail } from "./mail.service.js";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "supersecretkey", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  if (existingUser) {
    if (!existingUser.isVerified) {
      // Re-send OTP for unverified existing account
      const otp = generateOtp();
      const otpHash = await bcrypt.hash(otp, 10);
      existingUser.otpHash = otpHash;
      existingUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      existingUser.otpAttempts = 0;
      existingUser.otpLastSentAt = new Date();
      await existingUser.save();
      await sendOtpEmail(existingUser.email, existingUser.name, otp);
      return { message: "Account exists but is unverified. A new verification OTP has been sent." };
    }
    throw new ApiError(400, "User with this email already exists.");
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    isVerified: false,
    otpHash,
    otpExpires: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
    otpAttempts: 0,
    otpLastSentAt: new Date(),
  });

  await sendOtpEmail(user.email, user.name, otp);

  return { message: "Registration successful. Please check your email for the verification OTP." };
};

export const verifyUserOtp = async ({ email, otp }, res) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(400, "User not found.");
  }

  if (user.isVerified) {
    throw new ApiError(400, "User is already verified. Please log in.");
  }

  if (!user.otpHash || !user.otpExpires || user.otpExpires < new Date()) {
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }

  if (user.otpAttempts >= 5) {
    throw new ApiError(400, "Maximum OTP verification attempts exceeded. Please request a new OTP.");
  }

  const isMatch = await bcrypt.compare(otp, user.otpHash);
  if (!isMatch) {
    user.otpAttempts += 1;
    await user.save();
    throw new ApiError(400, "Invalid OTP code.");
  }

  user.isVerified = true;
  user.otpHash = null;
  user.otpExpires = null;
  user.otpAttempts = 0;
  user.otpLastSentAt = null;
  await user.save();

  const token = generateToken(user._id);
  res.cookie("token", token, getCookieOptions());

  return { user, token };
};

export const resendUserOtp = async ({ email }) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(400, "User not found.");
  }

  if (user.isVerified) {
    throw new ApiError(400, "Account is already verified.");
  }

  if (user.otpLastSentAt && new Date() - new Date(user.otpLastSentAt) < 60 * 1000) {
    const secondsRemaining = Math.ceil((60 * 1000 - (new Date() - new Date(user.otpLastSentAt))) / 1000);
    throw new ApiError(400, `Please wait ${secondsRemaining} seconds before requesting a new OTP.`);
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  user.otpHash = otpHash;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
  user.otpAttempts = 0;
  user.otpLastSentAt = new Date();
  await user.save();

  await sendOtpEmail(user.email, user.name, otp);

  return { message: "A new OTP code has been sent to your email." };
};

export const loginUser = async ({ email, password }, res) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.isVerified) {
    // Send OTP if cooldown passed
    if (!user.otpLastSentAt || new Date() - new Date(user.otpLastSentAt) >= 60 * 1000) {
      const otp = generateOtp();
      user.otpHash = await bcrypt.hash(otp, 10);
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
      user.otpAttempts = 0;
      user.otpLastSentAt = new Date();
      await user.save();
      await sendOtpEmail(user.email, user.name, otp);
    }
    const error = new ApiError(403, "Email not verified. A new verification OTP has been sent to your email.");
    error.code = "EMAIL_NOT_VERIFIED";
    throw error;
  }

  const token = generateToken(user._id);
  res.cookie("token", token, getCookieOptions());

  return { user, token };
};

export const logoutUser = (res) => {
  res.clearCookie("token", getCookieOptions());
  return { message: "Logged out successfully." };
};

export const updateUserProfile = async (userId, { name }) => {
  const user = await User.findByIdAndUpdate(userId, { name }, { new: true, runValidators: true });
  return user;
};

export const changeUserPassword = async (userId, { oldPassword, newPassword }) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found.");

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect.");
  }

  user.password = newPassword;
  await user.save();
  return { message: "Password updated successfully." };
};
