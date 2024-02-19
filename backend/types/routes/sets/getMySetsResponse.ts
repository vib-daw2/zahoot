import {z} from 'zod';

export const getMySetsResponseSchema = z.array(z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    Questions: z.array(z.object({
        id: z.number(),
        question: z.string(),
    }))
}));

export type getMySetsResponse = z.infer<typeof getMySetsResponseSchema>;