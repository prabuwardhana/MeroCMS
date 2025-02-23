import { z } from "zod";
import { Item } from "@/components/admin/NestableList/libs/types";

export const createNavMenuSchema = z.object({
  _id: z.string().nullable(),
  title: z.string().min(1, {
    message: "Title is required",
  }),
  navMenuContent: z.custom<Item[]>().optional(),
});
