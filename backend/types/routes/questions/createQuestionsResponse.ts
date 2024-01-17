import {z} from 'zod';

export const createQuestionsResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

export type createQuestionsResponse = z.infer<typeof createQuestionsResponseSchema>;