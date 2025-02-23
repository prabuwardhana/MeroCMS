import { z } from "zod";

export const createCategorySchema = z.object({
  _id: z.string().nullable(),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }),
  description: z.string(),
});
