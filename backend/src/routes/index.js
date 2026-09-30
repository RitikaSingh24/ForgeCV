import { Router } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import authRoutes from "./auth.routes.js";
import resumeRoutes from "./resume.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import analyticsRoutes from "./analytics.routes.js";

const router = Router();

router.get("/health", (req, res) => {
  res.status(200).json(new ApiResponse(200, { status: "ok" }, "API is working"));
});

router.use("/auth", authRoutes);
router.use("/resumes", resumeRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/", analyticsRoutes);

export default router;
