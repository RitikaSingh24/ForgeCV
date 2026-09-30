import { Router } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import {
  uploadResume,
  listResumes,
  getResume,
  removeResume,
  analyze,
  rewrite,
  diff,
} from "../controllers/resume.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { uploadSingle } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import ApiError from "../utils/ApiError.js";

const router = Router();

// Validate Mongo ObjectId in params
const validateObjectId = (req, res, next) => {
  if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next(new ApiError(400, "Invalid resume ID format."));
  }
  next();
};

const analyzeSchema = {
  body: z.object({
    versionId: z.string().optional(),
    targetRole: z.string().optional(),
  }),
};

const rewriteSchema = {
  body: z.object({
    versionId: z.string().min(1, "versionId is required"),
    appliedRewriteIds: z.array(z.string()).default([]),
  }),
};

const diffSchema = {
  query: z.object({
    from: z.string().min(1, "from versionId is required"),
    to: z.string().min(1, "to versionId is required"),
  }),
};

router.use(verifyJWT);

router.get("/", listResumes);
router.post("/", uploadSingle, uploadResume);
router.get("/:id", validateObjectId, getResume);
router.delete("/:id", validateObjectId, removeResume);
router.post("/:id/analyze", validateObjectId, validate(analyzeSchema), analyze);
router.post("/:id/rewrite", validateObjectId, validate(rewriteSchema), rewrite);
router.get("/:id/diff", validateObjectId, validate(diffSchema), diff);

export default router;
