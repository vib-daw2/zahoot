import {z} from 'zod';

export const getSetByIdResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    id: z.number(),
    name: z.string(),
    description: z.string(),
    questions: z.array(z.object({
        id: z.number(),
        question: z.string(),
        choices: z.array(z.object({
            id: z.number(),
            choice: z.string(),
            isCorrect: z.boolean(),
        })),
    })),
    isPublic: z.boolean(),
});

export type getSetByIdResponse = z.infer<typeof getSetByIdResponseSchema>;