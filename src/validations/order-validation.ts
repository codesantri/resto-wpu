import { z } from "zod";

export const orderSchema = z.object({
  customer_name: z.string(),
  status: z.string(),
  payment_url: z.string(),
  table_id:z.string(),
});

export const orderFormValidate = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  table_id: z.string().min(1, "Select a table"),
  status: z.string().min(1, "Select a table"),
});

export type Order = z.infer<typeof orderSchema> & { id: string };
export type OrderForm = z.infer<typeof orderFormValidate>;
