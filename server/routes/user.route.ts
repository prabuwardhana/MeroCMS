import { Router } from "express";
import {
  upsertUserHandler,
  updateUserProfileHandler,
  getAllUsersHandler,
  getCurrentLoggedInUserHandler,
  deleteUserByIdHandler,
  getUserByIdHandler,
} from "../controllers/user.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

import Role from "../constants/role";

const userRoutes = Router();

// prefix: /user
userRoutes.get("/", authenticate, authorize([Role.Admin]), getAllUsersHandler);
userRoutes.post("/", authenticate, authorize([Role.Admin]), upsertUserHandler);
userRoutes.delete("/", authenticate, authorize([Role.Admin]), deleteUserByIdHandler);
userRoutes.get("/whoami", authenticate, getCurrentLoggedInUserHandler);
userRoutes.post("/profile", authenticate, authorize([Role.Admin]), updateUserProfileHandler);
userRoutes.get("/:userId", authenticate, authorize([Role.Admin]), getUserByIdHandler);

export default userRoutes;
