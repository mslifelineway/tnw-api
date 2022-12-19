import mongoose, { Schema } from "mongoose";
import { DEFAULT_SCHEMA_PROPS, modelNames } from "../../utils/constants";
import { slugifyCourseOutlineName } from "./middlewares";
import { CourseOutlineDocument } from "./types";

const courseOutlineSchema = new mongoose.Schema<CourseOutlineDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Course outline name is required!"],
      maxlength: [100, "Course outline can contains maximum 100 characters!"],
    },
    slug: {
      type: String,
      trim: true,
      index: true,
    },
    keywords: {
      type: String,
      trim: true,
    },
    course: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: modelNames.Course,
    },
    user: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: modelNames.User,
    },
    active: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    parent: { type: Schema.Types.ObjectId, ref: modelNames.CourseOutline },
  },
  DEFAULT_SCHEMA_PROPS
);

courseOutlineSchema.index({ "$**": "text" });

courseOutlineSchema.pre("save", slugifyCourseOutlineName);

export default courseOutlineSchema;
