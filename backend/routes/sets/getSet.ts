import { Request, Response } from "express";
import getDb from "../../prisma/db";
import { getSetByIdResponse } from "../../types/routes/sets/getSetByIdResponse";

export async function handleGetMySets(req: Request, res: Response) {
    const db = await getDb();

    const sets = await db.questionSet.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            isPublic: true,
            Questions: {
                select: {
                    id: true,
                    question: true,
                    choices: true
                }
            }
        },
        where: {
            ownerId: req.user!.id,
        }
    });

    const response: getSetByIdResponse[] = sets.map((set: any) => {
        return {
            success: true,
            id: set.id,
            name: set.name,
            description: set.description,
            questions: set.Questions,
            isPublic: set.isPublic,
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
            isPublic: true,
            Questions: {
                select: {
                    id: true,
                    question: true,
                    choices: {
                        select: {
                            id: true,
                            choice: true,
                            isCorrect: true,
                        }
                    },
                }
            }
        },
        where: {
            id: parseInt(req.params.id)
        }
    });

    if (!set) {
        // If the set doesn't exist, return 404
        const response: getSetByIdResponse = {
            success: false,
            message: "Set not found",
            id: -1,
            name: "",
            description: "",
            isPublic: false,
            questions: [],
        };
        return res.status(404).json(response);
    } else if (!req.user && !set.isPublic) {
        // If the set is not public and the user is not logged in, return 401
        const response: getSetByIdResponse = {
            success: false,
            message: "Unauthorized",
            id: -1,
            name: "",
            description: "",
            isPublic: false,
            questions: [],
        };
        return res.status(401).json(response);
    } else if (req.user && req.user.id !== set.ownerId && !set.isPublic) {
        // If the user is not the owner of the set and the set is not public
        const response: getSetByIdResponse = {
            success: false,
            message: "Unauthorized",
            id: -1,
            name: "",
            description: "",
            isPublic: false,
            questions: [],
        };
        return res.status(401).json(response);
    }

    const response: getSetByIdResponse = {
        success: true,
        id: set.id,
        name: set.name,
        description: set.description,
        isPublic: set.isPublic,
        questions: set.Questions,
    };
    return res.status(200).json(response);
}

export async function handleHomePageSets(_req: Request, res: Response) {
    const db = await getDb();

    const sets = await db.questionSet.findMany({
        select: {
            id: true,
            name: true,
            description: true,
            isPublic: true,
            Questions: {
                select: {
                    id: true,
                    question: true,
                }
            }
        },
        where: {
            isPublic: true,
        }
    });

    const response: getSetByIdResponse[] = sets.map((set: any) => {
        return {
            success: true,
            id: set.id,
            name: set.name,
            description: set.description,
            questions: set.Questions,
            isPublic: set.isPublic,
        };
    });
    return res.status(200).json(response);
}