import { z } from "zod";

export const createPageSchema = z.object({
  _id: z.string().nullable(),
  title: z.string().min(1, {
    message: "Title is required",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }),
  fields: z.array(z.record(z.string(), z.string())).optional(),
  published: z.boolean(),
  publishedAt: z.string().datetime({ offset: true }).pipe(z.coerce.date()).nullable(),
  author: z.string().nullable(),
  coverImageUrl: z.string().optional(),
});
