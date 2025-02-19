import { Router } from "express";
import {
  deleteCategoryById,
  getCategoriesHandler,
  getSingleCategoryByIdHandler,
  upsertCategoryHandler,
} from "../controllers/category.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

import Role from "../constants/role";

const categoryRoutes = Router();

categoryRoutes.get("/", authenticate, authorize([Role.Admin]), getCategoriesHandler);
categoryRoutes.delete("/", authenticate, authorize([Role.Admin]), deleteCategoryById);
categoryRoutes.get("/:categoryId", authenticate, authorize([Role.Admin]), getSingleCategoryByIdHandler);
categoryRoutes.post("/upsert", authenticate, authorize([Role.Admin]), upsertCategoryHandler);

export default categoryRoutes;
