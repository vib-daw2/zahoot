import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

export default function getDb() {
    if (!db) {
        db = new PrismaClient({
        });
    }
    return db;
}