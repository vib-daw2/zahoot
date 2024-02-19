import { z } from "zod";

export const loginRequestSchema = z.object({
    username: z.string().min(1).max(255),
    password: z.string().min(1).max(255),
});