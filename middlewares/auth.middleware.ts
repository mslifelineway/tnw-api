import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { messages } from "../utils/constants";
import { restrictTo } from "../controllers";
import { Role } from "../types";

export const validateLoginCredentials = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(
      new AppError(messages.incorrectCredentials, StatusCodes.BAD_REQUEST)
    );
  }
  return next();
};

export const restrictToAdmin = restrictTo([Role.admin]);
