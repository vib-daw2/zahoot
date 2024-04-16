import z from "zod/lib"

export const participantSchema = z.object({
    id: z.number(),
    name: z.string(),
    x: z.number().optional(),
    y: z.number().optional(),
    points: z.number().optional(),
    responses: z.array(z.boolean()).optional(),
})

export type Participant = z.infer<typeof participantSchema>

export type GameQuestion = {
    question: string;
    choices: {
        choice: string 
    }[]
}
