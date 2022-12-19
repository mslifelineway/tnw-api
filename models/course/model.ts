import { model } from "mongoose";
import { modelNames } from "../../utils/constants";
import courseSchema from "./schema";
import { CourseDocument, CourseModel } from "./types";

export const Course: CourseModel = model<CourseDocument>(
  modelNames.Course,
  courseSchema
);
