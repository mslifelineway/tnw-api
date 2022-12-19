import mongoose, { Schema } from "mongoose";
import { DEFAULT_SCHEMA_PROPS, modelNames } from "../../utils/constants";
import { slugifyCourseName, populateUser } from "./middlewares";
import { CourseDocument } from "./types";

const courseSchema = new mongoose.Schema<CourseDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Course name is required!"],
      maxlength: [50, "Course name can contains maximum 50 characters!"],
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      index: true,
    },
    keywords: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [250, "Description can contains maximum 250 characters!"],
    },
    user: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: modelNames.User,
    },
    active: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  DEFAULT_SCHEMA_PROPS
);

courseSchema.index({ "$**": "text" });

courseSchema.pre("save", slugifyCourseName);
courseSchema.pre(/^find/, populateUser);

export default courseSchema;
