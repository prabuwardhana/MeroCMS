import { Router } from "express";
import Role from "@/src/constants/role";
import {
  deleteNavMenuById,
  getNavMenusHandler,
  getNavMenuByIdHandler,
  upsertNavMenuHandler,
} from "../controllers/navmenu.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

const navMenuRoutes = Router();

navMenuRoutes.post("/upsert", authenticate, authorize([Role.Admin]), upsertNavMenuHandler);
navMenuRoutes.get("/:navId", authenticate, authorize([Role.Admin]), getNavMenuByIdHandler);
navMenuRoutes.get("/", authenticate, authorize([Role.Admin]), getNavMenusHandler);
navMenuRoutes.delete("/", authenticate, authorize([Role.Admin]), deleteNavMenuById);

export default navMenuRoutes;
