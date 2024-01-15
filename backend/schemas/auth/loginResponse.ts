import {z} from 'zod';

export const loginResponseSchema = z.object({
    error: z.boolean(),
    message: z.string(),
    token: z.string().optional(),
});

export type loginResponse = z.infer<typeof loginResponseSchema>;