import { Request, Response } from 'express';
import getDb from '../../prisma/db';

export default async function handleStats(req: Request, res: Response) {
    const db = getDb();

    const getCreatedSetsCount = db.questionSet.count({
        where: {
            ownerId: req.user!.id
        }
    });

    // We get the created games count
    const getCreatedGamesCount = db.user.findUnique({
        where: {
            id: req.user!.id
        },
        select: {
            createdGamesCount: true
        }
    }).then((user) => {
        return user!.createdGamesCount;
    });

    const [createdSetsCount, createdGamesCount] = await Promise.all([getCreatedSetsCount, getCreatedGamesCount]);

    return res.status(200).json({
        success: true,
        createdSetsCount,
        createdGamesCount
    });
}