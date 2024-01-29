import axios from "axios";
import getDb from "../prisma/db";
import { getSetByIdResponseSchema } from "../types/routes/sets/getSetByIdResponse";
import { getMySetsResponseSchema } from "../types/routes/sets/getMySetsResponse";

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

    it("Should create a set and retrieve its info", async () => {
        const login = await axios.post("http://localhost:3000/api/auth/login", {
            username: "test",
            password: "test",
        });

        const token = login.data.token;

        let id = -1;
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
            expect(res.data.id).toBeGreaterThan(0);
            id = res.data.id;
        });

        await axios.get(`http://localhost:3000/api/sets/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            expect(res.status).toEqual(200);
            expect(res.data.id).toEqual(id);
            expect(res.data.name).toEqual("test");
            expect(res.data.description).toEqual("test");
            expect(getSetByIdResponseSchema.safeParse(res.data).success).toEqual(true);
        });

        await axios.get(`http://localhost:3000/api/sets/mine`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            expect(res.status).toEqual(200);
            expect(res.data.length).toEqual(1);
            expect(res.data[0].id).toEqual(id);
            expect(res.data[0].name).toEqual("test");
            expect(res.data[0].description).toEqual("test");
            expect(getMySetsResponseSchema.safeParse(res.data).success).toEqual(true);
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

    it("Should return 404 if trying to retrieve a set that doesn't exist", async () => {
        const login = await axios.post("http://localhost:3000/api/auth/login", {
            username: "test",
            password: "test",
        });

        const token = login.data.token;

        const db = await getDb();

        let notExists = true;
        let id = -1;
        while (!notExists) {
            id = Math.floor(Math.random() * 1000000);
            const set = await db.questionSet.findUnique({
                where: {
                    id: id
                }
            });
            if (!set) {
                notExists = false;
            }
        }

        await axios.get(`http://localhost:3000/api/sets/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).catch((err) => {
            expect(err.response.status).toEqual(404);
        });
    });

    it("Should create a public set and retrieve it without auth if it is public", async () => {
        const login = await axios.post("http://localhost:3000/api/auth/login", {
            username: "test",
            password: "test",
        });
    
        const token = login.data.token;
    
        let id = -1;
        await axios.post("http://localhost:3000/api/sets", {
            name: "publicTest",
            description: "publicTest",
            isPublic: true
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            expect(res.status).toEqual(200);
            expect(res.data.success).toEqual(true);
            expect(res.data.id).toBeGreaterThan(0);
            id = res.data.id;
        });
    
        await axios.get(`http://localhost:3000/api/sets/${id}`).then((res) => {
            expect(res.status).toEqual(200);
            expect(res.data.id).toEqual(id);
            expect(res.data.name).toEqual("publicTest");
            expect(res.data.description).toEqual("publicTest");
            expect(res.data.isPublic).toEqual(true);
        });
    });    

    it("Should not retrieve a set if it is not public and not owned by the user", async () => {
        const login = await axios.post("http://localhost:3000/api/auth/login", {
            username: "test",
            password: "test",
        });
    
        const token = login.data.token;
    
        let id = -1;
        await axios.post("http://localhost:3000/api/sets", {
            name: "privateTest",
            description: "privateTest",
            isPublic: false
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            expect(res.status).toEqual(200);
            expect(res.data.success).toEqual(true);
            expect(res.data.id).toBeGreaterThan(0);
            id = res.data.id;
        });
    
        await axios.get(`http://localhost:3000/api/sets/${id}`).catch((err) => {
            expect(err.response.status).toEqual(401);
        });
    });
});