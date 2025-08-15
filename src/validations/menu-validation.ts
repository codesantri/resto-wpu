import z from "zod";

export const menuSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  discount: z.number(),
  category_id: z.string(),
  image_url: z.union([
    z.string(),
    z.instanceof(File),
  ]),
  is_available: z.boolean(),
});

export const menuFormValidate = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.preprocess((val) => Number(val), z.number().min(1, 'Price is required')),
  discount: z.preprocess((val) => Number(val), z.number().min(0, 'Discount is required')),
  category_id: z.string().min(1, 'Category is required'),
  image_url: z.union([
    z.string().url().or(z.literal('')), // "" biar aman kalau nggak upload baru
    z.instanceof(File)
  ]).optional(),

  is_available: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean()
  )
});


export type Menu = z.infer<typeof menuSchema> & { id: string };
export type MenuForm = z.infer<typeof menuFormValidate>;
