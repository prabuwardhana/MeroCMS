import { z } from "zod";
import { Types } from "mongoose";
import { Item } from "@/components/NestableList/Libs/types";

export const createNavMenuSchema = z.object({
  _id: z.custom<Types.ObjectId>(),
  title: z.string().min(1, {
    message: "Title is required",
  }),
  navMenuContent: z.custom<Item[]>().optional(),
});
