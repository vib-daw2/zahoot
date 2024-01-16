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

    beforeEach(async () => {
        await axios.post("http://localhost:3000/api/auth/signup", {
            name: "test",
            username: "test",
            password: "test",
            email: "test@test.test"
        })
    });

    it("Should create a set", async () => {
        const login = await axios.post("http://localhost:3000/api/auth/login", {
            username: "test",
            password: "test",
        });

        const token = login.data.token;

        await axios.post("http://localhost:3000/api/sets", {
            name: "test",
            description: "test",
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            expect(res.status).toEqual(200);
            expect(res.data.success).toEqual(true);
        });
    });

    it("Should not create a set if not logged in", async () => {
        await axios.post("http://localhost:3000/api/sets", {
            name: "test"
        }).catch((err) => {
            expect(err.response.status).toEqual(401);
        });
    });

    it("Should not create a set if name is not provided", async () => {
        const login = await axios.post("http://localhost:3000/api/auth/login", {
            username: "test",
            password: "test",
        });

        const token = login.data.token;

        await axios.post("http://localhost:3000/api/sets", {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch((err) => {
            expect(err.response.status).toEqual(400);
        });
    });
});