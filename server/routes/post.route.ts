import { Router } from "express";
import Role from "@/constants/role";
import {
  upsertPostHandler,
  getPostByIdHandler,
  getPostsHandler,
  deletePostById,
  getPostPreviewHandler,
  publishPostHandler,
} from "../controllers/post.controller";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

const postRoutes = Router();

postRoutes.post("/upsert", authenticate, authorize([Role.Admin]), upsertPostHandler);
postRoutes.get("/preview/:postId", authenticate, authorize([Role.Admin]), getPostPreviewHandler);
postRoutes.patch("/publish/:postId", authenticate, authorize([Role.Admin]), publishPostHandler);
postRoutes.get("/:postId", authenticate, authorize([Role.Admin]), getPostByIdHandler);
postRoutes.get("/", authenticate, authorize([Role.Admin]), getPostsHandler);
postRoutes.delete("/", authenticate, authorize([Role.Admin]), deletePostById);

export default postRoutes;
