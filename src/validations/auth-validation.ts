import z from "zod"
export const loginFormSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter email'),
    password: z
        .string()
        .min(1, 'Password is required')
});

export type LoginForm = z.infer<typeof loginFormSchema>;