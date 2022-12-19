import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { UserDocument } from "../models/user/types";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { promisify } from "util";
import { sendEmail } from "../utils/email";
import {
  ExpressRequest,
  ResponseType,
  SendEmailOptions,
  UserJWTToken,
} from "../types";
import crypto from "crypto";
import {
  cookies,
  defaultCookieOptions,
  messages,
  statuses,
} from "../utils/constants";
import {
  generateResetLink,
  generateResetPasswordLink,
} from "../utils/resetPassword";

const signToken = (user: UserDocument) => {
  const payload = {
    id: user._id,
    name: user.name,
    email: user.email,
  };
  return (
    process.env.JWT_SECRET &&
    jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    })
  );
};

const createTokenAndSendResponse = (
  user: UserDocument,
  statusCode: number,
  res: Response,
  message: string
) => {
  const token = signToken(user);
  const expiresIn: number = Number(process.env.JWT_COOKIE_EXPIRES_IN || 1);
  const cookieOptions = {
    ...defaultCookieOptions,
    expires: new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000),
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  res.cookie(cookies.jwt, token, cookieOptions);
  const payload = {
    name: user.name,
    email: user.email,
    photo: user.photo,
    role: user.role,
  };
  const response: ResponseType<typeof payload> = {
    data: payload,
    message,
    statusText: statuses.success,
  };
  return res.status(statusCode).json(response);
};

export const signUp = catchAsync(async (req: Request, res: Response) => {
  const {
    name,
    email,
    phone,
    password,
    passwordConfirm,
    passwordChangedAt,
    role,
  } = req.body;
  const user: UserDocument = await User.create({
    name,
    email,
    phone,
    password,
    passwordConfirm,
    passwordChangedAt,
    role,
  });

  user.password = undefined;
  user.active = undefined;
  user.deleted = undefined;

  const response: ResponseType<UserDocument> = {
    data: user,
    message: messages.created,
    statusText: statuses.success,
  };
  res.status(StatusCodes.CREATED).json(response);
});

export const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user: UserDocument | null = await User.findOne({ email }).select(
      "+password"
    );
    if (!user) {
      return next(
        new AppError(messages.accountNotFound, StatusCodes.UNAUTHORIZED)
      );
    }

    if (!(await user.correctPassword(password, user.password || ""))) {
      return next(
        new AppError(messages.incorrectCredentials, StatusCodes.UNAUTHORIZED)
      );
    }

    if (!user.active) {
      return next(
        new AppError(messages.accountInactive, StatusCodes.UNAUTHORIZED)
      );
    }
    if (user.deleted) {
      return next(
        new AppError(messages.accountDisabled, StatusCodes.UNAUTHORIZED)
      );
    }
    createTokenAndSendResponse(
      user,
      StatusCodes.OK,
      res,
      messages.loginSuccess
    );
  }
);

/**
 * It checks for jwt cookie
 * It checks for current user account is active and not deleted
 */
export const protect = catchAsync(
  async (req: ExpressRequest, _: Response, next: NextFunction) => {
    let token;
    if (req.cookies[cookies.jwt]) token = req.cookies[cookies.jwt];

    if (!token)
      return next(new AppError(messages.notLoggedIn, StatusCodes.UNAUTHORIZED));

    const promise = promisify<string, string>(jwt.verify);
    const decoded = await promise(token, process.env.JWT_SECRET || "");
    const tokenPayload: UserJWTToken = JSON.parse(JSON.stringify(decoded));

    if (!tokenPayload)
      return next(new AppError(messages.notLoggedIn, StatusCodes.UNAUTHORIZED));

    const freshUser = await User.findById(tokenPayload.id);
    if (!freshUser)
      return next(
        new AppError(messages.tokenAccountNotExists, StatusCodes.BAD_REQUEST)
      );

    if (freshUser.checkChangedPasswordAfterTokenIssued(tokenPayload.iat))
      return next(
        new AppError(messages.passwordRecentlyChanged, StatusCodes.UNAUTHORIZED)
      );

    if (!freshUser.active)
      return next(
        new AppError(messages.accountInactive, StatusCodes.UNAUTHORIZED)
      );

    if (freshUser.deleted)
      return next(
        new AppError(messages.accountDisabled, StatusCodes.UNAUTHORIZED)
      );

    req.user = freshUser;
    next();
  }
);

export const restrictTo = (roles: string[]) => {
  return (req: ExpressRequest, _: Response, next: NextFunction) => {
    const loggedInUser: UserDocument | undefined = req.user;
    if (!loggedInUser) {
      return next(new AppError(messages.notLoggedIn, StatusCodes.UNAUTHORIZED));
    }
    if (!roles.includes(loggedInUser.role || "")) {
      return next(new AppError(messages.accessDenied, StatusCodes.FORBIDDEN));
    }
    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.email) {
      return next(
        new AppError(messages.emailRequired, StatusCodes.BAD_REQUEST)
      );
    }

    const user: UserDocument | null = await User.findOne({
      email: req.body.email,
    });
    if (!user || !user.email) {
      return next(
        new AppError(messages.accountNotFound, StatusCodes.BAD_REQUEST)
      );
    }

    const resetToken = user.createPasswordResetToken();
    user.save({ validateBeforeSave: false });

    const resetURL = generateResetLink(req, resetToken);

    const message = generateResetPasswordLink(resetURL);

    const emailOptions: SendEmailOptions = {
      mailTo: user.email,
      subject: messages.resetPasswordToken,
      message,
    };

    try {
      await sendEmail(emailOptions);

      const response: ResponseType<undefined> = {
        data: undefined,
        message: "Token sent to your email address!",
        statusText: statuses.success,
      };
      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      user.save({ validateBeforeSave: false });

      return next(
        new AppError(messages.emailFailed, StatusCodes.INTERNAL_SERVER_ERROR)
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { resetToken } = req.params;
    if (!resetToken) {
      return next(new AppError("Inavlid access! Reset token is missing!", 400));
    }

    const encryptedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user: UserDocument | null = await User.findOne({
      passwordResetToken: encryptedResetToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(new AppError("Token is not valid or has expired!", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    user.active = true;

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    createTokenAndSendResponse(
      user,
      200,
      res,
      "Password resetted successfully!"
    );
  }
);

export const updatePassword = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword, passwordConfirm } = req.body;
    if (!currentPassword || !newPassword || !passwordConfirm) {
      return next(
        new AppError(
          messages.updatePasswordMissingFields,
          StatusCodes.BAD_REQUEST
        )
      );
    }

    const user = await User.findById(req.user?.id).select("+password");
    if (!user) {
      return next(
        new AppError(messages.accountNotFound, StatusCodes.BAD_REQUEST)
      );
    }

    if (!(await user.correctPassword(currentPassword, user.password || ""))) {
      return next(new AppError(messages.incorrectCurrentPassword, 401));
    }

    user.password = newPassword;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    createTokenAndSendResponse(
      user,
      StatusCodes.OK,
      res,
      messages.resetPasswordSuccess
    );
  }
);

export const signout = catchAsync(async (_: ExpressRequest, res: Response) => {
  const cookieOptions = {
    ...defaultCookieOptions,
    expires: new Date(Date.now() + 10 * 1000),
  };
  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }
  res.cookie(cookies.jwt, "", cookieOptions);

  const response: ResponseType<undefined> = {
    data: undefined,
    message: messages.logoutSuccess,
    statusText: statuses.success,
  };
  return res.status(StatusCodes.OK).json(response);
});
