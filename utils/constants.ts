import { CorsOptions } from "cors";
import path from "path";

export const STATIC_FOLDER_PATH: string = path.join(__dirname, "../static");

export const DEFAULT_SCHEMA_PROPS = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  versionKey: false,
};

export const USERS_SAMPLE_JSON_PATH: string = path.join(
  __dirname,
  "../data/users.json"
);
export const POST_SAMPLE_JSON_PATH: string = path.join(
  __dirname,
  "../data/posts.json"
);
export const COURSE_SAMPLE_JSON_PATH: string = path.join(
  __dirname,
  "../data/courses.json"
);
export const COURSE_OUTLINE_SAMPLE_JSON_PATH: string = path.join(
  __dirname,
  "../data/courseoutlines.json"
);

export const corsOptions: CorsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};

export const messages = {
  accessDenied: "You don't have permission to perform this action!",
  accountInactive:
    "Sorry, your account is inactive! Please contact to administration.",
  accountDisabled:
    "Sorry, your account is temporarily disabled! Please contact to administration.",
  accountNotFound: "Sorry, the account couldn't be found!",
  accountDeleted: "Account temporarily deleted!",
  accountDeletedPermanently: "Account deleted permanently!",
  created: "Created successfully!",
  courseOutlineIdRequired: "Course outline id is required!",
  courseCouldNotBeFound: "Course could not be found!",
  courseIsNotAvailable: "This course is no longer available!",
  comingSoon: "Coming soon!",
  deleted: "Deleted successfully!",
  deletedPermanently: "Deleted permanently!",
  documentNotFoundWithId: "Document couldn't be found!",
  emailRequired: "Please provide your email address!",
  emailFailed:
    "There was an error in sending the email. Please try again later!",
  incorrectCredentials: "Incorrect credentials!",
  incorrectCurrentPassword: "Your current password is incorrect!",
  loginSuccess: "You are logged in!",
  logoutSuccess: "Thank you for visit!.",
  notLoggedIn: "You are not logged in! Please login to get access.",
  passwordRecentlyChanged: "Password has changed recently! Please login again.",
  passwordCouldNotBeUpdatedHere: "Password couldn't be updated here!",
  resetPasswordToken: "Your password reset token (valid for 10 minutes)",
  resetPasswordSuccess: "Password updated successfully!",
  restored: "Restored successfully!",
  retrieved: "Retrieved successfully!",
  seemsNotLoggedIn:
    "It seems you're not logged in, Please login and try again!",
  statusUpdated: "Status updated successfully!",
  somethingWentWrong: "Something went wrong! Please try again.",
  tokenAccountNotExists:
    "The account belonging to this token is no longer exists!",
  updatePasswordMissingFields:
    "Please provide the current password, new password and passwordConfirm.",
  userIdRequired: "Please provide the userId!",
  updated: "Updated successfully!",
};

//cookie
export const cookies = {
  jwt: "jwt",
};
export const defaultCookieOptions = {
  secure: false,
  httpOnly: true,
};

export const statuses = {
  success: "success",
  error: "error",
  failed: "failed",
};

export const routePaths = {
  api: "/api/v1",
  root: "/",

  users: `/users`,
  courses: `/courses`,
  courseOutlines: `/courseOutlines`,
  posts: `/posts`,

  signout: "/signout",
  signin: "/signin",
  forgotPassword: "/forgotPassword",
  resetPassword: "/resetPassword/:resetToken",
  updatePassword: "/updatePassword",
  signup: "/signup",

  getAll: "/getAll",
  usersByRole: "/role/:role",
  usersByRoleAndActive: "/role/:role/active",
  usersByRoleAndInActive: "/role/:role/inactive",
  usersByRoleAndDeleted: "/role/:role/deleted",
  loginInfo: "/loginInfo",
  profile: "/profile/:id",
  updateMe: "/updateMe",
  deleteMe: "/deleteMe",
  deleteMePermanently: "/deleteMePermanently",
  getUserById: "/details/:id",
  // updateStatusById: "/updateStatus/:id",
  deleteUserById: "/delete/:id",
  deletedUserByIdPermanently: "/deletePermanently/:id",

  create: "/create",
  active: "/active",
  inactive: "/inactive",
  deleted: "/deleted",
  bySlug: "/slug/:slug",
  viewById: "/view/:id",
  detailsById: "/details/:id",
  updateById: "/update/:id",
  updateStatusById: "/updateStatus/:id",
  deleteById: "/delete/:id",
  deletePermanentlyById: "/deletePermanently/:id",
  restoreById: "/restore/:id",

  byCourseId: "/:courseId",
  byCourseSlug: "/slug/:courseSlug",
  byCourseOutlineId: "/:courseOutlineId",
};

export const urls = {
  resetTokenUrl: `${routePaths.api}${routePaths.users}/resetPasword`,
};

export const modelNames = {
  User: "User",
  Course: "Course",
  CourseOutline: "CourseOutline",
  Post: "Post",
};

export const courseOutlineStatus = {
  outline: "outline",
  subOutline1: "subOutline1",
  subOutline2: "subOutline2",
};
