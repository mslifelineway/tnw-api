import bcrypt from "bcryptjs";
import crypto from "crypto";
import { UserDocument } from "./types";

export async function correctPassword(
  providedPassword: string,
  documentPassword: string
) {
  return await bcrypt.compare(providedPassword, documentPassword);
}

export function checkChangedPasswordAfterTokenIssued(
  this: UserDocument,
  JWTTimestamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedPasswordTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedPasswordTimestamp;
  }
  return false;
}

export function createPasswordResetToken(this: UserDocument): string {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 10000);
  return resetToken;
}
