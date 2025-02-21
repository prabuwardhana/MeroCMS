import { Router } from "express";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

import Role from "../../constants/role";
import { deleteResourceHandler, getResourcesHandler } from "../controllers/media.controller";

const mediaRoutes = Router();

mediaRoutes.post("/resources/delete", authenticate, authorize([Role.Admin]), deleteResourceHandler);
mediaRoutes.get("/resources/:next_cursor?", authenticate, authorize([Role.Admin]), getResourcesHandler);

export default mediaRoutes;
