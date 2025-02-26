import { z } from "zod";

export const createFieldSchema = z.object({
  name: z.string().min(1, {
    message: "Field name is required",
  }),
  label: z.string().min(1, {
    message: "Field label is required",
  }),
  type: z.string().min(1, {
    message: "Field type is required",
  }),
});

export const createPageWidgetSchema = z.object({
  _id: z.string().nullable(),
  title: z.string().min(1, {
    message: "Title is required",
  }),
  fields: z.array(createFieldSchema),
});
