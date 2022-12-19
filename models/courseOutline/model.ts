import { model } from "mongoose";
import { modelNames } from "../../utils/constants";
import courseOutlineSchema from "./schema";
import { CourseOutlineDocument, CourseOutlineModel } from "./types";

export const CourseOutline: CourseOutlineModel = model<CourseOutlineDocument>(
  modelNames.CourseOutline,
  courseOutlineSchema
);
