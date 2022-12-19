import { slugifyString } from "../../utils/helpers";
import { CourseDocument } from "./types";

export const slugifyCourseName = function (
  this: CourseDocument,
  next: Function
) {
  if (this.name) this.slug = slugifyString(this.name);
  next();
};

export const populateUser = function (this: CourseDocument, next: Function) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
};
