import { Router } from "express";
import Role from "@/core/constants/role";
import {
  deletePageWidgetById,
  getPageWidgetsHandler,
  getPageWidgetByIdHandler,
  upsertPageWidgetHandler,
} from "../controllers/component.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

const pageWidgetRoutes = Router();

pageWidgetRoutes.get("/", authenticate, authorize([Role.Admin]), getPageWidgetsHandler);
pageWidgetRoutes.delete("/", authenticate, authorize([Role.Admin]), deletePageWidgetById);
pageWidgetRoutes.post("/upsert", authenticate, authorize([Role.Admin]), upsertPageWidgetHandler);
pageWidgetRoutes.get("/:pageWidgetId", authenticate, authorize([Role.Admin]), getPageWidgetByIdHandler);

export default pageWidgetRoutes;
