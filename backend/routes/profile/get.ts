import { Request, Response } from 'express';
import getDb from '../../prisma/db';

export default async function handleGetMyProfile(req: Request, res: Response) {

    const db = getDb();

    const profile = await db.user.findUnique({
        where: {
            id: req.user!.id
        },
        select: {
            username: true,
            email: true,
            name: true,
            isAdmin: true,
        }
    });

    if (!profile) {
        return res.status(404).json({ message: 'Profile not found' });
    }

    return res.json(profile);
}