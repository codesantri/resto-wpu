import { z } from "zod";

export const userSchema = z.object({
  name: z.string(),
  email: z.string(),
  role: z.string(),
  password: z.string(),
  avatar_url: z.union([
    z.string(),
    z.instanceof(File),
  ]),
});

export const userCreateFormValidate = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  name: z.string().min(1, 'Name is required').max(255, 'Max 255 karakter'),
  role: z.string().min(1, 'Role is required'),
  password: z.string().min(1, 'Password is required'),
  avatar_url: z.union([
    z.string().min(1, 'Image is required'),
    z.instanceof(File),
  ])
});

export const userUpdateFormValidate = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Max 255 karakter'),
  role: z.string().min(1, 'Role is required'),
  avatar_url: z.union([
    z.string().min(1, 'Image is required'),
    z.instanceof(File),
  ])
});

export type User = z.infer<typeof userSchema> & { id: string };
export type UserCreateForm = z.infer<typeof userCreateFormValidate>;
export type UserUpdateForm = z.infer<typeof userUpdateFormValidate>;

