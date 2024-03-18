import { Request, Response } from 'express';
import getDb from '../../prisma/db';
import { createQuestionsRequestSchema } from '../../types/routes/questions/createQuestionsRequest';
import { createQuestionsResponse } from '../../types/routes/questions/createQuestionsResponse';
import { TypeOf } from 'zod';
import { PrismaClient } from '@prisma/client';

export async function handleCreateQuestions(req: Request, res: Response) {
    const db = await getDb();

    // We validate the request body
    const validated = createQuestionsRequestSchema.safeParse(req.body);
    if (!validated.success) {
        const response: createQuestionsResponse = {
            success: false,
            message: validated.error.message,
        };
        return res.status(400).json(response);
    }

    const { questions, name, description } = validated.data;

    // We check if the question set exists and if the user owns it
    const questionSet = await db.questionSet.findUnique({
        where: {
            id: parseInt(req.params.id),
            ownerId: req.user!.id,
        },
    });

    if (!questionSet) {
        const response: createQuestionsResponse = {
            success: false,
            message: "Question set not found",
        };
        return res.status(404).json(response);
    }

    // If the user wants to update the questions
    if (questions) {
        // We delete all the questions in the set first
        await db.question.deleteMany({
            where: {
                setId: questionSet.id,
            },
        });

        // We insert the new questions
        await helperCreateQuestionsInSet(questions, questionSet.id, db);
    }

    // If the user wants to update the name or description
    if (name) {
        await db.questionSet.update({
            where: { id: questionSet.id },
            data: { name },
        });
    }

    // If the user wants to update the description
    if (description) {
        await db.questionSet.update({
            where: { id: questionSet.id },
            data: { description },
        });
    }


    // Return success
    const response: createQuestionsResponse = {
        success: true,
        message: "Questions created successfully",
    };
    return res.status(200).json(response);
}


async function helperCreateQuestionsInSet(questions: TypeOf<typeof createQuestionsRequestSchema>["questions"], setId: number, db: PrismaClient) {
    await db.$transaction(async (prisma) => {
        await prisma.questionSet.update({
            where: {
                id: setId,
            },
            data: {
                Questions: {
                    createMany: {
                        data: questions!.map((question) => ({ // Sabemos que questions no es undefined
                            question: question.question,
                            type: question.type,
                            timeLimit: question.timeLimit,
                        })),
                    },
                },
            },
        });

        for (const question of questions!) {
            const createdQuestion = await prisma.question.findFirst({
                where: {
                    question: question.question,
                    setId: setId,
                },
                orderBy: {
                    id: "desc",
                },
            });

            if (!createdQuestion) {
                continue;
            }

            await prisma.choice.createMany({
                data: question.choices.map((choice) => ({
                    choice: choice.choice,
                    isCorrect: choice.isCorrect,
                    questionId: createdQuestion.id,
                })),
            });

        }
    },
        {
            maxWait: 10000,
            timeout: 10000,
            isolationLevel: "Serializable"
        }

    );
}