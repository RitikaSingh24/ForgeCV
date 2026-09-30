import ApiError from "../utils/ApiError.js";
import { ZodError } from "zod";
import multer from "multer";

export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    let statusCode = error.statusCode || (error.name === "ValidationError" ? 400 : 500);
    let message = error.message || "Internal Server Error";
    let errors = [];

    if (err instanceof ZodError) {
      statusCode = 400;
      message = "Validation Error";
      errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
    } else if (err.name === "CastError") {
      statusCode = 400;
      message = `Invalid ${err.path}: ${err.value}`;
    } else if (err.code === 11000) {
      statusCode = 400;
      const field = Object.keys(err.keyValue || {})[0];
      message = `Duplicate field value entered: ${field}`;
    } else if (err instanceof multer.MulterError) {
      statusCode = 400;
      message = err.message;
    } else if (err.name === "JsonWebTokenError") {
      statusCode = 401;
      message = "Invalid token. Please log in again.";
    } else if (err.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token expired. Please log in again.";
    }

    error = new ApiError(statusCode, message, errors, err.stack);
  }

  const response = {
    statusCode: error.statusCode,
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  };

  res.status(error.statusCode).json(response);
};
