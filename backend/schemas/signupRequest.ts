import { z } from "zod";

export const signupRequestSchema = z.object({
    name: z.string().min(1).max(255),
    username: z.string().min(1).max(255),
    password: z.string().min(1).max(255),
    email: z.string().email().min(1).max(255),
});