import { model } from "mongoose";
import { UserModel, UserDocument } from "./types";
import userSchema from "./schema";
import { modelNames } from "../../utils/constants";

export const User: UserModel = model<UserDocument>(modelNames.User, userSchema);
