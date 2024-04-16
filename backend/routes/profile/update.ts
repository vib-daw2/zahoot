import { Request, Response } from 'express';
import getDb from '../../prisma/db';

export default async function handleUpdate(req: Request, res: Response) {
    const db = getDb();
    const { name, email, username } = req.body;

    // For each field that is not empty, update the user
    let existing = await db.user.findUnique({
        where: {
            id: req.user!.id,
        },
    });

    if (!existing) {
        return res.status(404).json({ message: "User not found" });
    }

    await db.user.update({
        where: {
            id: req.user!.id,
        },
        data: {
            name: name || existing.name,
            email: email || existing.email,
            username: username || existing.username,
        },
    });

    return res.status(200).json({ message: "User updated" });
}