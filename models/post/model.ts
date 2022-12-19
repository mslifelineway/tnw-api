import { model } from "mongoose";
import { modelNames } from "../../utils/constants";
import postSchema from "./schema";
import { PostDocument, PostModel } from "./types";

export const Post: PostModel = model<PostDocument>(modelNames.Post, postSchema);
