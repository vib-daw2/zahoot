import axios from "axios";
import getDb from "../prisma/db";

describe("Sets CRUD should work", () => {

    afterEach(async () => {
        const db = await getDb();
        await db.user.deleteMany({
            where: {
                username: "test"
            }
        });
    });

});