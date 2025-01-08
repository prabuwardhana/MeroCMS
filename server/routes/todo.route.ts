import { Router } from "express";
import { createTodoHandler } from "../controllers/todo.controller";

const todoRoutes = Router();

// prefix: /auth
todoRoutes.post("/create", createTodoHandler);

export default todoRoutes;
