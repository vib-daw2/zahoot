import {z} from 'zod';

export const createSetRequestSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string(),
    isPublic: z.boolean().optional(),
    image: z.any().optional(),
});