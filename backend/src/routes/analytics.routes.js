import { Router } from "express";
import { getInsights, getVersions, getHistory } from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/insights", getInsights);
router.get("/versions", getVersions);
router.get("/history", getHistory);

export default router;
