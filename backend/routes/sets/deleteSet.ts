import {Request, Response} from "express";
import getDb from "../../prisma/db";
import { deleteSetResponse } from "../../types/routes/sets/deleteSetResponse";

export async function handleDeleteQuestionSet(req: Request, res: Response) {
    const db = await getDb();

    const set = await db.questionSet.findUnique({
        where: {
            id: parseInt(req.params.id)
        }
    });

    if (!set || set.ownerId !== req.user!.id) {
        const response: deleteSetResponse = {
            success: false,
            message: "Set not found",
        };
        return res.status(404).json(response);
    }

    await db.questionSet.delete({
        where: {
            id: parseInt(req.params.id)
        }
    });
    
    const response: deleteSetResponse = {
        success: true,
        message: "Set deleted successfully",
    };
    return res.status(200).json(response);
}