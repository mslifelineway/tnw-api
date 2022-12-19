import { protect, signUp } from "../controllers/auth.controller";
import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUserStatus,
  updateMe,
  deleteMe,
  deleteUserPermanently,
  deleteMePermanently,
  restoreUser,
  getProfile,
} from "../controllers";
import {
  restrictToAdmin,
  filterByRole,
  filterByLoggedInUserId,
  validateAndFilterUserUpdateFields,
  addUserIdToParam,
  excludeMe,
  activeFilter,
  inactiveFilter,
  deleteFilter,
} from "../middlewares";
import { routePaths } from "../utils/constants";

const router = express.Router();

router.use(protect, restrictToAdmin);

router.route(routePaths.root).get(excludeMe, getAllUsers);
router.route(routePaths.create).post(signUp);
router.route(routePaths.usersByRole).get(filterByRole, excludeMe, getAllUsers);

router
  .route(routePaths.usersByRoleAndActive)
  .get(filterByRole, activeFilter, excludeMe, getAllUsers);
router
  .route(routePaths.usersByRoleAndInActive)
  .get(filterByRole, inactiveFilter, excludeMe, getAllUsers);
router
  .route(routePaths.usersByRoleAndDeleted)
  .get(filterByRole, deleteFilter, excludeMe, getAllUsers);

//action on itself
router.get(routePaths.loginInfo, filterByLoggedInUserId, getUser);
router.get(routePaths.profile, getProfile);
router.patch(
  routePaths.updateMe,
  addUserIdToParam,
  validateAndFilterUserUpdateFields,
  updateMe
);
router.delete(routePaths.deleteMe, deleteMe);
router.delete(routePaths.deleteMePermanently, deleteMePermanently);

//action on others
router.get(routePaths.getUserById, getUser);
router.patch(routePaths.updateStatusById, updateUserStatus);
router.patch(routePaths.restoreById, restoreUser);
router.delete(routePaths.deleteUserById, deleteUser);
router.delete(routePaths.deletedUserByIdPermanently, deleteUserPermanently);

export default router;
