import mongoose, { Schema } from "mongoose";
import { DEFAULT_SCHEMA_PROPS, modelNames } from "../../utils/constants";
import { slugifyPostTitle, populateUser } from "./middlewares";
import { PostDocument } from "./types";

const postSchema = new mongoose.Schema<PostDocument>(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "A post must have a title!"],
      maxlength: [2000, "A post title must have at maximum 2000 characters!"],
    },
    slug: {
      type: String,
      trim: true,
      index: true,
    },
    content: {
      type: String,
      trim: true,
      required: [true, "A post must have content!"],
    },
    keywords: {
      type: String,
      trim: true,
    },
    active: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    courseOutline: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: modelNames.CourseOutline,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: modelNames.User,
    },
  },
  DEFAULT_SCHEMA_PROPS
);

postSchema.index({ "$**": "text" });

postSchema.pre("save", slugifyPostTitle);
postSchema.pre(/^find/, populateUser);

export default postSchema;
