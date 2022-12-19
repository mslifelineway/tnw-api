import { Schema } from "mongoose";
import {
  checkChangedPasswordAfterTokenIssued,
  correctPassword,
  createPasswordResetToken,
} from "./methods";
import validator from "validator";
import { UserDocument } from "./types";
import {
  hashPassword,
  omitFields,
  updatePasswordChangedAt,
} from "./middlewares";
import { DEFAULT_SCHEMA_PROPS } from "../../utils/constants";
import { Role } from "../../types";

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide your name!"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please provide your email!"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email!"],
    },
    phone: {
      type: String,
      trim: true,
      required: [true, "Please provide the phone number!"],
      validate: [
        validator.isMobilePhone,
        "Please provide a valid phone number!",
      ],
    },
    about: {
      type: String,
      trim: true,
      max: [150, "About can contains maximum 150 chars!"],
    },
    photo: String,
    password: {
      type: String,
      trim: true,
      required: [true, "Please provide the password!"],
      minlength: [8, "Password must have at least 8 characters!"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password!"],
      validate: {
        validator: function (this: UserDocument, el: string) {
          return el === this.password;
        },
        message: "Password and confirm password didn't match!",
      },
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      enum: Role,
      default: Role.admin,
    },
    active: {
      type: Boolean,
      default: true,
    },
    deleted: { type: Boolean, default: false },
  },
  DEFAULT_SCHEMA_PROPS
);

userSchema.index({ "$**": "text" });

userSchema.methods.correctPassword = correctPassword;
userSchema.methods.checkChangedPasswordAfterTokenIssued =
  checkChangedPasswordAfterTokenIssued;
userSchema.methods.createPasswordResetToken = createPasswordResetToken;

userSchema.pre("save", hashPassword);
userSchema.pre("save", updatePasswordChangedAt);

// userSchema.post(/^findOne/, omitFields);

export default userSchema;
