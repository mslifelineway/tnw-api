import { StatusCodes } from "http-status-codes";
import { Document, Schema, Types } from "mongoose";
import slugify from "slugify";
import { User } from "../models/user/types";
import { ExpressRequest } from "../types";

export class CustomError extends Error {
  status = StatusCodes.BAD_REQUEST;

  constructor(status: number, message: string) {
    super(message);

    this.status = status;

    // 👇️ because we are extending a built-in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  getErrorMessage() {
    return "Something went wrong: " + this.message;
  }
}

export const copyData = <T>(data: T): T => {
  return JSON.parse(JSON.stringify(data));
};

const findParentAndPush = <TDoc extends Document>(
  docs: TDoc[],
  child: TDoc | any
) => {
  docs.forEach((doc: TDoc | any) => {
    if (doc.id === child.parent) {
      delete child.parent;
      if (doc.children) doc.children.push(child);
      else doc.children = [child];
      return doc;
    } else if (doc.children && doc.children.length > 0) {
      findParentAndPush(doc.children, child);
    }
  });
};

export const filterUserAllowedFields = (
  user: User,
  allowedFields: string[]
): User => {
  const newObj: User = { ...user };
  Object.keys(user).forEach((field) => {
    if (!allowedFields.includes(field)) {
      newObj[field as keyof User] = undefined;
    }
  });
  return newObj;
};

export const isRequestContainsFilterObject = (req: ExpressRequest): boolean => {
  return (
    req.filter && typeof req.filter === "object" && !Array.isArray(req.filter)
  );
};

export const addFilters = (req: ExpressRequest, currentFilter: object) => {
  const checkCurrentFilter =
    currentFilter &&
    typeof currentFilter === "object" &&
    !Array.isArray(currentFilter);

  if (!checkCurrentFilter) {
    return;
  }

  if (isRequestContainsFilterObject(req)) {
    req.filter = {
      ...req.filter,
      ...currentFilter,
    };
  } else {
    req.filter = currentFilter;
  }
};

export const slugifyString = (str: string): string => {
  return slugify(str, { lower: true });
};

export const joinStrings = (...rest: string[]): string => {
  return rest.join("");
};
