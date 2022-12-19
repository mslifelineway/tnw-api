import { Error, MongooseError } from "mongoose";

export interface MongoDbErrorsInterface {
  name: {
    name: string;
    message: string;
    properties: {
      message: string;
      type: string;
      minlength: number;
      path: string;
      value: string;
    };
    kind: string;
    path: string;
    value: string;
  };
}
export interface MongooseErrorInterface {
  errors?: MongoDbErrorsInterface;
  name: string;
  // _message?: string

  code?: number | undefined;
  path?: string | undefined;
  errmsg?: string | undefined;
  value?: string | undefined;
}

export interface AppErrorInterface extends MongooseErrorInterface {
  statusCode: number;
  isOperational?: boolean;
  status?: string | undefined;
  stack?: string | undefined;
  message: string;
}

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  status: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
