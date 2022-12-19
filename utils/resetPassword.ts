import { Request } from "express";
import { urls } from "./constants";

export const getProtocol = (req: Request) => {
  return req.protocol;
};

export const getHost = (req: Request) => {
  return req.get("host");
};

export const generateResetLink = (req: Request, resetToken: string): string => {
  return `${getProtocol(req)}://${getHost(req)}/${
    urls.resetTokenUrl
  }/${resetToken}`;
};

export const generateResetPasswordLink = (resetURL: string): string => {
  return `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n 
  If You didn't forget your password, please ignore this email!`;
};
