import { StatusCodes } from "http-status-codes";
import { CourseDocument } from "./../models/course/types";
import { NextFunction, Response } from "express";
import { ExpressRequest } from "../types";
import { addFilters } from "../utils/helpers";
import { getCourseBySlug } from "./course.middleware";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { messages } from "../utils/constants";

export const checkAndApplyCourseFilter = catchAsync(
  async (req: ExpressRequest, _: Response, next: NextFunction) => {
    let courseFilter = {};
    if (req.params.courseId) {
      courseFilter = {
        ...courseFilter,
        course: { $eq: req.params.courseId, $ne: null },
      };
    }

    if (req.params.courseSlug) {
      const course: CourseDocument | null = await getCourseBySlug(
        req.params.courseSlug
      );
      if (!course) {
        return next(
          new AppError(messages.documentNotFoundWithId, StatusCodes.BAD_REQUEST)
        );
      }
      courseFilter = {
        ...courseFilter,
        course: { $eq: course._id, $ne: null },
      };
    }

    if (Object.keys(courseFilter).length !== 0)
      courseFilter = { ...courseFilter, parent: { $eq: null } };
    addFilters(req, courseFilter);
    return next();
  }
);

export const filterCourseOutlinesByCourseOutlineId = (
  req: ExpressRequest,
  _: Response,
  next: NextFunction
) => {
  addFilters(req, {
    parent: req.params.courseOutlineId,
  });
  return next();
};

export const limitCourseOutlinesFields = (
  req: ExpressRequest,
  _: Response,
  next: NextFunction
) => {
  req.query.fields = "_id id name slug course";
  return next();
};
