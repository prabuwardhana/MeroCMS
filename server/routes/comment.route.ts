import { Router } from "express";

import {
  createCommentHandler,
  deleteCommentHandler,
  getCommentsOnPostHandler,
  updateCommentHandler,
} from "../controllers/comment.controller";
import verifyAuthCookies from "../middlewares/session";

const commentRoutes = Router();

commentRoutes.patch("/:commentId", verifyAuthCookies, updateCommentHandler);
commentRoutes.delete("/:commentId", verifyAuthCookies, deleteCommentHandler);
commentRoutes.post("/:slug", verifyAuthCookies, createCommentHandler);
commentRoutes.get("/post/:slug", verifyAuthCookies, getCommentsOnPostHandler);

export default commentRoutes;
