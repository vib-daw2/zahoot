import {Request, Response} from "express";
import { updateSetResponse } from "../../schemas/sets/updateSetResponse";
import getDb from "../../prisma/db";
import { updateSetRequestSchema } from "../../schemas/sets/updateSetRequest";

export async function handleUpdateQuestionSet(req: Request, res: Response) {
    const db = await getDb();

    const validated = updateSetRequestSchema.safeParse(req.body);

    if (!validated.success) {
        const response: updateSetResponse = {
            success: false,
            message: validated.error.message,
            id: -1,
        };
        return res.status(400).json(response);
    }

    const original = await db.questionSet.findUnique({
        where: {
            id: validated.data.id
        }
    });

    if (!original || original.ownerId !== req.user!.id) {
        const response: updateSetResponse = {
            success: false,
            message: "Set not found",
            id: -1,
        };
        return res.status(404).json(response);
    }

    const set = await db.questionSet.update({
        where: {
            id: validated.data.id
        },
        data: {
            name: validated.data.name ?? original!.name,
            description: validated.data.description ?? original!.description,
        }
    });

    const response: updateSetResponse = {
        success: true,
        message: "Set updated successfully",
        id: set.id,
    };
    return res.status(200).json(response);
}