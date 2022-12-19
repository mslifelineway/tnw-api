import { Request, Response, NextFunction } from "express";
import { addFilters, slugifyString } from "../utils/helpers";

export const filterByRole = (req: Request, _: Response, next: NextFunction) => {
  addFilters(req, {
    role: req.params.role,
  });
  return next();
};

export const activeFilter = (req: Request, _: Response, next: NextFunction) => {
  addFilters(req, {
    active: true,
    deleted: false,
  });
  return next();
};

export const inactiveFilter = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  addFilters(req, {
    active: false,
    deleted: false,
  });
  return next();
};

export const deleteFilter = (req: Request, _: Response, next: NextFunction) => {
  addFilters(req, {
    deleted: true,
  });
  return next();
};

export const slugFilter = (req: Request, _: Response, next: NextFunction) => {
  addFilters(req, {
    slug: slugifyString(req.params.slug),
  });
  return next();
};

export const idFilter = (req: Request, _: Response, next: NextFunction) => {
  addFilters(req, {
    _id: req.params.id,
  });
  return next();
};
