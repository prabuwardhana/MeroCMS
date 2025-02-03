import { z } from "zod";
import { Types } from "mongoose";
import { CloudinaryResourceType, CustomPartialBlock } from "@/lib/types";

export const createPostSchema = z.object({
  _id: z.custom<Types.ObjectId>(),
  title: z.string().min(1, {
    message: "Title is required",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }),
  editorContent: z.custom<CustomPartialBlock[] | "loading">().optional(),
  published: z.boolean(),
  author: z.custom<Types.ObjectId>(),
  coverImage: z.custom<CloudinaryResourceType>(),
  categories: z.array(z.string()),
});
