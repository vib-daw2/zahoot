import {z} from 'zod';

export const updateSetRequestSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    image: z.any().optional(),
    isPublic: z.boolean().optional(),
    id: z.number(),
});