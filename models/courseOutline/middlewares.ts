import { slugifyString } from "../../utils/helpers";
import { CourseOutlineDocument } from "./types";

export const slugifyCourseOutlineName = function (
  this: CourseOutlineDocument,
  next: Function
) {
  if (this.name) this.slug = slugifyString(this.name);
  next();
};

export const populateUser = function (
  this: CourseOutlineDocument,
  next: Function
) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
};

export const populateCourse = function (
  this: CourseOutlineDocument,
  next: Function
) {
  this.populate({
    path: "course",
    select: "name",
  });
  next();
};
