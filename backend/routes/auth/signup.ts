import { Request, Response } from 'express';
import { signupRequestSchema } from '../../types/routes/auth/signupRequest';
import getDb from '../../prisma/db';
import bcrypt from 'bcrypt';
import { signupResponse } from '../../types/routes/auth/signupResponse';

export default async function handleSignup(req: Request, res: Response) {

    const validated = signupRequestSchema.safeParse(req.body);

    if (!validated.success) {
        const response: signupResponse = {
            error: true,
            message: validated.error.message
        };
        return res.status(400).json(response);
    }

    const db = getDb();

    if (await db.user.findFirst({
        where: {
            OR: [
                {
                    username: validated.data.username
                },
                {
                    email: validated.data.email
                }
            ]
        }
    })) {
        const response: signupResponse = {
            error: true,
            message: "User already exists"
        };
        return res.status(409).json(response);
    } else {
        let hashed = await bcrypt.hash(validated.data.password, 10);
        await db.user.create({
            data: {
                name: validated.data.name,
                username: validated.data.username,
                password: hashed,
                email: validated.data.email,
            }
        });
        const response: signupResponse = {
            error: false,
            message: "User created"
        };
        return res.status(200).json(response);
    }
}