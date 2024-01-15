import { Request, Response } from 'express';
import { signupRequestSchema } from '../../schemas/signupRequest';
import getDb from '../../prisma/db';
import bcrypt from 'bcrypt';

export default async function handleSignup(req: Request, res: Response) {

    const validatedSignupRequest = signupRequestSchema.safeParse(req.body);

    if (!validatedSignupRequest.success) {
        return res.status(400).json({
            status: "error",
            message: validatedSignupRequest.error,
        });
    }

    const db = await getDb();

    if (await db.user.findFirst({
        where: {
            OR: [
                {
                    username: validatedSignupRequest.data.username
                },
                {
                    email: validatedSignupRequest.data.email
                }
            ]
        }
    })) {
        return res.status(409).json({
            status: "error",
            message: "User already exists"
        });
    } else {
        let hashed = await bcrypt.hash(validatedSignupRequest.data.password, 10);
        await db.user.create({
            data: {
                name: validatedSignupRequest.data.name,
                username: validatedSignupRequest.data.username,
                password: hashed,
                email: validatedSignupRequest.data.email,
            }
        });
        return res.status(200).json({
            status: "success",
            message: "User created successfully"
        });
    }
}