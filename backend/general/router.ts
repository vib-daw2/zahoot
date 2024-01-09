import express from "express";
import { Request, Response } from "express";

const router = express.Router();

router.get("/ping", (_req: Request, res: Response) => {
    res.send("pong");
});

export default router;
