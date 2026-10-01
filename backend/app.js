import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { notFound, errorHandler } from "./src/middleware/error.middleware.js";
import routes from "./src/routes/index.js";

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const envClientUrls = (process.env.CLIENT_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const defaultAllowedOrigins = [
  "https://forge-cv-blue.vercel.app",
  "https://forgecv.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:5175",
];

const allowedOrigins = Array.from(new Set([...envClientUrls, ...defaultAllowedOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/+$/, "");

    const isAllowed =
      allowedOrigins.includes(cleanOrigin) ||
      /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(cleanOrigin) ||
      /\.vercel\.app$/.test(cleanOrigin);

    if (isAllowed) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    statusCode: 429,
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});
app.use("/api", limiter);

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
