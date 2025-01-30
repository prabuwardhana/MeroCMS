import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { createProfileSchema, createUserSchema } from "./user.schema";

export const getSingleUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId).select("-password");
  appAssert(user, NOT_FOUND, "User not found");
  res.status(OK).json(user);
});

export const getAllUsersHandler = catchErrors(async (req, res) => {
  const users = await UserModel.find({}).select("-password");
  res.status(OK).json(users);
});

export const createUserHandler = catchErrors(async (req, res) => {
  const { email, password, verified } = createUserSchema.parse({
    ...req.body,
  });

  // create new user
  const user = await UserModel.create({
    email,
    password,
    verified,
  });

  res.status(OK).json({ user, message: "user created by Admin" });
});

export const updateUserProfileHandler = catchErrors(async (req, res) => {
  const { username } = createProfileSchema.parse({
    ...req.body,
  });

  // create new user profile
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.userId,
    {
      profile: { _id: "0".repeat(24), username },
    },
    { new: true },
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to add profile");

  res.status(OK).json({ updatedUser, message: "Profile created" });
});
