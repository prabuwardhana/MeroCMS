import { Router } from "express";
import {
  getCategoriesHandler,
  getSingleCategoryByIdHandler,
  upsertCategoryHandler,
} from "../controllers/category.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

import Role from "../constants/role";

const categoryRoutes = Router();

categoryRoutes.get("/", getCategoriesHandler);
categoryRoutes.get("/:categoryId", getSingleCategoryByIdHandler);
categoryRoutes.post("/upsert", authenticate, authorize([Role.Admin]), upsertCategoryHandler);

export default categoryRoutes;
