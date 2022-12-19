import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Post } from "../models";
import {
  CourseOutline,
  CourseOutlineDocument,
} from "../models/courseOutline/types";
import { PostDocument, PostModel } from "../models/post/types";
import {
  CourseOutlineParentAndSublings,
  CourseOutlineParentAndSublingsResponse,
  getCourseOutlineParentAndSublings,
} from "../services";
import { ExpressRequest, ResponseType } from "../types";
import { PostDetails } from "../types/post";
import AppError from "../utils/AppError";
import { catchAsync } from "../utils/catchAsync";
import { messages, statuses } from "../utils/constants";
import { copyData } from "../utils/helpers";
import {
  getOne,
  createOne,
  updateOne,
  deleteOne,
  getAll,
  updateStatusOne,
  deleteOnePermanently,
  restoreOne,
} from "./handlerFactory";

export const getAllPosts = getAll<PostDocument, PostModel>(Post);

export const createPost = createOne<PostDocument, PostModel>(Post);

export const getPost = getOne<PostDocument, PostModel>(Post);

export const updatePost = updateOne<PostDocument, PostModel>(Post);

export const updatePostStatus = updateStatusOne<PostDocument, PostModel>(Post);

export const deletePost = deleteOne<PostDocument, PostModel>(Post);

export const deletePostPermanently = deleteOnePermanently<
  PostDocument,
  PostModel
>(Post);

export const restorePost = restoreOne<PostDocument, PostModel>(Post);

export const getPostDetails = catchAsync(
  async (req: ExpressRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const populateOptions = {
      path: "courseOutline",
      select: "_id name keywords",
    };

    const select: string = "_id id title content keywords";

    const query = Post.findById(id, select).populate(populateOptions);

    const doc = copyData(await query);
    if (!doc) {
      return next(
        new AppError(messages.documentNotFoundWithId, StatusCodes.BAD_REQUEST)
      );
    }

    const courseOutline = doc.courseOutline as CourseOutlineDocument;

    const result: CourseOutlineParentAndSublingsResponse =
      await getCourseOutlineParentAndSublings(courseOutline._id);

    if (result.status !== StatusCodes.OK) {
      return next(new AppError(result.message, result.status));
    }

    const postDetails: PostDetails = {
      _id: doc._id,
      id: doc.id,
      title: doc.title,
      content: doc.content,
      keywords: doc.keywords,
    };
    type PostDetailsResponse = PostDetails & CourseOutlineParentAndSublings;

    const response: ResponseType<PostDetailsResponse> = {
      data: { ...result.sublings, ...postDetails },
      message: messages.retrieved,
      statusText: statuses.success,
    };
    return res.status(StatusCodes.OK).json(response);
  }
);
