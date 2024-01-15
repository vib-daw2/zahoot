import axios from "axios";
import getDb from "../prisma/db";

describe("Auth process", () => {

    afterEach(async () => {
        const db = await getDb();
        await db.user.deleteMany({
            where: {
                username: "test"
            }
        });
    });

    it("Should not allow to register with a non valid email", async () => {
        await axios.post("http://localhost:3000/api/auth/signup", {
            name: "test",
            username: "test",
            password: "test",
            email: "test",
        }).catch((err) => {
            expect(err.response.status).toEqual(400);
        });
    });

    it("Should return 401 if user is not registered", async () => {
        await axios.post("http://localhost:3000/api/auth/login", {
            username: "test",
            password: "test",
        }).catch((err) => {
            expect(err.response.status).toEqual(401);
        });
    });

    it("Should return 409 if the user already exists", async () => {
        await axios.post("http://localhost:3000/api/auth/signup", {
            name: "test",
            username: "test",
            password: "test",
            email: "test@test.test"
        }).then((data) => {
            expect(data.status).toEqual(200);
            expect(data.data.error).toEqual(false);
        })

        await axios.post("http://localhost:3000/api/auth/signup", {
            name: "test",
            username: "test",
            password: "test",
            email: "test@test.test"
        }).catch((err) => {
            expect(err.response.status).toEqual(409);
        });
    });

    it("Should register and login", async () => {
        await axios.post("http://localhost:3000/api/auth/signup", {
            name: "test",
            username: "test",
            password: "test",
            email: "test@test.test"
        }).then((data) => {
            expect(data.status).toEqual(200);
            expect(data.data.error).toEqual(false);
        })

        let token = "";

        await axios.post("http://localhost:3000/api/auth/login", {
            username: "test",
            password: "test",
        }).then((data) => {
            expect(data.status).toEqual(200);
            expect(data.data.token).toBeDefined();
            token = data.data.token;    
        })

        // Wait 1 sec
        await new Promise(resolve => setTimeout(resolve, 1000));

        await axios.post("http://localhost:3000/api/auth/login", {
            username: "test",
            password: "test",
        }).then((data) => {
            if (data.data.token === token) {
                throw new Error("Tokens are the same");
            }
            expect(data.status).toEqual(200);
        })
    });

    it("Should return 401 if the password is incorrect", async () => {
        await axios.post("http://localhost:3000/api/auth/signup", {
            name: "test",
            username: "test",
            password: "test",
            email: "test@test.test"
        }).then((data) => {
            expect(data.status).toEqual(200);
            expect(data.data.error).toEqual(false);
        })

        await axios.post("http://localhost:3000/api/auth/login", {
            username: "test",
            password: "test2",
        }).catch((err) => {
            expect(err.response.status).toEqual(401);
        });

        await axios.post("http://localhost:3000/api/auth/login", {
            username: "test",
            password: "test",
        }).then((data) => {
            expect(data.status).toEqual(200);
        })
    });
});