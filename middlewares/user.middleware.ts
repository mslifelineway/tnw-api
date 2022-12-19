import { StatusCodes } from "http-status-codes";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../types/shared";
import AppError from "../utils/AppError";
import { messages } from "../utils/constants";
import {
  addFilters,
  filterUserAllowedFields,
  isRequestContainsFilterObject,
} from "../utils/helpers";

export const addUserIdToRequestBody = (
  req: ExpressRequest,
  _: Response,
  next: NextFunction
) => {
  req.body.user = req.user?.id;
  next();
};

export const addUserIdToParam = (
  req: ExpressRequest,
  _: Response,
  next: NextFunction
) => {
  req.params.id = req.user?.id;
  next();
};

export const excludeMe = (
  req: ExpressRequest,
  _: Response,
  next: NextFunction
) => {
  const filterById = {
    _id: {
      $ne: req.user?.id,
    },
  };
  if (isRequestContainsFilterObject(req)) {
    req.filter = {
      ...req.filter,
      ...filterById,
    };
  } else {
    req.filter = filterById;
  }
  return next();
};

export const filterByLoggedInUserId = (
  req: ExpressRequest,
  _: Response,
  next: NextFunction
) => {
  addFilters(req, {
    _id: req.user?._id,
  });

  return next();
};

export const validateAndFilterUserUpdateFields = async (
  req: ExpressRequest,
  res: Response,
  next: NextFunction
) => {
  const { password, passwordConfirm } = req.body;

  if (password || passwordConfirm) {
    return next(
      new AppError(
        messages.passwordCouldNotBeUpdatedHere,
        StatusCodes.BAD_REQUEST
      )
    );
  }

  const filterBody = filterUserAllowedFields(req.body, [
    "name",
    "email",
    "phone",
    "about",
  ]);
  req.body = filterBody;
  next();
};
