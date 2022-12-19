import { Request, NextFunction, Response } from "express";
import { addFilters } from "../utils/helpers";

export const filterByCourseOutlineId = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  if (req.params.courseOutlineId)
    addFilters(req, {
      courseOutline: req.params.courseOutlineId,
    });
  return next();
};
