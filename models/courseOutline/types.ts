import { CourseDocument } from "./../course/types";
import { Model, Document, Schema } from "mongoose";
import { UserDocument } from "../user/types";

export interface CourseOutline {
  name: string;
  slug: string;
  keywords?: string;
  course: Schema.Types.ObjectId | CourseDocument;
  user: Schema.Types.ObjectId | UserDocument;
  active: boolean;
  deleted: boolean;
  parent: Schema.Types.ObjectId | CourseOutline;
}

export interface CourseOutlineDocument extends CourseOutline, Document {}

export interface CourseOutlineModel extends Model<CourseOutlineDocument> {}
