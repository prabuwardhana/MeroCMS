import { Router } from "express";
import {
  deleteComponentById,
  getComponentsHandler,
  getComponentByIdHandler,
  upsertComponentHandler,
} from "../controllers/component.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

import Role from "../../constants/role";

const componentRoutes = Router();

componentRoutes.get("/", authenticate, authorize([Role.Admin]), getComponentsHandler);
componentRoutes.delete("/", authenticate, authorize([Role.Admin]), deleteComponentById);
componentRoutes.post("/upsert", authenticate, authorize([Role.Admin]), upsertComponentHandler);
componentRoutes.get("/:componentId", authenticate, authorize([Role.Admin]), getComponentByIdHandler);

export default componentRoutes;
