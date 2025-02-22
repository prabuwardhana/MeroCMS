import { z } from "zod";
import { Types } from "mongoose";

export const createCommentSchema = z.object({
  content: z.string().min(1, {
    message: "Content is required",
  }),
  parentId: z.custom<Types.ObjectId>().nullable(),
});
