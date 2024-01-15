import { Request, Response } from "express";

export default async function handlePing(req: Request, res: Response) {
    res.status(200).send("pong");
}