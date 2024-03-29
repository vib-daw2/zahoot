import {z} from 'zod';

export const loginResponseSchema = z.object({
    error: z.boolean(),
    message: z.string(),
    token: z.string().optional(),
    data: z.object({
        name: z.string(),
        username: z.string(),
        email: z.string(),
        isAdmin: z.boolean().optional().default(false),
    }).optional(),
});

export type loginResponse = z.infer<typeof loginResponseSchema>;