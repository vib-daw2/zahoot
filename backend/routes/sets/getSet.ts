import { Request, Response } from "express";
import getDb from "../../prisma/db";
import { getSetByIdResponse } from "../../schemas/sets/getSetByIdResponse";

export async function handleGetMySets(req: Request, res: Response) {
    const db = await getDb();

    const sets = await db.questionSet.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            Questions: {
                select: {
                    id: true,
                    question: true,
                }
            }
        },
        where: {
            ownerId: req.user!.id,
        }
    });

    const response: getSetByIdResponse[] = sets.map((set) => {
        return {
            id: set.id,
            name: set.name,
            description: set.description,
            Questions: set.Questions,
        };
    });
    return res.status(200).json(response);
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
        select: {
            id: true,
            name: true,
            description: true,
            ownerId: true,
            Questions: {
                select: {
                    id: true,
                    question: true,
                }
            }
        },
        where: {
            id: parseInt(req.params.id)
        }
    });

    if (!set || set.ownerId !== req.user!.id) {
        return res.status(404).json({
            error: true,
            message: "Set not found"
        });
    }

    const response: getSetByIdResponse = {
        id: set.id,
        name: set.name,
        description: set.description,
        Questions: set.Questions,
    };
    return res.status(200).json(response);
}