import { Router } from "express";
import {
  deleteNavMenuById,
  getNavMenusHandler,
  getSingleNavMenuByIdHandler,
  upsertNavMenuHandler,
} from "../controllers/navmenu.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

import Role from "../constants/role";

const navMenuRoutes = Router();

navMenuRoutes.post("/upsert", authenticate, authorize([Role.Admin]), upsertNavMenuHandler);
navMenuRoutes.get("/:postId", getSingleNavMenuByIdHandler);
navMenuRoutes.get("/", getNavMenusHandler);
navMenuRoutes.delete("/", deleteNavMenuById);

export default navMenuRoutes;
