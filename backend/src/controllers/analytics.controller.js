import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { getInsightsData, getAllVersionsData, getHistoryData } from "../services/analytics.service.js";

export const getInsights = asyncHandler(async (req, res) => {
  const data = await getInsightsData(req.user);
  res.status(200).json(new ApiResponse(200, data, "Insights data fetched successfully."));
});

export const getVersions = asyncHandler(async (req, res) => {
  const data = await getAllVersionsData(req.user);
  res.status(200).json(new ApiResponse(200, data, "Versions history fetched successfully."));
});

export const getHistory = asyncHandler(async (req, res) => {
  const data = await getHistoryData(req.user);
  res.status(200).json(new ApiResponse(200, data, "Activity history fetched successfully."));
});
