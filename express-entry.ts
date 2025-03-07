import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { APP_BASE_URL, NODE_ENV } from "./server/constants/env";
import { OK } from "./core/constants/http";
import connectToDatabase from "./server/config/db";
import verifyAuthCookies from "./server/middlewares/session";
import errorHandler from "./server/middlewares/error";
import todoRoutes from "./server/routes/todo.route";
import vikeRoutes from "./server/routes/vike.route";
import authRoutes from "./server/routes/auth.route";
import userRoutes from "./server/routes/user.route";
import postRoutes from "./server/routes/post.route";
import commentRoutes from "./server/routes/comment.route";
import mediaRoutes from "./server/routes/media.route";
import categoryRoutes from "./server/routes/category.route";
import navMenuRoutes from "./server/routes/navmenu.route";
import pageWidgetRoutes from "./server/routes/component.route";
import pageRoutes from "./server/routes/page.route";
import siteRoutes from "./server/routes/site.route";
import { createDevMiddleware } from "vike/server";

const isProduction = NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = __dirname;
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const hmrPort = process.env.HMR_PORT ? parseInt(process.env.HMR_PORT, 10) : 24678;

export default (await startServer()) as unknown;

async function startServer() {
  const app = express();

  if (isProduction) {
    app.use(express.static(`${root}/dist/client`));
  } else {
    const { devMiddleware } = await createDevMiddleware({
      root,
      viteConfig: { server: { middlewareMode: true, hmr: { port: hmrPort } } },
    });
    app.use(devMiddleware);
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      origin: APP_BASE_URL,
      credentials: true,
    }),
  );
  app.use(cookieParser());

  // health check
  app.get("/api", (_req, res) => {
    return res.status(OK).json({
      status: "healthy",
    });
  });

  // API routes
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/todo", todoRoutes);
  app.use("/api/post", postRoutes);
  app.use("/api/comment", commentRoutes);
  app.use("/api/page", pageRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/navmenu", navMenuRoutes);
  app.use("/api/page-widget", pageWidgetRoutes);
  app.use("/api/media", mediaRoutes);
  app.use("/api/site", siteRoutes);

  /**
   * Vike route
   *
   * @link {@see https://vike.dev}
   **/
  app.all("*", verifyAuthCookies, vikeRoutes);

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server running at ${APP_BASE_URL}:${port} in ${NODE_ENV} environment`);
    connectToDatabase();
  });

  return app;
}
