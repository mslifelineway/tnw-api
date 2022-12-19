import { Course } from "../models";
import { CourseDocument, CourseModel } from "../models/course/types";
import {
  getOne,
  createOne,
  updateOne,
  deleteOne,
  getAll,
  restoreOne,
  deleteOnePermanently,
  updateStatusOne,
} from "./handlerFactory";

export const getAllCourses = getAll<CourseDocument, CourseModel>(Course);

export const createCourse = createOne<CourseDocument, CourseModel>(Course);

export const getCourse = getOne<CourseDocument, CourseModel>(Course);

export const updateCourse = updateOne<CourseDocument, CourseModel>(Course);

export const updateCourseStatus = updateStatusOne<CourseDocument, CourseModel>(
  Course
);

export const restoreCourse = restoreOne<CourseDocument, CourseModel>(Course);

export const deleteCourse = deleteOne<CourseDocument, CourseModel>(Course);

export const deleteCoursePermanently = deleteOnePermanently<
  CourseDocument,
  CourseModel
>(Course);
