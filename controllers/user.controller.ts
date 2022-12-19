import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { ExpressRequest, ResponseType } from "../types/shared";
import { Course, CourseOutline, Post, User } from "../models";
import {
  User as UserType,
  UserDocument,
  UserModel,
} from "../models/user/types";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import {
  deleteOne,
  getOne,
  getAll,
  deleteOnePermanently,
  updateOne,
  updateStatusOne,
  restoreOne,
} from "./handlerFactory";
import { messages, statuses } from "../utils/constants";
import { UserProfile } from "../types/user";
import { copyData } from "../utils/helpers";

export const getAllUsers = getAll<UserDocument, UserModel>(User);

export const getUser = getOne<UserDocument, UserModel>(User);

export const deleteUser = deleteOne<UserDocument, UserModel>(User);

export const deleteUserPermanently = deleteOnePermanently<
  UserDocument,
  UserModel
>(User);

export const updateMe = updateOne<UserDocument, UserModel>(User);

export const updateUserStatus = updateStatusOne<UserDocument, UserModel>(User);

export const deleteMe = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const doc: UserDocument | null = await User.findByIdAndUpdate(
      req.user?.id,
      { active: false, delete: true }
    );

    if (!doc) {
      return next(
        new AppError(messages.accountNotFound, StatusCodes.BAD_REQUEST)
      );
    }

    const response: ResponseType<null> = {
      data: null,
      message: messages.accountDeleted,
      statusText: statuses.success,
    };
    return res.status(StatusCodes.NO_CONTENT).json(response);
  }
);

export const deleteMePermanently = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const doc: UserDocument | null = await User.findByIdAndDelete(req.user?.id);
    if (!doc) {
      return next(
        new AppError(messages.accountNotFound, StatusCodes.BAD_REQUEST)
      );
    }
    const response: ResponseType<null> = {
      data: null,
      message: messages.accountDeletedPermanently,
      statusText: statuses.success,
    };
    return res.status(StatusCodes.NO_CONTENT).json(response);
  }
);

export const restoreUser = restoreOne<UserDocument, UserModel>(User);

export const getProfile = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id)
      return next(
        new AppError(messages.userIdRequired, StatusCodes.BAD_REQUEST)
      );

    const userFilter = {
      user: id,
      select: "_id",
    };
    const userDoc: UserDocument | null = await User.findById(id);
    if (!userDoc) {
      return next(
        new AppError(messages.accountNotFound, StatusCodes.BAD_REQUEST)
      );
    }

    const totalCourses: number = await Course.find(userFilter).countDocuments();
    const totalCourseOutlines: number = await CourseOutline.find(
      userFilter
    ).countDocuments();
    const totalPosts: number = await Post.find(userFilter).countDocuments();

    const myProfileData: UserProfile = {
      ...copyData(userDoc),
      totalCourses,
      totalCourseOutlines,
      totalPosts,
    };

    const response: ResponseType<UserProfile> = {
      data: myProfileData,
      message: messages.retrieved,
      statusText: statuses.success,
    };
    return res.status(StatusCodes.OK).json(response);
  }
);
