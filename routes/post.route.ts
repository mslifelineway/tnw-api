import express from "express";
import {
  protect,
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  updatePostStatus,
  restorePost,
  deletePostPermanently,
  getPostDetails,
} from "../controllers";
import {
  activeFilter,
  addUserIdToRequestBody,
  deleteFilter,
  filterByCourseOutlineId,
  idFilter,
  inactiveFilter,
  restrictToAdmin,
  slugFilter,
} from "../middlewares";
import { routePaths } from "../utils/constants";

const router = express.Router({ mergeParams: true });

//for global access
router.get(routePaths.root, filterByCourseOutlineId, activeFilter, getAllPosts);

//for admins only and protected
router.use(protect, restrictToAdmin);

router.post(routePaths.create, addUserIdToRequestBody, createPost);

router.get(routePaths.getAll, filterByCourseOutlineId, getAllPosts);
router.get(routePaths.bySlug, slugFilter, getAllPosts); //slug is not unique for post
router.get(routePaths.viewById, idFilter, getPost);
router.get(routePaths.detailsById, idFilter, getPostDetails);

router.get(routePaths.active, activeFilter, getAllPosts);
router.get(routePaths.inactive, inactiveFilter, getAllPosts);
router.get(routePaths.deleted, deleteFilter, getAllPosts);

//TODO: NEED TO VALIDATE AND FILTER THE UPDTE COURSE OBJECT
router.patch(routePaths.updateById, updatePost);
router.patch(routePaths.updateStatusById, updatePostStatus);
router.patch(routePaths.restoreById, restorePost);

router.delete(routePaths.deleteById, deletePost);
router.delete(routePaths.deletePermanentlyById, deletePostPermanently);

export default router;
