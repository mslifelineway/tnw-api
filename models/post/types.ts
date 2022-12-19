import { UserDocument } from "./../user/types";
import { Model, Document, Schema } from "mongoose";
import { CourseOutline } from "../courseOutline/types";

export interface Post {
  title: string;
  slug: string;
  content: string;
  keywords?: string;
  active: boolean;
  deleted: boolean;
  courseOutline: Schema.Types.ObjectId | CourseOutline;
  user: Schema.Types.ObjectId | UserDocument;
}

export interface PostDocument extends Post, Document {}

export interface PostModel extends Model<PostDocument> {}
