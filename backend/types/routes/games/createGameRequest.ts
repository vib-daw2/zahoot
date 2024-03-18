import { z } from "zod";

export const createGameRequestSchema = z.object({
    questionSetId: z.number(),
});