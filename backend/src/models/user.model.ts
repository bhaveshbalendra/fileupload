import mongoose, { Document, Schema, Types } from "mongoose";
import type { UserDocument } from "../types/database.types";
import { compareValue, hashValue } from "../utils/bcrypt";

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, select: true },
    profilePicture: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    if (this.password) {
      this.password = await hashValue(this.password);
    }
  }
  next();
});

userSchema.methods.comparePassword = async function (value: string) {
  return compareValue(value, this.password);
};

userSchema.methods.omitPassword = function (): Omit<UserDocument, "password"> {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
