import { Request, Response } from "express";
import getDb from "../../prisma/db";
import { createSetRequestSchema } from "../../schemas/sets/createSetRequest";
import { createSetResponse } from "../../schemas/sets/createSetResponse";

export async function handleCreateQuestionSet(req: Request, res: Response) {
    const db = await getDb();

    const validated = createSetRequestSchema.safeParse(req.body);

    if (!validated.success) {
        const response: createSetResponse = {
            success: false,
            message: validated.error.message,
            id: -1,
            imageUrl: ""
        };
        return res.status(400).json(response);
    }

    const set = await db.questionSet.create({
        data: {
            name: validated.data.name,
            ownerId: req.user!.id,
            description: validated.data.description
        }
    });

    const response: createSetResponse = {
        success: true,
        message: "Set created successfully",
        id: set.id,
        imageUrl: ""
    };
    return res.status(200).json(response);
}