import { Router } from "express";
import Role from "@/constants/role";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

import { deleteResourceHandler, getResourcesHandler } from "../controllers/media.controller";

const mediaRoutes = Router();

mediaRoutes.post("/resources/delete", authenticate, authorize([Role.Admin]), deleteResourceHandler);
mediaRoutes.get("/resources/:next_cursor?", authenticate, authorize([Role.Admin]), getResourcesHandler);

export default mediaRoutes;
