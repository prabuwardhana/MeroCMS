import { z } from "zod";
import { CustomPartialBlock } from "./types";

// Create or edit post form schema
export const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  slug: z.string().min(1, {
    message: "Slug is required",
  }),
  editorContent: z.custom<CustomPartialBlock[] | "loading">().optional(),
});
