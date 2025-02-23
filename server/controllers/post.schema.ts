import { z } from "zod";
import type { CustomPartialBlock } from "@/components/admin/Blocknote";
import type { CloudinaryResourceType } from "@/lib/types";

export const createPostSchema = z.object({
  _id: z.string().nullable(),
  title: z.string().min(1, {
    message: "Title is required",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }),
  excerpt: z.string().optional(),
  editorContent: z.custom<CustomPartialBlock[] | "loading">().optional(),
  published: z.boolean(),
  publishedAt: z.string().datetime({ offset: true }).pipe(z.coerce.date()).nullable(),
  author: z.string().nullable(),
  coverImage: z.custom<CloudinaryResourceType>(),
  categories: z.array(z.string()),
});
