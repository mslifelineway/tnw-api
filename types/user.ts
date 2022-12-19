import { User, UserDocument } from "../models/user/types";

export type UserProfile = User & {
  totalCourses: number;
  totalCourseOutlines: number;
  totalPosts: number;
};
