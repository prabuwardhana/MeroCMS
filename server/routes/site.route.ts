import { Router } from "express";
import { getPostBySlugHandler } from "../controllers/post.controller";
import { getNavMenuByTitleHandler } from "../controllers/navmenu.controller";

const siteRoutes = Router();

siteRoutes.get("/blog/:slug", getPostBySlugHandler);
siteRoutes.get("/nav/:title", getNavMenuByTitleHandler);

export default siteRoutes;
