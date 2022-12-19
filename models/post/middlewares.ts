import { slugifyString } from "../../utils/helpers";
import { PostDocument } from "./types";

export const slugifyPostTitle = function (this: PostDocument, next: Function) {
  if (this.title) this.slug = slugifyString(this.title);
  next();
};

export const populateUser = function (this: PostDocument, next: Function) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
};
