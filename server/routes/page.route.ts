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
pageRoutes.get("/:postId", getSinglePageByIdHandler);
pageRoutes.get("/", getPagesHandler);
pageRoutes.delete("/", deletePageById);

export default pageRoutes;
