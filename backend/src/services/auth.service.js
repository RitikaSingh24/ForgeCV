import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import ApiError from "../utils/ApiError.js";
import { sendOtpEmail, sendPasswordResetOtpEmail } from "./mail.service.js";

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
  if (!name || !email || !password) {
    throw new ApiError(400, "Please provide name, email, and password.");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(400, "User with this email already exists.");
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    isVerified: true,
  });

  return { message: "Account created successfully! You can now sign in." };
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
  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password.");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.isVerified) {
    user.isVerified = true;
    await user.save();
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

export const forgotPasswordUser = async ({ email }) => {
  if (!email) {
    throw new ApiError(400, "Please provide an email address.");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(404, "No account found with this email address.");
  }

  if (user.resetOtpLastSentAt && new Date() - new Date(user.resetOtpLastSentAt) < 60 * 1000) {
    const secondsRemaining = Math.ceil((60 * 1000 - (new Date() - new Date(user.resetOtpLastSentAt))) / 1000);
    throw new ApiError(400, `Please wait ${secondsRemaining} seconds before requesting another code.`);
  }

  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  user.resetOtpHash = otpHash;
  user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
  user.resetOtpAttempts = 0;
  user.resetOtpLastSentAt = new Date();
  await user.save();

  await sendPasswordResetOtpEmail(user.email, user.name, otp);

  return { message: "Password reset verification code sent to your email." };
};

export const resetPasswordUser = async ({ email, otp, newPassword }) => {
  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Please provide email, verification code, and new password.");
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new ApiError(400, "User not found.");
  }

  if (!user.resetOtpHash || !user.resetOtpExpires || user.resetOtpExpires < new Date()) {
    throw new ApiError(400, "Verification code has expired. Please request a new one.");
  }

  if (user.resetOtpAttempts >= 5) {
    throw new ApiError(400, "Maximum verification attempts exceeded. Please request a new code.");
  }

  const isMatch = await bcrypt.compare(otp, user.resetOtpHash);
  if (!isMatch) {
    user.resetOtpAttempts += 1;
    await user.save();
    throw new ApiError(400, "Invalid verification code.");
  }

  user.password = newPassword;
  user.resetOtpHash = null;
  user.resetOtpExpires = null;
  user.resetOtpAttempts = 0;
  user.resetOtpLastSentAt = null;
  await user.save();

  return { message: "Password reset successfully. You can now log in." };
};
