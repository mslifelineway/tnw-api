import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { UserDocument } from "../models/user/types";

export interface ExpressRequest extends Request {
  user?: UserDocument;
  filter?: any;
}

export interface UserJWTToken {
  id: ObjectId;
  name: string;
  email: string;
  iat: number;
  exp: number;
}

export interface SendEmailOptions {
  mailTo: string;
  subject: string;
  message: string;
}

export enum Status {
  pending = "pending",
  approved = "approved",
  rejected = "rejected",
}

export enum Role {
  admin = "admin",
  user = "user",
}

export interface ResponseType<T> {
  count?: number;
  data: T;
  message: string;
  statusText: string;
}
