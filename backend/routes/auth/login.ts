import { Request, Response } from "express";
import { loginRequestSchema } from "../../schemas/loginRequest";
import getDb from "../../prisma/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handleLogin(req: Request, res: Response) {
    const validated = loginRequestSchema.safeParse(req.body);

    if (!validated.success) {
        return res.status(400).json({
            status: "error",
            message: validated.error,
        });
    }

    const db = await getDb();

    const user = await db.user.findFirst({
        where: {
            username: validated.data.username,
        },
    });

    if (!user) {
        return res.status(401).json({
            status: "error",
            message: "Invalid username or password",
        });
    } else if (!(await bcrypt.compare(validated.data.password, user.password))) {
        return res.status(401).json({
            status: "error",
            message: "Invalid username or password",
        });
    } else {
        return res.status(200).json({
            status: "success",
            message: "User logged in successfully",
            token: jwt.sign({
                id: user.id,
                username: user.username,
                email: user.email,
            }, process.env.JWT_SECRET!)
        });
    }

}