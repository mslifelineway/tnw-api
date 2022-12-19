import express from "express";
import courseOutlineRouter from "./course.outline.route";
import {
  protect,
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  restoreCourse,
  deleteCoursePermanently,
  updateCourseStatus,
} from "../controllers";
import {
  activeFilter,
  addUserIdToRequestBody,
  deleteFilter,
  idFilter,
  inactiveFilter,
  restrictToAdmin,
  slugFilter,
} from "../middlewares";
import { routePaths } from "../utils/constants";
import { joinStrings } from "../utils/helpers";

const router = express.Router();

//for global access
router.route(routePaths.root).get(activeFilter, getAllCourses);
router.use(
  joinStrings(routePaths.byCourseSlug, routePaths.courseOutlines),
  courseOutlineRouter
);
router.use(
  joinStrings(routePaths.byCourseId, routePaths.courseOutlines),
  courseOutlineRouter
);

router.use(protect, restrictToAdmin);

router.post(routePaths.create, addUserIdToRequestBody, createCourse);

router.route(routePaths.getAll).get(getAllCourses);
router.get(routePaths.bySlug, slugFilter, getCourse);
router.get(routePaths.detailsById, idFilter, getCourse);

router.get(routePaths.active, activeFilter, getAllCourses);
router.get(routePaths.inactive, inactiveFilter, getAllCourses);
router.get(routePaths.deleted, deleteFilter, getAllCourses);

//TODO: NEED TO VALIDATE AND FILTER THE UPDTE COURSE OBJECT
router.patch(routePaths.updateById, updateCourse);
router.patch(routePaths.updateStatusById, updateCourseStatus);
router.patch(routePaths.restoreById, restoreCourse);

router.delete(routePaths.deleteById, deleteCourse);
router.delete(routePaths.deletePermanentlyById, deleteCoursePermanently);

export default router;
