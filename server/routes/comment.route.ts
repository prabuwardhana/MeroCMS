import { Router } from "express";
import Role from "@/src/constants/role";
import {
  approveCommentHandler,
  createCommentHandler,
  deleteCommentHandler,
  getCommentHandler,
  getCommentsHandler,
  getPostCommentsHandler,
  updateCommentHandler,
} from "../controllers/comment.controller";
import verifyAuthCookies from "../middlewares/session";
import authenticate from "../middlewares/authenticate";
import authorize from "../middlewares/authorize";

const commentRoutes = Router();

commentRoutes.get("/", authenticate, authorize([Role.Admin]), getCommentsHandler);
commentRoutes.get("/:commentId", authenticate, authorize([Role.Admin]), getCommentHandler);
commentRoutes.patch("/approve/:commentId", authenticate, authorize([Role.Admin]), approveCommentHandler);
commentRoutes.patch("/:commentId", verifyAuthCookies, updateCommentHandler);
commentRoutes.delete("/:commentId", verifyAuthCookies, deleteCommentHandler);
commentRoutes.post("/post/:slug", verifyAuthCookies, createCommentHandler);
commentRoutes.get("/post/:slug", getPostCommentsHandler);

export default commentRoutes;
