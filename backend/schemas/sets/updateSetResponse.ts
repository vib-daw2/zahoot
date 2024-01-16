import {z} from 'zod';

export const updateSetResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    id: z.number(),
});

export type updateSetResponse = z.infer<typeof updateSetResponseSchema>;