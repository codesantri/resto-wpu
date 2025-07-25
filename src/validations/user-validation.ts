import { z } from "zod";

export const userFormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  name: z.string().min(1, 'Name is required').max(255, 'Max 255 karakter'),
  role: z.string().min(1, 'Role is required'),
  password: z.string().min(1, 'Password is required'),
  avatar_url: z.union([
    z.string().min(1, 'Image is required'),
    z.instanceof(File),
  ])
});

export type UserForm = z.infer<typeof userFormSchema>;
