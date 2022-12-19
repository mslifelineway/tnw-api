import { Model } from "mongoose";
import { UserDocument, UserModel } from "./types";

export async function findByName(
  this: Model<UserModel>,
  name: String
): Promise<UserDocument[]> {
  return this.find({ name });
}
