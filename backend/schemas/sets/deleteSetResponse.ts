import {z} from 'zod';

export const deleteSetResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

export type deleteSetResponse = z.infer<typeof deleteSetResponseSchema>;