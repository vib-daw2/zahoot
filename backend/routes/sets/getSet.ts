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

export async function handleGetSetById(req: Request, res: Response) {
    const db = await getDb();

    if (!req.params.id) {
        return res.status(400).json({
            error: true,
            message: "Missing id"
        });
    }

    const set = await db.questionSet.findUnique({
        where: {
            id: parseInt(req.params.id)
        }, include: {
            Questions: true
        }
    });

    if (!set || set.ownerId !== req.user!.id) {
        return res.status(404).json({
            error: true,
            message: "Set not found"
        });
    }

    return res.status(200).json(set);
}