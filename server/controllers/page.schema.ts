import { z } from "zod";
import { Types } from "mongoose";

export const createPageSchema = z.object({
  _id: z.custom<Types.ObjectId>(),
  title: z.string().min(1, {
    message: "Title is required",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }),
  fields: z.array(z.record(z.string(), z.string())).optional(),
  published: z.boolean(),
  author: z.custom<Types.ObjectId>(),
  coverImageUrl: z.string().optional(),
});
