import { z } from 'zod';

export const createQuestionsRequestSchema = z.object({
    questions: z.array(z.object({
        question: z.string(),
        choices: z.array(z.object({
            choice: z.string(),
            isCorrect: z.boolean(),
        })),
        type: z.enum(["multipleAnswer", "trueFalse"]),
        timeLimit: z.number().optional(),
    })),
});