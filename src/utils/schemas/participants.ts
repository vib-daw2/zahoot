import z from "zod/lib"

export const participantSchema = z.object({
    id: z.number(),
    name: z.string(),
    x: z.number().optional(),
    y: z.number().optional(),
})

export type Participant = z.infer<typeof participantSchema>