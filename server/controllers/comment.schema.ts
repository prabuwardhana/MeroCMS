import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1, {
    message: "Content is required",
  }),
  parent: z.string().nullable(),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, {
    message: "Content is required",
  }),
});
