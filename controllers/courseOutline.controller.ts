import {
  CourseOutlineDocument,
  CourseOutlineModel,
} from "../models/courseOutline/types";
import { Course, CourseOutline } from "../models";
import {
  getOne,
  createOne,
  updateOne,
  deleteOne,
  getAll,
  deleteOnePermanently,
  restoreOne,
  updateStatusOne,
} from "./handlerFactory";
import { catchAsync } from "../utils/catchAsync";
import { ExpressRequest, ResponseType } from "../types";
import { NextFunction, Response } from "express";
import AppError from "../utils/AppError";
import { messages, statuses } from "../utils/constants";
import { StatusCodes } from "http-status-codes";
import {
  CourseOutlineParentAndSublings,
  CourseOutlineParentAndSublingsResponse,
  getCourseOutlineParentAndSublings,
} from "../services";
import { copyData } from "../utils/helpers";
import { CourseDocument } from "../models/course/types";
import arrayToTree from "array-to-tree";

export const getAllCourseOutlines = getAll<
  CourseOutlineDocument,
  CourseOutlineModel
>(CourseOutline, [
  { path: "course", select: "name -user" },
  { path: "user", select: "name" },
]);

export const createCourseOutline = createOne<
  CourseOutlineDocument,
  CourseOutlineModel
>(CourseOutline);

export const getCourseOutline = getOne<
  CourseOutlineDocument,
  CourseOutlineModel
>(CourseOutline);

export const updateCourseOutline = updateOne<
  CourseOutlineDocument,
  CourseOutlineModel
>(CourseOutline);

export const updateCourseOutlineStatus = updateStatusOne<
  CourseOutlineDocument,
  CourseOutlineModel
>(CourseOutline);

export const restoreCourseOutline = restoreOne<
  CourseOutlineDocument,
  CourseOutlineModel
>(CourseOutline);

export const deleteCourseOutline = deleteOne<
  CourseOutlineDocument,
  CourseOutlineModel
>(CourseOutline);

export const deleteCourseOutlinePermanently = deleteOnePermanently<
  CourseOutlineDocument,
  CourseOutlineModel
>(CourseOutline);

export const getCourseOutlineByIdWithParentsAndCouse = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const result: CourseOutlineParentAndSublingsResponse =
      await getCourseOutlineParentAndSublings(id);

    if (result.status !== StatusCodes.OK) {
      return next(new AppError(result.message, result.status));
    }

    const response: ResponseType<CourseOutlineParentAndSublings | undefined> = {
      data: result.sublings,
      message: messages.retrieved,
      statusText: statuses.success,
    };
    return res.status(StatusCodes.OK).json(response);
  }
);

export const getAllCourseOutlinesBySlug = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { courseSlug } = req.params;

    const course: CourseDocument | null = await Course.findOne(
      { slug: courseSlug },
      "_id name active deleted"
    );
    if (!course) {
      return next(
        new AppError(messages.courseCouldNotBeFound, StatusCodes.BAD_REQUEST)
      );
    }
    if (!course.active) {
      return next(new AppError(messages.comingSoon, StatusCodes.BAD_REQUEST));
    }
    if (course.deleted) {
      return next(
        new AppError(messages.courseIsNotAvailable, StatusCodes.BAD_REQUEST)
      );
    }

    const filter = {
      course: course._id,
      active: true,
      deleted: false,
    };

    const select = "_id id name slug parent";

    let query = CourseOutline.find(filter, select).sort({
      parent: 1,
      name: 1,
    });

    const outlines: CourseOutlineDocument[] = await query;

    const resultData: arrayToTree.Tree<CourseOutlineDocument>[] = arrayToTree(
      copyData(outlines),
      {
        parentProperty: "parent",
        customID: "_id",
      }
    );

    const response: ResponseType<arrayToTree.Tree<CourseOutlineDocument>[]> = {
      data: resultData,
      message: messages.retrieved,
      statusText: statuses.success,
    };
    return res.status(StatusCodes.OK).json(response);
  }
);
