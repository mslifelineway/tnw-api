import { Model, Document, Schema } from "mongoose";
import { UserDocument } from "../user/types";

export interface Course {
  name: string;
  slug: string;
  description: string;
  keywords?: string;
  user: Schema.Types.ObjectId;
  active: boolean;
  deleted: boolean;
}

export interface CourseDocument extends Course, Document {}

export interface CourseModel extends Model<CourseDocument> {}
