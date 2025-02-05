import { Types } from "mongoose";
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from "../constants/http";
import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchErrors";
import { createProfileSchema, createUserSchema } from "./user.schema";

export const getCurrentLoggedInUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId).select({ password: 0 });
  appAssert(user, NOT_FOUND, "User not found");
  res.status(OK).json(user);
});

export const getAllUsersHandler = catchErrors(async (_req, res) => {
  const users = await UserModel.find({}).select({ password: 0 });
  res.status(OK).json(users);
});

export const upsertUserHandler = catchErrors(async (req, res) => {
  const {
    _id,
    email,
    password,
    verified,
    profile: { name, username },
  } = createUserSchema.parse({
    ...req.body,
  });

  const documentId = new Types.ObjectId(_id);
  let user;

  if (_id) {
    user = await UserModel.findOneAndUpdate(
      { _id: documentId },
      {
        email,
        verified,
        profile: {
          name,
          username,
        },
      },
      {
        new: true,
        upsert: true, // Make this update into an upsert
      },
    );
  } else {
    user = await UserModel.create({
      email,
      password,
      verified,
      profile: {
        name,
        username,
      },
    });
  }

  res.status(OK).json({ user, message: "user created by Admin" });
});

export const updateUserProfileHandler = catchErrors(async (req, res) => {
  const { name, username, biography, avatarUrl } = createProfileSchema.parse({
    ...req.body,
  });

  // create new user profile
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.userId,
    {
      profile: {
        name,
        username,
        biography,
        avatarUrl,
      },
    },
    { new: true },
  ).select({ password: 0 });
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to add profile");

  res.status(OK).json({ updatedUser, message: "Profile created" });
});

export const getUserByIdHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findOne({ _id: req.params.userId });
  appAssert(user, NOT_FOUND, "User not found");

  res.status(OK).json({
    profile: {
      name: user.profile.name,
      username: user.profile.username,
    },
    email: user.email,
    verified: user.verified,
  });
});

export const deleteUserByIdHandler = catchErrors(async (req, res) => {
  const { id } = req.body;
  await UserModel.findByIdAndDelete({ _id: id });

  res.status(OK).json({
    message: "User is successfully deleted",
  });
});
