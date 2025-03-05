import { Response, ErrorRequestHandler } from "express";
import { MongoServerError } from "mongodb";
import { z } from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "@/src/constants/http";
import { REFRESH_PATH, clearAuthCookies } from "../utils/cookies";
import AppError from "../utils/AppError";

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  return res.status(BAD_REQUEST).json({
    errors,
    message: error.message,
  });
};

const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};

const handleMongoError = (res: Response, error: MongoServerError) => {
  // Duplicate key
  if (error.code === 11000) {
    return res.status(422).send({ succes: false, message: `${error.keyValue.name} already exist!` });
  }
};

const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  console.log(`PATH ${req.path}`, error);

  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

  if (error instanceof MongoServerError) {
    return handleMongoError(res, error);
  }

  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }

  if (error instanceof AppError) {
    return handleAppError(res, error);
  }

  return res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
};

export default errorHandler;
