import { z } from "zod";

export const TableStatusEnum = z.enum(["available", "unavailable", "reserved"]);

export const tableSchema = z.object({
  name: z.string(),
  description: z.string(),
  capacity: z.number(),
  status: TableStatusEnum,
});

export const tableFormValidate = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  capacity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Capacity is required")
  ),
  status: TableStatusEnum
});

export type Table = z.infer<typeof tableSchema> & { id: string };
export type TableForm = z.infer<typeof tableFormValidate>;
