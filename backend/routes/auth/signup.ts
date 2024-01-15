import { Request, Response } from 'express';
import { signupRequestSchema } from '../../schemas/signupRequest';
import getDb from '../../prisma/db';
import bcrypt from 'bcrypt';

export default async function handleSignup(req: Request, res: Response) {

    const validated = signupRequestSchema.safeParse(req.body);

    if (!validated.success) {
        return res.status(400).json({
            status: "error",
            message: validated.error,
        });
    }

    const db = await getDb();

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
        return res.status(409).json({
            status: "error",
            message: "User already exists"
        });
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
        return res.status(200).json({
            status: "success",
            message: "User created successfully"
        });
    }
}