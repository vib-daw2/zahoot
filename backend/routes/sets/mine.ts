import { Request, Response } from "express";
import getDb from "../../prisma/db";

export async function handleGetMySets(req: Request, res: Response) {
    const db = await getDb();

    const sets = await db.questionSet.findMany({
        where: {
            ownerId: req.user!.id,
        }
    });

    return res.status(200).json(sets);
}