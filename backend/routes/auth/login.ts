import { Request, Response } from "express";
import { loginRequestSchema } from "../../types/routes/auth/loginRequest";
import getDb from "../../prisma/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtPayload } from "../../types/jwtPayload";
import { loginResponse } from "../../types/routes/auth/loginResponse";

export default async function handleLogin(req: Request, res: Response) {
    const validated = loginRequestSchema.safeParse(req.body);

    if (!validated.success) {
        const response: loginResponse = {
            error: true,
            message: validated.error.message,
        };
        return res.status(400).json(response);
    }

    const db = await getDb();

    const user = await db.user.findFirst({
        where: {
            username: validated.data.username,
        },
    });

    if (!user) {
        const response: loginResponse = {
            error: true,
            message: "Invalid username or password",
        };
        return res.status(401).json(response);
    } else if (!(await bcrypt.compare(validated.data.password, user.password))) {
        const response: loginResponse = {
            error: true,
            message: "Invalid username or password",
        };
        return res.status(401).json(response);
    } else {
        const payload: jwtPayload = {
            id: user.id,
            username: user.username,
            email: user.email,
        };
        const response: loginResponse = {
            error: false,
            message: "User logged in successfully",
            token: jwt.sign(payload, process.env.JWT_SECRET!),
        };
        return res.status(200).json(response);
    }

}