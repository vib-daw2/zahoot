import { z } from 'zod';

export const signupResponseSchema = z.object({
    error: z.boolean(),
    message: z.string(),
});

export type signupResponse = z.infer<typeof signupResponseSchema>;