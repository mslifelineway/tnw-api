import express from "express";
import {
  forgotPassword,
  signin,
  signout,
  protect,
  resetPassword,
  updatePassword,
} from "../controllers";
import { validateLoginCredentials } from "../middlewares";
import { routePaths } from "../utils/constants";

const router = express.Router();

// router.post("/signup", signUp); //Signup feature is not ebabled for the client for now. In the future, It might be used
router.get(routePaths.signout, signout);
router.post(routePaths.signin, validateLoginCredentials, signin);
router.post(routePaths.forgotPassword, forgotPassword);
router.patch(routePaths.resetPassword, resetPassword);

router.patch(routePaths.updatePassword, protect, updatePassword);

export default router;
