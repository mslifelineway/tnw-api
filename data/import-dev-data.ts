import dotenv from "dotenv";
import fs from "fs";
import mongoose from "mongoose";
import {
  POST_SAMPLE_JSON_PATH,
  COURSE_SAMPLE_JSON_PATH,
  COURSE_OUTLINE_SAMPLE_JSON_PATH,
  USERS_SAMPLE_JSON_PATH,
} from "../utils/constants";
import path from "path";
import { User, Course, CourseOutline, Post } from "../models";

dotenv.config({ path: path.join(__dirname, "../../config.env") });

//mongo database connection
const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE || "theninzaworld");
    console.log("==> Aaw! Database connected!");
  } catch (error) {
    console.log("==> Database connection error: ", error);
  }
};

connectDatabase();
//mongo database connection - end

//READ THE JSON FILE
const users = JSON.parse(fs.readFileSync(USERS_SAMPLE_JSON_PATH, "utf-8"));
const posts = JSON.parse(fs.readFileSync(POST_SAMPLE_JSON_PATH, "utf-8"));
const courses = JSON.parse(fs.readFileSync(COURSE_SAMPLE_JSON_PATH, "utf-8"));
const courseOutlines = JSON.parse(
  fs.readFileSync(COURSE_OUTLINE_SAMPLE_JSON_PATH, "utf-8")
);

//IMPORT TOURS DATA INTO DATABASE
const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Course.create(courses, { validateBeforeSave: false });
    await CourseOutline.create(courseOutlines, { validateBeforeSave: false });
    await Post.create(posts, { validateBeforeSave: false });
    console.log("===> Data are inserted!");
    process.exit();
  } catch (error) {
    console.log(error, "==> error while importing data");
  }
};

//DELETE ALL TOURS DATA FROM THE COLLECTIONS
const deleteData = async () => {
  try {
    await Post.deleteMany();
    await CourseOutline.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    console.log("===> Data deleted!");
    process.exit();
  } catch (error) {
    console.log(error, "==> error while deleteing tours");
  }
};

switch (process.argv[2]) {
  case "--import":
    importData();
    break;
  case "--delete":
    deleteData();
    break;
  default:
    break;
}
