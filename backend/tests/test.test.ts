import axios from "axios";

describe("Test", () => {
    it("should return true", () => {
        expect(true).toBe(true);
    });

    it("should respond to ping", async () => {
        await axios.get("http://localhost:3000/api/ping").then(res => {
            expect(res.status).toBe(200);
            expect(res.data).toBe("pong");
        });
    });
});