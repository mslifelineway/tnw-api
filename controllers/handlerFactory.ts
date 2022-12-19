import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { APIFeatures } from "../utils/apiFeatures";
import { Document, Model, PopulateOptions } from "mongoose";
import { copyData, isRequestContainsFilterObject } from "../utils/helpers";
import { ExpressRequest, ResponseType } from "../types";
import { messages, statuses } from "../utils/constants";

export const createOne = <TDoc extends Document, TModel extends Model<TDoc>>(
  Model: TModel
) =>
  catchAsync(async (req: Request, res: Response) => {
    const doc: TDoc | null = await Model.create(req.body);

    const response: ResponseType<TDoc | null> = {
      data: doc,
      message: messages.created,
      statusText: statuses.success,
    };

    return res.status(StatusCodes.CREATED).json(response);
  });

/**
 * Update a document by ID
 * @param Model
 * @returns
 *
 */

export const updateOne = <TDoc extends Document, TModel extends Model<TDoc>>(
  Model: TModel
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log("====> user: ", req.params.id, req.body);

    const doc: TDoc | null = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc || doc === null) {
      return next(
        new AppError(messages.documentNotFoundWithId, StatusCodes.BAD_REQUEST)
      );
    }

    const response: ResponseType<TDoc | null> = {
      data: doc,
      message: messages.updated,
      statusText: statuses.success,
    };
    return res.status(StatusCodes.OK).json(response);
  });

/**
 * Update the status by id.
 * id must be provided in param
 * @param Model
 * @returns
 */
export const updateStatusOne = <
  TDoc extends Document & { active?: boolean },
  TModel extends Model<TDoc>
>(
  Model: TModel
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id) {
      return next(
        new AppError(messages.documentNotFoundWithId, StatusCodes.BAD_REQUEST)
      );
    }
    const doc: TDoc | null = await Model.findById(req.params.id);
    if (!doc || doc === null) {
      return next(
        new AppError(messages.documentNotFoundWithId, StatusCodes.BAD_REQUEST)
      );
    }
    // doc.active = !doc.active;
    const newDoc: TDoc | null = await Model.findByIdAndUpdate(
      id,
      { active: !doc.active },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!newDoc || newDoc === null) {
      return next(
        new AppError(
          messages.somethingWentWrong,
          StatusCodes.INTERNAL_SERVER_ERROR
        )
      );
    }
    const response: ResponseType<TDoc | null> = {
      data: newDoc,
      message: messages.statusUpdated,
      statusText: statuses.success,
    };
    return res.status(StatusCodes.OK).json(response);
  });

/**
 * Delete a document
 * @param Model
 * @returns
 *
 */

export const deleteOne = <TDoc extends Document, TModel extends Model<TDoc>>(
  Model: TModel
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc: TDoc | null = await Model.findByIdAndUpdate(
      req.params.id,
      { active: false, deleted: true },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(
        new AppError(messages.documentNotFoundWithId, StatusCodes.BAD_REQUEST)
      );
    }

    const response: ResponseType<null> = {
      data: null,
      message: messages.deleted,
      statusText: statuses.success,
    };

    return res.status(StatusCodes.NO_CONTENT).json(response);
  });

export const restoreOne = <TDoc extends Document, TModel extends Model<TDoc>>(
  Model: TModel
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc: TDoc | null = await Model.findByIdAndUpdate(
      req.params.id,
      { active: true, deleted: false },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!doc) {
      return next(
        new AppError(messages.documentNotFoundWithId, StatusCodes.BAD_REQUEST)
      );
    }

    const response: ResponseType<TDoc | null> = {
      data: doc,
      message: messages.restored,
      statusText: statuses.success,
    };

    return res.status(StatusCodes.OK).json(response);
  });

export const deleteOnePermanently = <
  TDoc extends Document,
  TModel extends Model<TDoc>
>(
  Model: TModel
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc: TDoc | null = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(messages.documentNotFoundWithId, StatusCodes.BAD_REQUEST)
      );
    }

    const response: ResponseType<null> = {
      data: null,
      message: messages.deletedPermanently,
      statusText: statuses.success,
    };

    return res.status(204).json(response);
  });

export const getOne = <TDoc extends Document, TModel extends Model<TDoc>>(
  Model: TModel,
  populateOptions?: PopulateOptions
) =>
  catchAsync(async (req: ExpressRequest, res: Response, next: NextFunction) => {
    let filter = {};

    const { id } = req.params;
    if (id) filter = { ...filter, id };

    if (isRequestContainsFilterObject(req))
      filter = { ...filter, ...req.filter };

    let query: any = Model.findOne(filter);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc: TDoc = await query;
    if (!doc) {
      return next(
        new AppError(messages.documentNotFoundWithId, StatusCodes.BAD_REQUEST)
      );
    }

    const response: ResponseType<TDoc> = {
      data: doc,
      message: messages.retrieved,
      statusText: statuses.success,
    };
    return res.status(StatusCodes.OK).json(response);
  });

export const getAll = <TDoc extends Document, TModel extends Model<TDoc>>(
  Model: TModel,
  populateOptions?: PopulateOptions[]
) =>
  catchAsync(async (req: ExpressRequest, res: Response) => {
    let filter = {};

    if (isRequestContainsFilterObject(req))
      filter = { ...filter, ...req.filter };
    //searching
    if (req.query.search && typeof req.query.search === "string") {
      /**
       * $text Operator
       * search = "the ninza world!". Ex: content = "welcome to the ninza world"
       * match status = true => since content is `having the ninza world!` eventhough `!` didn't find in the content
       * syntacx: { $search: "the ninza world!"} or { $search: `\"${req.query.search}\"` }
       */
      /**
       * Exact Phrase
       * search = "the ninza world!". Ex: content = "welcome to the ninza world"
       * match status = false => since content doesn't have `!` at the end of "the ninza world"
       * syntacx: {$search: "\"the ninza world!\"" }
       */
      filter = {
        ...filter,
        $text: {
          $search:
            req.query.search_type !== "exact"
              ? `\"${req.query.search}\"`
              : req.query.search,
        },
      };
    }
    const features = new APIFeatures(Model.find(filter), req);
    const count = await Model.countDocuments(features.query);
    const featureQuery = features.filter().sort().limitFields().paginate();

    let query = featureQuery.query;

    if (populateOptions) {
      query.populate(populateOptions);
    }

    const docs: TDoc[] = copyData<TDoc[]>(await query);

    const response: ResponseType<TDoc[]> = {
      data: docs,
      count,
      message: messages.retrieved,
      statusText: statuses.success,
    };
    return res.status(StatusCodes.OK).json(response);
  });
