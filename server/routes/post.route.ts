import { Router } from "express";
import {
  upsertPostHandler,
  getSinglePostByIdHandler,
  getPostsHandler,
  deletePostById,
  getPostPreviewHandler,
} from "../controllers/post.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

import Role from "../constants/role";

const postRoutes = Router();

postRoutes.post("/upsert", authenticate, authorize([Role.Admin]), upsertPostHandler);
postRoutes.get("/preview/:postId", authenticate, authorize([Role.Admin]), getPostPreviewHandler);
postRoutes.get("/:postId", getSinglePostByIdHandler);
postRoutes.get("/", getPostsHandler);
postRoutes.delete("/", deletePostById);

export default postRoutes;
