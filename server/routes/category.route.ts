import { Router } from "express";
import Role from "@/src/constants/role";
import {
  deleteCategoryById,
  getCategoriesHandler,
  getCategoryByIdHandler,
  upsertCategoryHandler,
} from "../controllers/category.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

const categoryRoutes = Router();

categoryRoutes.get("/", authenticate, authorize([Role.Admin]), getCategoriesHandler);
categoryRoutes.delete("/", authenticate, authorize([Role.Admin]), deleteCategoryById);
categoryRoutes.get("/:categoryId", authenticate, authorize([Role.Admin]), getCategoryByIdHandler);
categoryRoutes.post("/upsert", authenticate, authorize([Role.Admin]), upsertCategoryHandler);

export default categoryRoutes;
