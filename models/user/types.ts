import { Document, Model } from "mongoose";
export interface User {
  name?: string;
  email?: string;
  phone?: string;
  about?: string;
  photo?: string;
  password?: string;
  passwordConfirm?: string | undefined;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  role?: string;
  active?: boolean;
  deleted?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserDocument extends User, Document {
  correctPassword: (
    providedPassword: string,
    documentPassword: string
  ) => Promise<Boolean>;
  checkChangedPasswordAfterTokenIssued: (JWTTimestamp: number) => Boolean;
  createPasswordResetToken: () => string;
}

//MODEL
export interface UserModel extends Model<UserDocument> {}
