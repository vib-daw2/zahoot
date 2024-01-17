import {z} from 'zod';

export const createSetResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    id: z.number(),
    imageUrl: z.string()
});

export type createSetResponse = z.infer<typeof createSetResponseSchema>;