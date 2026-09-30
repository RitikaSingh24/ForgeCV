import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getDashboardData } from "../services/dashboard.service.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await getDashboardData(req.user);
  res.status(200).json(new ApiResponse(200, data, "Dashboard data fetched successfully."));
});
