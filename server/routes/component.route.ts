import { Router } from "express";
import {
  deleteComponentById,
  getComponentsHandler,
  getSingleComponentByIdHandler,
  upsertComponentHandler,
} from "../controllers/component.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

import Role from "../constants/role";

const componentRoutes = Router();

componentRoutes.get("/", authenticate, authorize([Role.Admin]), getComponentsHandler);
componentRoutes.delete("/", deleteComponentById);
componentRoutes.post("/upsert", authenticate, authorize([Role.Admin]), upsertComponentHandler);
componentRoutes.get("/:componentId", authenticate, authorize([Role.Admin]), getSingleComponentByIdHandler);

export default componentRoutes;
