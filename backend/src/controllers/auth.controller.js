import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  registerUser,
  verifyUserOtp,
  resendUserOtp,
  loginUser,
  logoutUser,
  updateUserProfile,
  changeUserPassword,
} from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  res.status(201).json(new ApiResponse(201, result, result.message));
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const result = await verifyUserOtp(req.body, res);
  res.status(200).json(new ApiResponse(200, result, "Account verified successfully."));
});

export const resendOtp = asyncHandler(async (req, res) => {
  const result = await resendUserOtp(req.body);
  res.status(200).json(new ApiResponse(200, result, result.message));
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body, res);
  res.status(200).json(new ApiResponse(200, result, "Logged in successfully."));
});

export const logout = asyncHandler(async (req, res) => {
  const result = logoutUser(res);
  res.status(200).json(new ApiResponse(200, result, result.message));
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, "Current user fetched."));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await updateUserProfile(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, { user: updatedUser }, "Profile updated successfully."));
});

export const changePassword = asyncHandler(async (req, res) => {
  const result = await changeUserPassword(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, result, result.message));
});
