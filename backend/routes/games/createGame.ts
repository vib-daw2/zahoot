import { Request, Response } from "express";
import getDb from "../../prisma/db";
import { createGameRequestSchema } from "../../types/routes/games/createGameRequest";

export default async function handleCreateGame(req: Request, res: Response) {
    const db = getDb();

    // We validate the request body
    const validated = createGameRequestSchema.safeParse(req.body);
    if (!validated.success) {
        return res.status(400).json({ message: validated.error.message });
    }

    // We check if the question set exists and is owned by the user
    const { questionSetId } = validated.data;
    const questionSet = await db.questionSet.findUnique({
        where: {
            id: questionSetId,
            ownerId: req.user!.id,
        },
    });

    if (!questionSet) {
        return res.status(404).json({ message: "Question set not found" });
    }

    // We generate a random game pin
    let gamePin = Math.floor(10000 + Math.random() * 90000).toString();
    let exists = true;
    while (exists) {
        exists = await db.ongoingGame.findFirst({
            where: {
                questionSetId,
                gamePin
            },
        }).then((game) => {
            return game !== null;
        });
        gamePin = Math.floor(10000 + Math.random() * 90000).toString();
    }

    // We create the game
    const game = await db.ongoingGame.create({
        data: {
            questionSetId,
            gamePin,
        },
    });

    return res.json({ pin: game.gamePin });
}