import { Router } from "express";
import { getPostBySlugHandler } from "../controllers/post.controller";
import { getNavMenuByTitleHandler } from "../controllers/navmenu.controller";
import { getPageBySlugHandler } from "../controllers/page.controller";

const siteRoutes = Router();

siteRoutes.get("/blog/:slug", getPostBySlugHandler);
siteRoutes.get("/page/:slug", getPageBySlugHandler);
siteRoutes.get("/nav/:title", getNavMenuByTitleHandler);

export default siteRoutes;
