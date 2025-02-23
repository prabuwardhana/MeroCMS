import { z } from "zod";

export const createCommentSchema = z.object({
  content: z.string().min(1, {
    message: "Content is required",
  }),
  parentId: z.string().nullable(),
});
