import { Router } from "express";
import Role from "@/constants/role";
import {
  deletePageById,
  getPagesHandler,
  getPageByIdHandler,
  upsertPageHandler,
  publishPageHandler,
} from "../controllers/page.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

const pageRoutes = Router();

pageRoutes.post("/upsert", authenticate, authorize([Role.Admin]), upsertPageHandler);
pageRoutes.patch("/publish/:pageId", authenticate, authorize([Role.Admin]), publishPageHandler);
pageRoutes.get("/:pageId", authenticate, authorize([Role.Admin]), getPageByIdHandler);
pageRoutes.get("/", authenticate, authorize([Role.Admin]), getPagesHandler);
pageRoutes.delete("/", authenticate, authorize([Role.Admin]), deletePageById);

export default pageRoutes;
