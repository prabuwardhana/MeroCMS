import { Router } from "express";
import { getPostBySlugHandler } from "../controllers/post.controller";

const siteRoutes = Router();

siteRoutes.get("/blog/:slug", getPostBySlugHandler);

export default siteRoutes;
