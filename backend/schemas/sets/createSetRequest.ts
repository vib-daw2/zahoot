import {z} from 'zod';

export const createSetRequestSchema = z.object({
    name: z.string(),
    description: z.string(),
    image: z.any().optional(),
});