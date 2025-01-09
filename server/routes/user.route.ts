import { Router } from "express";
import { z } from "zod";
import { NOT_FOUND, OK } from "../constants/http";
import catchErrors from "../utils/catchErrors";
import UserModel from "../models/user.model";
import authorize from "../middlewares/authorize";
import Role from "../constants/role";
import authenticate from "../middlewares/authenticate";
import appAssert from "../utils/appAssert";

const userRoutes = Router();

export const createUserSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255),
  verified: z.boolean(),
});

// prefix: /user
userRoutes.get(
  "/",
  authenticate,
  catchErrors(async (req, res) => {
    const user = await UserModel.findById(req.userId).select("-password");
    appAssert(user, NOT_FOUND, "User not found");
    res.status(OK).json(user);
  }),
);

userRoutes.get(
  "/all",
  catchErrors(async (req, res) => {
    const users = await UserModel.find({}).select("-password");
    res.status(OK).json(users);
  }),
);

userRoutes.post(
  "/create",
  authenticate,
  authorize([Role.Admin]),
  catchErrors(async (req, res) => {
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
  }),
);

export default userRoutes;
