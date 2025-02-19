import { Router } from "express";
import {
  deletePageById,
  getPagesHandler,
  getSinglePageByIdHandler,
  upsertPageHandler,
} from "../controllers/page.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

import Role from "../constants/role";

const pageRoutes = Router();

pageRoutes.post("/upsert", authenticate, authorize([Role.Admin]), upsertPageHandler);
pageRoutes.get("/:postId", authenticate, authorize([Role.Admin]), getSinglePageByIdHandler);
pageRoutes.get("/", authenticate, authorize([Role.Admin]), getPagesHandler);
pageRoutes.delete("/", authenticate, authorize([Role.Admin]), deletePageById);

export default pageRoutes;
