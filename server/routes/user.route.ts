import { Router } from "express";
import Role from "@/core/constants/role";
import {
  upsertUserHandler,
  updateUserProfileHandler,
  getUsersHandler,
  deleteUserByIdHandler,
  getUserByIdHandler,
} from "../controllers/user.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

const userRoutes = Router();

// prefix: /user
userRoutes.get("/", authenticate, authorize([Role.Admin]), getUsersHandler);
userRoutes.post("/", authenticate, authorize([Role.Admin]), upsertUserHandler);
userRoutes.delete("/", authenticate, authorize([Role.Admin]), deleteUserByIdHandler);
userRoutes.post("/profile", authenticate, authorize([Role.Admin]), updateUserProfileHandler);
userRoutes.get("/:userId", authenticate, authorize([Role.Admin]), getUserByIdHandler);

export default userRoutes;
