import {z} from 'zod';

export const getSetByIdResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    Questions: z.array(z.object({
        id: z.number(),
        question: z.string(),
        choices: z.array(z.object({
            id: z.number(),
            choice: z.string(),
            isCorrect: z.boolean(),
        })),
    }))
});

export type getSetByIdResponse = z.infer<typeof getSetByIdResponseSchema>;