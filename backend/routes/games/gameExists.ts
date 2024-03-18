import getDb from "../../prisma/db";
import { Request, Response } from "express";

export default async function handleGameExists(req: Request, res: Response){
    const db = await getDb();
    const { pin } = req.query
    if (!pin) {
        return res.status(400).json({ message: "Game pin is required" });
    }

    const game = await db.ongoingGame.findFirst({
        where: {
            gamePin: pin.toString(),
        },
    });

    if (!game) {
        return res.status(404).json({ message: "Game not found" });
    }

    return res.json({ exists: true });
}