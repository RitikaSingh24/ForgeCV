import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  createResumeFromUpload,
  analyzeVersion,
  createRewriteVersion,
  getDiff,
  getUserResumes,
  getResumeDetails,
  deleteResume,
} from "../services/resume.service.js";

export const uploadResume = asyncHandler(async (req, res) => {
  const result = await createResumeFromUpload(req.user._id, req.file);
  res.status(201).json(new ApiResponse(201, result, "Resume uploaded and parsed successfully."));
});

export const listResumes = asyncHandler(async (req, res) => {
  const result = await getUserResumes(req.user._id);
  res.status(200).json(new ApiResponse(200, result, "Resumes fetched successfully."));
});

export const getResume = asyncHandler(async (req, res) => {
  const result = await getResumeDetails(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, result, "Resume details fetched."));
});

export const removeResume = asyncHandler(async (req, res) => {
  const result = await deleteResume(req.user._id, req.params.id);
  res.status(200).json(new ApiResponse(200, result, result.message));
});

export const analyze = asyncHandler(async (req, res) => {
  const { versionId, targetRole } = req.body;
  const analysis = await analyzeVersion(req.user._id, req.params.id, versionId, targetRole);
  res.status(200).json(new ApiResponse(200, analysis, "Resume analysis completed."));
});

export const rewrite = asyncHandler(async (req, res) => {
  const { versionId, appliedRewriteIds } = req.body;
  const result = await createRewriteVersion(req.user._id, req.params.id, versionId, appliedRewriteIds);
  res.status(201).json(new ApiResponse(201, result, "New version created with applied rewrites."));
});

export const diff = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const result = await getDiff(req.user._id, req.params.id, from, to);
  res.status(200).json(new ApiResponse(200, result, "Version diff generated successfully."));
});
