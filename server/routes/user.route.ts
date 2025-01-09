import { Router } from "express";
import { createUserHandler, getAllUsersHandler, getSingleUserHandler } from "../controllers/user.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

import Role from "../constants/role";

const userRoutes = Router();

// prefix: /user
userRoutes.get("/", authenticate, getSingleUserHandler);
userRoutes.get("/all", authenticate, getAllUsersHandler);
userRoutes.post("/create", authenticate, authorize([Role.Admin]), createUserHandler);

export default userRoutes;
