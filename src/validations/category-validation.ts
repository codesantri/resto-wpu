import { z } from "zod";

export const categorySchema = z.object({
  name: z.string(),
});

export const categoryFormValidate = z.object({
  name: z.string().min(1, "Name is required"),
});

export type Category = z.infer<typeof categorySchema> & { id: string };
export type CategoryForm = z.infer<typeof categoryFormValidate>;
