import mongoose from "mongoose";
import StorageModel from "../models/storage.model";
import UserModel from "../models/user.model";
import { AppError } from "../utils/app-error";
import { signJwtToken } from "../utils/jwt";
import logger from "../utils/logger";
import {
  LoginSchemaType,
  RegisterSchemaType,
} from "../validators/auth.validator";

export const registerService = async (body: RegisterSchemaType) => {
  const { email } = body;
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const existingUser = await UserModel.findOne({ email }).session(session);
      if (existingUser)
        throw new AppError(
          "User already exists",
          "AUTH_EMAIL_ALREADY_EXISTS",
          409
        );

      const newUser = new UserModel({
        ...body,
        profilePicture: body.profilePicture || null,
      });

      await newUser.save({ session });

      const storage = new StorageModel({
        userId: newUser._id,
      });

      await storage.save({ session });

      return { user: newUser.omitPassword() };
    });
  } catch (error) {
    logger.error("Error registering user", { error });
    throw error;
  } finally {
    await session.endSession();
  }
};

export const loginService = async (body: LoginSchemaType) => {
  const { email, password } = body;
  const user = await UserModel.findOne({ email });
  if (!user)
    throw new AppError("Email/Password not found", "AUTH_USER_NOT_FOUND", 404);

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid)
    throw new AppError(
      "Email/Password is incorrect",
      "ACCESS_UNAUTHORIZED",
      401
    );

  const { token, expiresAt } = signJwtToken({
    userId: user.id,
  });

  return {
    user: user.omitPassword(),
    accessToken: token,
    expiresAt,
  };
};
