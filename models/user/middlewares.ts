import bcrypt from "bcryptjs";
import { UserDocument } from "./types";
import _ from "lodash";

export const hashPassword = async function (
  this: UserDocument,
  next: Function
) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password || "", 12);
  this.passwordConfirm = undefined;
  next();
};

export const updatePasswordChangedAt = async function (
  this: UserDocument,
  next: Function
) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
};

export const omitFields = async function (doc: UserDocument, next: Function) {
  //TODO: OMIT (EXCLUDE) UNNECESSARY fields
  next();
};
