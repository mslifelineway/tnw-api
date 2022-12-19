import { Course } from "../models";
import { CourseDocument } from "../models/course/types";
import { slugifyString } from "../utils/helpers";

export const getCourseBySlug = async (
  slug: string
): Promise<CourseDocument | null> =>
  await Course.findOne({ slug: slugifyString(slug) });
