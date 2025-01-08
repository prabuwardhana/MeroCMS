import { RequestHandler } from "express";

export const createTodoHandler: RequestHandler = async (req, res) => {
  const newTodo = req.body;

  console.log("Received new todo", newTodo);

  return res.status(200).json({
    status: "OK",
  });
};
