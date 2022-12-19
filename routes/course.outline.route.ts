import express from "express";
import postRouter from "./post.route";
import {
  protect,
  getAllCourseOutlines,
  createCourseOutline,
  updateCourseOutline,
  deleteCourseOutline,
  deleteCourseOutlinePermanently,
  restoreCourseOutline,
  updateCourseOutlineStatus,
  getCourseOutlineByIdWithParentsAndCouse,
  getAllCourseOutlinesBySlug,
} from "../controllers";
import {
  activeFilter,
  addUserIdToRequestBody,
  deleteFilter,
  checkAndApplyCourseFilter,
  idFilter,
  inactiveFilter,
  restrictToAdmin,
  slugFilter,
  filterCourseOutlinesByCourseOutlineId,
  limitCourseOutlinesFields,
} from "../middlewares";
import { routePaths } from "../utils/constants";
import { joinStrings } from "../utils/helpers";

const router = express.Router({ mergeParams: true });

//for global access - only active and not delted records

/**
 * checkAndApplyCourseFilter : It checks whether course filter need to be applied.
 * checkAndApplyCourseFilter : apply when this route is hitting from course route. It may contain either courseId or courseSlug in params
 */
// router
//   .route(routePaths.root)
//   .get(
//     checkAndApplyCourseFilter,
//     activeFilter,
//     limitCourseOutlinesFields,
//     getAllCourseOutlines
//   );
router.route(routePaths.root).get(getAllCourseOutlinesBySlug);

router.use(
  joinStrings(routePaths.byCourseOutlineId, routePaths.posts),
  postRouter
);

router.use(protect, restrictToAdmin);

router.post(routePaths.create, addUserIdToRequestBody, createCourseOutline);

router
  .route(routePaths.getAll)
  .get(checkAndApplyCourseFilter, getAllCourseOutlines);

//get sub course outlines
router
  .route(joinStrings(routePaths.byCourseOutlineId, routePaths.getAll))
  .get(filterCourseOutlinesByCourseOutlineId, getAllCourseOutlines);

//slug is not unique
router.get(
  routePaths.bySlug,
  checkAndApplyCourseFilter,
  slugFilter,
  getAllCourseOutlines
);
router.get(
  routePaths.detailsById,
  idFilter,
  getCourseOutlineByIdWithParentsAndCouse
);

router.get(
  routePaths.active,
  checkAndApplyCourseFilter,
  activeFilter,
  getAllCourseOutlines
);
router.get(
  routePaths.inactive,
  checkAndApplyCourseFilter,
  inactiveFilter,
  getAllCourseOutlines
);
router.get(
  routePaths.deleted,
  checkAndApplyCourseFilter,
  deleteFilter,
  getAllCourseOutlines
);

//TODO: NEED TO VALIDATE AND FILTER THE UPDTE COURSE OUTLINE OBJECT
router.patch(routePaths.updateById, updateCourseOutline);
router.patch(routePaths.updateStatusById, updateCourseOutlineStatus);
router.patch(routePaths.restoreById, restoreCourseOutline);

router.delete(routePaths.deleteById, deleteCourseOutline);
router.delete(routePaths.deletePermanentlyById, deleteCourseOutlinePermanently);

export default router;
