import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import generalRouter from "./routes/general/router";
import authRouter from "./routes/auth/router";
import setsRouter from "./routes/sets/router";
import questionsRouter from "./routes/questions/router";
import gamesRouter from "./routes/games/router";
import profileRouter from "./routes/profile/router";

import handleConnection from "./ws/handle";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET not set");
  process.exit(1);
} else if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
} 

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: { origin: "*" }});

app.use(cors()); // Add cors middleware
app.use(express.json());

app.use("/api", generalRouter); // Ping (health check)
app.use("/api/auth", authRouter); // Signup, login
app.use("/api/sets", setsRouter); // Create, read, update, delete sets
app.use("/api/questions", questionsRouter); // Create and update questions
app.use("/api/games", gamesRouter); // Create and join games
app.use("/api/profile", profileRouter); // Get user profile

io.on("connection", handleConnection);

const port = process.env.PORT || "0.0.0.0:3000";
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default io;