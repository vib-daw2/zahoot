import { Request, Response } from "express";

export default async function handleCreateGame(req: Request, res: Response) {
    res.status(200).send("pong");
}